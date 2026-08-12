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

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  useEffect(() => {
    persistUiVersion(uiVersion);
  }, [uiVersion]);

  // JS読み込み完了後にローディング画面を非表示にする
  useEffect(() => {
    const el = document.getElementById('app-loading');
    if (el) el.style.display = 'none';
  }, []);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      {/* 追従型広告: RailwayMap より先に置くことで同z-index競合時に地図が前面に来る */}
      {!isFullscreen && <StickyBottomAd adSlot="0987654321" />}
      <NavigationBar
        language={language}
        onLanguageChange={handleLanguageChange}
        isFullscreen={isFullscreen}
        uiVersion={uiVersion}
        {...(SHOW_UI_VERSION_TOGGLE ? { onUiVersionChange: setUiVersion } : {})}
      />
      {uiVersion === 'v2' ? (
        <RailwayMapV2 language={language} onFullscreenChange={setIsFullscreen} />
      ) : (
        <RailwayMap language={language} onLanguageChange={handleLanguageChange} onFullscreenChange={setIsFullscreen} />
      )}
      <Footer language={language} />
    </ThemeProvider>
  );
};

export default ThemeWrapper;
