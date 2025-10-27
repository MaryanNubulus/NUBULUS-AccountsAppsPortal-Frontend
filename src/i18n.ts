import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

//Auth module translations
import authEN from "./modules/auth/locales/en.json";
import authES from "./modules/auth/locales/es.json";
import authCA from "./modules/auth/locales/ca.json";

// Shared module translations
import sharedEN from "./modules/shared/locales/en.json";
import sharedES from "./modules/shared/locales/es.json";
import sharedCA from "./modules/shared/locales/ca.json";

// Apps module translations
import appsEN from "./modules/apps/locales/en.json";
import appsES from "./modules/apps/locales/es.json";
import appsCA from "./modules/apps/locales/ca.json";

// Users module translations
import usersEN from "./modules/users/locales/en.json";
import usersES from "./modules/users/locales/es.json";
import usersCA from "./modules/users/locales/ca.json";

// Initialize
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        apps: appsEN,
        auth: authEN,
        shared: sharedEN,
        users: usersEN,
      },
      es: {
        apps: appsES,
        auth: authES,
        shared: sharedES,
        users: usersES,
      },
      ca: {
        apps: appsCA,
        auth: authCA,
        shared: sharedCA,
        users: usersCA,
      },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
