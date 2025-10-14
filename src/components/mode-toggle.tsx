import { Moon, Sun } from "lucide-react";

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isIcon ? "outline" : "ghost"}
          size={isIcon ? "icon" : "sm"}
          className="w-full relative justify-start"
        >
          <Sun
            className={
              isIcon
                ? "h-[1.2rem] w-[1.2rem]"
                : "h-[1rem] w-[1rem] absolute left-0" +
                  " scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
            }
          />
          <Moon
            className={
              isIcon
                ? "h-[1.2rem] w-[1.2rem]"
                : "h-[1rem] w-[1rem] left-0" +
                  " absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
            }
          />

          {isIcon ? (
            <span className="sr-only">Toggle theme</span>
          ) : (
            <span className="ml-4">Theme</span>
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
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("dark");
            window.location.reload();
          }}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTheme("system");
            window.location.reload();
          }}
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
