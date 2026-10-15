/**
 * 記事の一覧（並び順＝記事一覧ページの順）。
 * 記事を足すときは、{slug}.ts を作ってここに1行足す（手順は docs/article-writing.md）。
 */
import type { ArticleSource } from './types';
import { tokyoRentByRoute } from './tokyo-rent-by-route';
import { flexRailMapIntroduction } from './flex-rail-map-introduction';
import { tokyoTrainMapBeginner } from './tokyo-train-map-beginner';
import { tokyoSightseeingRoutes } from './tokyo-sightseeing-routes';
import { commute30minCheapRent } from './commute-30min-cheap-rent';
import { tokyoSafeAreaByRoute } from './tokyo-safe-area-by-route';
import { howToReadStationNumbers } from './how-to-read-station-numbers';

import { guide_airport_terminal_train_station_names } from './airport-terminal-train-station-names';
import { guide_akihabara_lines_transfer } from './akihabara-lines-transfer';
import { guide_asakusa_multiple_stations } from './asakusa-multiple-stations';
import { guide_asakusa_skytree_stations } from './asakusa-skytree-stations';
import { guide_disneyland_maihama_keiyo } from './disneyland-maihama-keiyo';
import { guide_enoshima_three_station_names } from './enoshima-three-station-names';
import { guide_fujikyu_railway_transfer } from './fujikyu-railway-transfer';
import { guide_hakone_odakyu_transfer } from './hakone-odakyu-transfer';
import { guide_haneda_keikyu_monorail_map } from './haneda-keikyu-monorail-map';
import { guide_kamakura_enoden_stations } from './kamakura-enoden-stations';
import { guide_kawagoe_tobu_vs_jr } from './kawagoe-tobu-vs-jr';
import { guide_narita_jr_keisei_map } from './narita-jr-keisei-map';
import { guide_nikko_tobu_vs_jr } from './nikko-tobu-vs-jr';
import { guide_odaiba_yurikamome_rinkai } from './odaiba-yurikamome-rinkai';
import { guide_shibuya_harajuku_omotesando_map } from './shibuya-harajuku-omotesando-map';
import { guide_shinjuku_station_line_first } from './shinjuku-station-line-first';
import { guide_tokyo_metro_line_letters } from './tokyo-metro-line-letters';
import { guide_tokyo_station_otemachi_difference } from './tokyo-station-otemachi-difference';
import { guide_ueno_keisei_ueno_difference } from './ueno-keisei-ueno-difference';
import { guide_yokohama_minatomirai_line } from './yokohama-minatomirai-line';

export const ARTICLE_SOURCES: ArticleSource[] = [
  tokyoRentByRoute,
  flexRailMapIntroduction,
  tokyoTrainMapBeginner,
  tokyoSightseeingRoutes,
  commute30minCheapRent,
  tokyoSafeAreaByRoute,
  howToReadStationNumbers,
  guide_airport_terminal_train_station_names,
  guide_akihabara_lines_transfer,
  guide_asakusa_multiple_stations,
  guide_asakusa_skytree_stations,
  guide_disneyland_maihama_keiyo,
  guide_enoshima_three_station_names,
  guide_fujikyu_railway_transfer,
  guide_hakone_odakyu_transfer,
  guide_haneda_keikyu_monorail_map,
  guide_kamakura_enoden_stations,
  guide_kawagoe_tobu_vs_jr,
  guide_narita_jr_keisei_map,
  guide_nikko_tobu_vs_jr,
  guide_odaiba_yurikamome_rinkai,
  guide_shibuya_harajuku_omotesando_map,
  guide_shinjuku_station_line_first,
  guide_tokyo_metro_line_letters,
  guide_tokyo_station_otemachi_difference,
  guide_ueno_keisei_ueno_difference,
  guide_yokohama_minatomirai_line,
];
