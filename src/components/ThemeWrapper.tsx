import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import RailwayMap from './RailwayMap';
import RailwayMapV2 from '../v2/RailwayMapV2';
import Footer from './Footer';
import NavigationBar from './NavigationBar';
import AdSenseAd from './AdSenseAd';
import StickyBottomAd from './StickyBottomAd';
import type { Language } from '../utils/translation';
import { getInitialLanguage, persistLanguage } from '../utils/languagePersistence';
import { getInitialUiVersion, persistUiVersion, type UiVersion } from '../utils/uiVersionPersistence';
import { isEmbedMode } from '../utils/embedMode';
import { hideAppLoading, scheduleAppLoadingFailsafe, setAppLoadingStage } from '../utils/appLoading';

/**
 * v2 UI切り替えボタンの表示フラグ。
 *
 * v2は開発途上のため通常は非表示にしておく。コード自体は残してあるので、
 * この定数を true にすればナビゲーションバーに切り替えボタンが戻る。
 * URLに ?ui=v2 を付ければこのフラグに関係なくv2を確認できる（開発用）。
 */
const SHOW_UI_VERSION_TOGGLE = false;

const ThemeWrapper: React.FC = () => {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uiVersion, setUiVersion] = useState<UiVersion>(() => getInitialUiVersion(SHOW_UI_VERSION_TOGGLE));
  // 記事に埋め込む表示（?embed=1, src/utils/embedMode.ts）では地図だけを出す
  const [embedded] = useState(isEmbedMode);

  useEffect(() => {
    // 埋め込み表示の言語（記事の言語）で、閲覧者が地図ページで選んだ言語を上書きしない
    if (!embedded) persistLanguage(language);
  }, [language, embedded]);

  useEffect(() => {
    persistUiVersion(uiVersion);
  }, [uiVersion]);

  // 読み込み画面（constants/appLoading.ts）。ここでは消さずに段階を進め、地図を最初に描いた後に RailwayMap が消す。
  // 以前はここで消していて、地図ライブラリが届くまで仮表示とフッターが見えていた。
  // v2 UI は RailwayMap を使わないのでここで消す。何かで消し損ねても一定時間で必ず消す
  useEffect(() => {
    if (uiVersion === 'v2') { hideAppLoading(); return; }
    setAppLoadingStage('routes', language);
    return scheduleAppLoadingFailsafe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      {/* 追従型広告: RailwayMap より先に置くことで同z-index競合時に地図が前面に来る */}
      {!isFullscreen && !embedded && <StickyBottomAd adSlot="0987654321" />}
      {!embedded && <NavigationBar
        language={language}
        onLanguageChange={handleLanguageChange}
        isFullscreen={isFullscreen}
        uiVersion={uiVersion}
        {...(SHOW_UI_VERSION_TOGGLE ? { onUiVersionChange: setUiVersion } : {})}
      />}
      {uiVersion === 'v2' ? (
        <RailwayMapV2 language={language} onFullscreenChange={setIsFullscreen} />
      ) : (
        <RailwayMap language={language} onLanguageChange={handleLanguageChange} onFullscreenChange={setIsFullscreen} />
      )}
      {!embedded && <Footer language={language} />}
    </ThemeProvider>
  );
};

export default ThemeWrapper;
