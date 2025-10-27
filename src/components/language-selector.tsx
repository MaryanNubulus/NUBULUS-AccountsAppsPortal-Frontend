import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "ca", name: "Català" },
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation("shared");

  return (
    <Select
      value={i18n.language}
      onValueChange={(value: string) => i18n.changeLanguage(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t("layout.header.language.select")} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
