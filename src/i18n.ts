import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
// Bundle the English translation into the initial JS bundle.
//
// The previous setup loaded ALL languages via HttpBackend on first paint —
// that's a 244 KB HTTP fetch + JSON parse for English alone. Combined with
// react-i18next's default `useSuspense: true`, the WHOLE React tree was
// suspended until translation.json arrived. On a fresh cold start this is
// what made the boot splash visible for 6 seconds (warm starts hit the
// HTTP cache and finished in ~1 second — the cold-vs-warm asymmetry was
// the giveaway).
//
// Bundling EN means cold-start renders translated text from byte zero, no
// fetch, no Suspense stall. Other languages are still streamed via
// HttpBackend when the user actually switches to them — `partialBundled-
// Languages: true` is the i18next flag that says "trust resources for
// what's there, fall through to backend for what isn't".
import enTranslation from "../public/locales/en/translation.json";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "es", "ru", "uk", "zh"],
    nonExplicitSupportedLngs: true, // accept "en-US" → "en" etc.
    debug: false,
    // Pre-bundled English so cold-start has translations immediately.
    // partialBundledLanguages tells i18next that `resources` is incomplete
    // (only `en`); for any other language it falls through to HttpBackend.
    resources: {
      en: { translation: enTranslation },
    },
    partialBundledLanguages: true,
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
    react: {
      // Don't suspend the React tree while translations stream in. With
      // EN bundled above, components mount with real strings on first
      // paint; for any other language the fetch happens in parallel
      // with the rest of mount and useTranslation() rerenders when it
      // resolves. Suspense=true was the actual cold-start blocker.
      useSuspense: false,
    },
  });

export default i18n;
