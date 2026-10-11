#!/usr/bin/env python3
"""Safely merge supplied 800m Kanto POI data into station-stats-data.json.

Run from repository root:
  python3 scripts/integrate_kanto_poi.py --source /path/to/flex-kanto-integration
  python3 scripts/integrate_kanto_poi.py --source /path/to/flex-kanto-integration --apply
"""
import argparse
import json
from pathlib import Path

FIELDS = frozenset("fastFoodCount mallCount bankCount postOfficeCount pharmacyCount nurseryCount schoolCount universityCount libraryCount clinicCount cinemaCount gymCount hotelCount attractionCount parkCount".split())
ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/data/station-stats-data.json"


def read(path):
    return json.loads(path.read_text(encoding="utf-8"))


def merge(current, fill):
    report = {"source_stations": len(fill), "matched_stations": 0, "missing_stations": [], "fields_added": 0, "preserved_conflicts": 0}
    for name, fields in fill.items():
        if not isinstance(fields, dict) or set(fields) - FIELDS:
            raise ValueError(f"Unexpected POI fields: {name}")
        if name not in current:
            report["missing_stations"].append(name)
            continue
        report["matched_stations"] += 1
        entry = current[name]
        for key, value in fields.items():
            if type(value) is not int or value < 0:
                raise ValueError(f"Invalid POI count: {name}.{key}")
            if key not in entry:
                entry[key] = value
                report["fields_added"] += 1
            elif entry[key] != value:
                report["preserved_conflicts"] += 1
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="Extracted flex-kanto-integration directory")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    source = args.source / "data"
    fill = read(source / "station-stats-data.kanto800.fill.json")
    new = read(source / "station-stats-data.kanto800.new-stations.json")
    current = read(TARGET)
    report = merge(current, fill)
    report["new_station_candidates_not_imported"] = len(new)
    report["applied"] = args.apply
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if args.apply:
        TARGET.write_text(json.dumps(current, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
