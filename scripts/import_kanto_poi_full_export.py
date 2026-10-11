#!/usr/bin/env python3
"""Import the verified Genspark 2026-10-11 full export without overwriting existing stats.

Dry-run:
 python3 scripts/import_kanto_poi_full_export.py /path/to/full-export_20261011_1207
Apply:
 python3 scripts/import_kanto_poi_full_export.py /path/to/full-export_20261011_1207 --apply

Only existing station entries are enriched; 264 new station candidates remain separate.
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/data/station-stats-data.json"
FIELDS = frozenset("""fastFoodCount mallCount bankCount postOfficeCount pharmacyCount nurseryCount schoolCount universityCount libraryCount clinicCount cinemaCount gymCount hotelCount attractionCount parkCount""".split())


def load(path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def run(source, apply):
    directory = source / "poi-800m"
    fill = load(directory / "station-stats-data.kanto800.fill.json")
    new = load(directory / "station-stats-data.kanto800.new-stations.json")
    verification = load(source / "VERIFICATION.json")
    if len(fill) != 1242 or len(new) != 264:
        raise ValueError(f"Unexpected export size: fill={len(fill)} new={len(new)}")
    if verification.get("counts", {}).get("collected") != 1516:
        raise ValueError("Export collection verification is not complete")
    if not all(check.get("ok") is True for check in verification.get("checks", [])):
        raise ValueError("Export verification contains failed checks")
    stats = load(TARGET)
    report = {"fill_records": len(fill), "new_station_candidates_not_imported": len(new),
              "matched": 0, "unmatched": [], "added_fields": 0, "existing_fields_preserved": 0}
    for station, record in fill.items():
        if not isinstance(record, dict):
            raise ValueError(f"Bad station record: {station}")
        values = {key: value for key, value in record.items() if key in FIELDS}
        if len(values) != len(FIELDS):
            raise ValueError(f"Missing 800m fields: {station}")
        if station not in stats:
            report["unmatched"].append(station)
            continue
        report["matched"] += 1
        for key, value in values.items():
            if type(value) is not int or value < 0:
                raise ValueError(f"Invalid count: {station}.{key}={value!r}")
            if key not in stats[station] or stats[station][key] is None:
                stats[station][key] = value
                report["added_fields"] += 1
            else:
                report["existing_fields_preserved"] += 1
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if report["unmatched"]:
        raise ValueError("Station name mismatch: do not silently drop source records")
    if apply:
        TARGET.write_text(json.dumps(stats, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path, help="Extracted full-export_20261011_1207 directory")
    parser.add_argument("--apply", action="store_true", help="Write src/data/station-stats-data.json")
    args = parser.parse_args()
    run(args.source, args.apply)
