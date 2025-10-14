import { Button } from "@/components/ui/button";
import { useLoginViewModel } from "./viewmodel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const { signInUrl } = useLoginViewModel();

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Accede al Portal</CardTitle>
          <CardDescription className="text-center">
            Autentícate con Microsoft para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              window.location.href = signInUrl;
            }}
            className="w-full"
          >
            Iniciar sesión con Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
