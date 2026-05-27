import { Logo } from "~/components/logo";

export function FullPageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Logo />

      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand-base" />
    </div>
  );
}
