import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  demoKpisPremium, demoDashboardAlerts, demoTopProductsRich, demoWeeklyRevenue,
  demoCategoryDistribution, demoOrders, demoRiders,
} from "@/lib/demoData";
import { brl } from "@/lib/format";
import {
  ShoppingBag, TrendingUp, Receipt, Users, Flame, Clock, Bike, Star, AlertCircle,
  ChefHat, CheckCircle2, Truck, Sparkles, ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const PIE_COLORS = ["#DC2626", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

const ALERT_STYLES: Record<string, { bar: string; iconBg: string; icon: string }> = {
  red: { bar: "border-l-red-500", iconBg: "bg-red-100", icon: "text-red-600" },
  amber: { bar: "border-l-amber-500", iconBg: "bg-amber-100", icon: "text-amber-600" },
  emerald: { bar: "border-l-emerald-500", iconBg: "bg-emerald-100", icon: "text-emerald-600" },
  sky: { bar: "border-l-sky-500", iconBg: "bg-sky-100", icon: "text-sky-600" },
};
const ALERT_ICONS: Record<string, typeof Flame> = {
  red: Flame, amber: AlertCircle, emerald: TrendingUp, sky: Sparkles,
};

const KPIS = [
  { label: "Pedidos hoje", value: demoKpisPremium.pedidosHoje, hint: `+${demoKpisPremium.pedidosHojeDelta} vs ontem`, icon: ShoppingBag, color: "#DC2626" },
  { label: "Receita do mês", value: brl(demoKpisPremium.receitaMes), hint: `+${demoKpisPremium.receitaMesDelta}% vs anterior`, icon: TrendingUp, color: "#10B981" },
  { label: "Ticket médio", value: brl(demoKpisPremium.ticketMedio), hint: `+R$${demoKpisPremium.ticketMedioDelta}`, icon: Receipt, color: "#F59E0B" },
  { label: "Clientes ativos", value: demoKpisPremium.clientesAtivos, hint: `+${demoKpisPremium.clientesAtivosDelta} novos`, icon: Users, color: "#3B82F6" },
  { label: "Em preparo agora", value: demoKpisPremium.emPreparoAgora, hint: "Cozinha em ação", icon: ChefHat, color: "#DC2626" },
  { label: "Tempo médio preparo", value: `${demoKpisPremium.tempoMedioPreparo} min`, hint: "Dentro da meta", icon: Clock, color: "#8B5CF6" },
  { label: "Entregadores ativos", value: `${demoKpisPremium.entregadoresAtivos}/${demoKpisPremium.entregadoresTotal}`, hint: "Em rota", icon: Bike, color: "#6366F1" },
  { label: "Avaliação média", value: `${demoKpisPremium.avaliacaoMedia}★`, hint: "Últimos 30 dias", icon: Star, color: "#F59E0B" },
];

const PIPELINE = [
  { key: "novo", label: "Recebido", color: "bg-blue-500" },
  { key: "preparo", label: "Em Preparo", color: "bg-amber-500" },
  { key: "pronto", label: "Pronto", color: "bg-emerald-500" },
  { key: "saiu", label: "Saiu Entrega", color: "bg-purple-500" },
  { key: "entregue", label: "Entregue", color: "bg-zinc-500" },
];

export const Route = createFileRoute("/demo/dashboard")({ component: Page });

function Page() {
  const lastOrders = demoOrders.slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Hamburgueria do Zé · visão geral de hoje" />

      {/* ALERT BANNERS */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {demoDashboardAlerts.map((a, i) => {
          const s = ALERT_STYLES[a.tone];
          const Icon = ALERT_ICONS[a.tone];
          return (
            <Card key={i} className={`p-4 border-l-4 ${s.bar}`}>
              <div className="flex items-start gap-3">
                <div className={`h-9 w-9 shrink-0 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${s.icon}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">{a.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* KPI GRID */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <Card key={k.label} className="p-4 overflow-hidden relative">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10" style={{ background: k.color }} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <k.icon className="h-4 w-4" style={{ color: k.color }} />
              </div>
              <div className="mt-2 text-2xl font-bold">{k.value}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{k.hint}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* CHART + PIPELINE */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold mb-3">Pedidos por dia da semana</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={demoWeeklyRevenue}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" /><stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" /><YAxis />
                <Tooltip formatter={(v: number) => brl(v)} />
                <Bar dataKey="revenue" fill="url(#grad1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3">Pipeline de pedidos · hoje</h3>
          <div className="space-y-2">
            {PIPELINE.map((p) => {
              const count = demoOrders.filter((o) => o.status === p.key).length;
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${p.color}`} />
                  <span className="flex-1 text-sm">{p.label}</span>
                  <span className="text-lg font-bold tabular-nums">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* TOP PRODUCTS + RIDERS */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><TrendingUp className="h-4 w-4" />Top 5 produtos do mês</h3>
          <div className="space-y-3">
            {demoTopProductsRich.map((p) => (
              <div key={p.rank} className="flex items-center gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                  {p.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.qty} vendidos</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">{brl(p.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Bike className="h-4 w-4" />Entregadores hoje</h3>
          <div className="space-y-2">
            {demoRiders.filter((r) => r.active).slice(0, 4).map((r, i) => {
              const inRoute = i % 2 === 0;
              const entregas = [8, 6, 4, 5][i] ?? 3;
              return (
                <div key={r.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center font-bold text-white" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                    {r.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{r.vehicle_type} · {entregas} entregas</div>
                  </div>
                  <Badge variant={inRoute ? "default" : "secondary"} className={inRoute ? "bg-emerald-500 hover:bg-emerald-500" : ""}>
                    {inRoute ? "Em rota" : "Disponível"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* PIE + LAST ORDERS */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3">Distribuição por categoria</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={demoCategoryDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {demoCategoryDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-3">
          <h3 className="font-semibold mb-3">Últimos pedidos</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {lastOrders.map((o) => {
              const items = o.items.map((i) => `${i.qty}× ${i.name}`).join(", ");
              const Icon = o.status === "entregue" ? CheckCircle2 : o.status === "saiu" ? Truck : o.status === "pronto" ? CheckCircle2 : ChefHat;
              return (
                <div key={o.id} className="flex items-center gap-3 rounded border p-2.5 text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">#{o.number} · {o.customer_name}</div>
                    <div className="text-xs text-muted-foreground truncate">{items}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">{brl(o.total)}</div>
                    <div className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(o.created_at), { locale: ptBR, addSuffix: true })}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* AI GROWTH BANNER */}
      <Card className="p-6 text-white overflow-hidden relative" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold">AI Growth detectou R$ 12.800 em receita recuperável</div>
              <div className="text-sm text-white/90">5 oportunidades aguardando ação · clientes inativos, combos e horário ocioso</div>
            </div>
          </div>
          <Button asChild variant="secondary" className="shadow-lg">
            <Link to="/demo/ai-growth">Ver oportunidades <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

