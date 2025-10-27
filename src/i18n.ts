import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export type TranslationResource = {
  [namespace: string]: {
    [key: string]: any;
  };
};

export type TranslationResources = {
  en: TranslationResource;
  es: TranslationResource;
  ca: TranslationResource;
};

export function registerTranslations(
  namespace: string,
  resources: {
    en: any;
    es: any;
    ca: any;
  }
) {
  Object.entries(resources).forEach(([lang, resource]) => {
    i18n.addResourceBundle(lang, namespace, resource, true, true);
  });
}

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
