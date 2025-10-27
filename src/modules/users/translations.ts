import { registerTranslations } from "@/i18n";

// Import translations
import en from "./locales/en.json";
import es from "./locales/es.json";
import ca from "./locales/ca.json";

// Register translations
registerTranslations("users", { en, es, ca });
