import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { MasterSidebar } from "@/components/MasterSidebar";

export const Route = createFileRoute("/master")({ component: Layout });

function Layout() {
  const { loading, session, isSuperAdmin } = useAuth();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando…</div>;
  if (!session) return <Navigate to="/entrar" />;
  if (!isSuperAdmin) return <Navigate to="/app/dashboard" />;
  return (
    <div className="flex min-h-screen bg-surface">
      <MasterSidebar />
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto"><Outlet /></main>
    </div>
  );
}

