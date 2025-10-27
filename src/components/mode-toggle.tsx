import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle({ isIcon = true }: { isIcon?: boolean }) {
  const { setTheme } = useTheme();
  const { t } = useTranslation("shared");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isIcon ? "outline" : "ghost"}
          size={isIcon ? "icon" : "sm"}
          className={isIcon ? "" : "w-full justify-start relative"}
        >
          <Sun
            className={
              isIcon
                ? "h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
                : "absolute h-[1rem] w-[1rem] left-0 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            }
          />
          <Moon
            className={
              isIcon
                ? "absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
                : "absolute h-[1rem] w-[1rem] left-0 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            }
          />
          {isIcon ? (
            <span className="sr-only">{t("layout.header.toggleTheme")}</span>
          ) : (
            <span className="ml-4">{t("layout.header.toggleTheme")}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isIcon ? "end" : "center"} sideOffset={4}>
        <DropdownMenuItem
          onClick={() => {
            setTheme("light");
            window.location.reload();
          }}
        >
          {t("layout.header.theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            window.location.reload();
          }}
        >
          {t("layout.header.theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
            window.location.reload();
          }}
        >
          {t("layout.header.theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
