import { Button } from "@/components/ui/button";
import { useAuthViewModel } from "./viewmodel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const { signInUrl } = useAuthViewModel();
  const { t } = useTranslation("auth");

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("page.title")}</CardTitle>
          <CardDescription className="text-center">
            {t("page.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              window.location.href = signInUrl;
            }}
            className="w-full"
          >
            {t("page.actions.signIn")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
