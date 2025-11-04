// translations.ts - Account module i18n registration

import i18n from "../../i18n";
import en from "./locales/en.json";
import es from "./locales/es.json";
import ca from "./locales/ca.json";

i18n.addResourceBundle("en", "accounts", en);
i18n.addResourceBundle("es", "accounts", es);
i18n.addResourceBundle("ca", "accounts", ca);
