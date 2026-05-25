import { Link } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { FieldType } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/hooks/useAuth";

export function Login() {
  const { login, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
  }, [clearError]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Preencha todos os campos.");

      return;
    }

    setLoading(true);

    try {
      await login(email, password);
    } catch {
      // error is set in context
    } finally {
      setLoading(false);
    }
  }

  const displayError = formError || error;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Logo />

      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-heading-md font-bold text-foreground">
              Fazer login
            </h1>

            <p className="text-body-md text-muted-foreground">
              Entre na sua conta para continuar
            </p>
          </div>

          {displayError && (
            <p className="text-sm text-red-base" role="alert">
              {displayError}
            </p>
          )}

          <div className="space-y-4">
            <Input
              label="E-mail"
              type={FieldType.email}
              placeholder="mail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="space-y-4">
              <Input
                label="Senha"
                placeholder="Digite sua senha"
                type={FieldType.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="remember-me"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />

                  <span className="flex h-4 items-center text-caption-sm text-muted-foreground">
                    Lembrar-me
                  </span>
                </label>

                <Button variant="link" size="sm" className="h-auto p-0" asChild>
                  <Link to="/recuperar-senha">Recuperar senha</Link>
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="relative flex items-center">
            <div className="grow border-t border-border" />

            <span className="px-3 text-caption-sm text-muted-foreground">
              ou
            </span>

            <div className="grow border-t border-border" />
          </div>

          <div className="space-y-3 text-center">
            <p className="text-caption-sm text-muted-foreground">
              Ainda não tem uma conta?
            </p>

            <Button variant="outline" className="w-full gap-1.5" asChild>
              <Link to="/criar-conta">
                <UserPlus />
                Criar conta
              </Link>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
