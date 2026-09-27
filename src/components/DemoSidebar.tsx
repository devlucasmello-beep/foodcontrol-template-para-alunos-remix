import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, Truck, Users, DollarSign, BarChart3, Sparkles, UserCog, Settings } from "lucide-react";

const groups = [
  { label: "Principal", items: [
    { to: "/demo/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/demo/pedidos", label: "Pedidos", icon: ClipboardList },
    { to: "/demo/cardapio", label: "Cardápio", icon: UtensilsCrossed },
    { to: "/demo/entregas", label: "Entregas", icon: Truck },
    { to: "/demo/clientes", label: "Clientes", icon: Users },
  ]},
  { label: "Operacional", items: [
    { to: "/demo/financeiro", label: "Financeiro", icon: DollarSign },
    { to: "/demo/relatorios", label: "Relatórios", icon: BarChart3 },
    { to: "/demo/ai-growth", label: "AI Growth", icon: Sparkles, badge: "IA" },
  ]},
  { label: "Gestão", items: [
    { to: "/demo/equipe", label: "Equipe", icon: UserCog },
    { to: "/demo/configuracoes", label: "Configurações", icon: Settings },
  ]},
] as const;

export function DemoSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white font-bold shadow" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>S</span>
          <div>
            <div className="text-xs uppercase tracking-wider text-sidebar-foreground/60">Modo demo</div>
            <div className="text-sm font-semibold">Hamburgueria do Zé</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-2 space-y-4">
        {groups.map((g) => (
          <div key={g.label}>
            <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40">{g.label}</div>
            <div className="space-y-0.5">
              {g.items.map((it) => {
                const active = pathname === it.to;
                return (
                  <Link key={it.to} to={it.to} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"}`}>
                    <it.icon className="h-4 w-4" />
                    <span className="flex-1">{it.label}</span>
                    {"badge" in it && it.badge && <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">{it.badge}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3 text-[11px] text-sidebar-foreground/60">
        Dados demonstrativos — nenhuma alteração é salva.
      </div>
    </aside>
  );
}

