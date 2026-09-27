import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, PlusCircle, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/master/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/master/lista-restaurantes", label: "Restaurantes", icon: Building2 },
  { to: "/master/novo-restaurante", label: "Novo restaurante", icon: PlusCircle },
] as const;

export function MasterSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { signOut, email } = useAuth();
  return (
    <aside
      className="hidden md:flex w-60 shrink-0 flex-col text-white"
      style={{ background: "oklch(0.36 0.18 27)" }}
    >
      <div className="border-b border-white/15 px-5 py-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70">
          <ShieldCheck className="h-3.5 w-3.5" /> Super Admin
        </div>
        <div className="mt-1 text-base font-semibold">FoodControl AI</div>
      </div>
      <nav className="flex-1 space-y-0.5 p-2">
        {items.map((it) => {
          const active = pathname === it.to || pathname.startsWith(it.to + "/");
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${
                active ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <it.icon className="h-4 w-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/15 p-3 text-xs">
        <div className="truncate text-white/70">{email}</div>
        <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-white hover:bg-white/10" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />Sair
        </Button>
      </div>
    </aside>
  );
}

