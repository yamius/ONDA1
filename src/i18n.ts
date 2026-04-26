import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Persistence rule:
//   1. If the user previously picked a language, use it (i18next-browser-
//      languagedetector reads it from localStorage under `i18nextLng`).
//   2. Otherwise fall back to navigator.language.
//   3. Final fallback is English.
//
// Earlier this file did `localStorage.removeItem('i18nextLng')` followed by
// `lng: "en"` on every init, which wiped the user's choice on every cold
// start, every WebView reload after a permission prompt, and every error-
// recovery boot. The two lines together produced the bug where switching to
// (say) Ukrainian in Settings, then backgrounding the app, snapped the UI
// back to English. Both removed below.

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "ru", "uk", "zh"],
    nonExplicitSupportedLngs: true, // accept "en-US" → "en" etc.
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "./locales/{{lng}}/translation.json",
    },
    detection: {
      // localStorage first so an explicit user choice always wins, then
      // navigator (system language). The detector also writes the chosen
      // language back to localStorage automatically when changeLanguage()
      // fires from the picker.
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

export default i18n;
