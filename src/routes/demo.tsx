import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { DemoSidebar } from "@/components/DemoSidebar";

export const Route = createFileRoute("/demo")({ component: Layout });

function Layout() {
  return (
    <div className="flex min-h-screen bg-surface">
      <DemoSidebar />
      <div className="flex-1 flex flex-col">
        <div className="bg-yellow-400 text-yellow-950 px-4 py-2 text-sm flex items-center justify-between">
          <span>Modo demo — dados fictícios.</span>
          <Link to="/entrar" className="font-semibold underline">Acessar sistema</Link>
        </div>
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto"><div className="mb-4 rounded border p-3 text-sm">Demonstração com dados fictícios. Nenhum pedido, cobrança ou mensagem é enviado.</div><Outlet /></main>
      </div>
    </div>
  );
}

