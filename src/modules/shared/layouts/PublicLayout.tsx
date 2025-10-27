import { LanguageSelector } from "@/components/language-selector";
import { ModeToggle } from "@/components/mode-toggle";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm ">
          <Outlet />
        </div>
        <div className="fixed top-4 right-4 flex items-center gap-3 md:top-6 md:right-6">
          <LanguageSelector />
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
