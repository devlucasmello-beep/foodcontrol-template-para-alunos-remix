import { createFileRoute, Outlet, Navigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { TenantSidebar } from "@/components/TenantSidebar";
import { TrialBanner } from "@/components/TrialBanner";

export const Route = createFileRoute("/app")({ component: Layout });

function Layout() {
  const { loading, session, membership } = useAuth();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando…</div>;
  if (!session) return <Navigate to="/entrar" />;
  // No company yet? force onboarding
  if (!membership && pathname !== "/app/onboarding") return <Navigate to="/app/onboarding" />;
  // Suspended -> only configuracoes allowed
  if (["inactive","suspended","inadimplente"].includes(membership?.company?.status||"") && !pathname.startsWith("/app/configuracoes")) {
    return <Navigate to="/app/configuracoes" />;
  }
  return (
    <div className="flex min-h-screen bg-surface">
      <TenantSidebar companyName={membership?.company?.name} />
      <div className="flex-1 flex flex-col">
        {membership && <TrialBanner membership={membership} />}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

