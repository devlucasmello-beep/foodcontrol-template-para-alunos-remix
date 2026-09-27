import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { brl } from "@/lib/format";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { subDays, format } from "date-fns";
import { AlertTriangle, Clock, Sparkles } from "lucide-react";

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/app/dashboard")({ component: Dashboard });

type OrderRow = { id: string; total: number | null; status: string; created_at: string; customer_name: string; type: string };
type ItemRow = { name: string; qty: number; menu_item_id: string | null };

function Dashboard() {
  const { companyId, membership } = useAuth();
  const { data } = useQuery({
    queryKey: ["dashboard", companyId], enabled: !!companyId,
    queryFn: async () => {
      const since = subDays(new Date(), 30).toISOString();
      const [{ data: orders }, { data: items }, { data: customers }] = await Promise.all([
        supabase.from("order").select("id,total,status,created_at,customer_name,type").gte("created_at", since).order("created_at", { ascending: false }),
        supabase.from("order_item").select("name,qty,menu_item_id,order_id").gte("created_at", since),
        supabase.from("customer").select("id,status"),
      ]);
      const all = (orders ?? []) as OrderRow[];
      const todayKey = format(new Date(), "yyyy-MM-dd");
      const today = all.filter((o) => o.created_at.startsWith(todayKey));
      const revToday = today.filter(o=>o.status==="entregue").reduce((s, o) => s + Number(o.total ?? 0), 0);
      const ticket = today.length ? revToday / today.length : 0;
      const inProgress = all.filter((o) => ["novo", "preparo", "pronto", "saiu"].includes(o.status));
      const late = inProgress.filter((o) => (Date.now() - new Date(o.created_at).getTime()) / 60000 > 35 && ["preparo", "pronto"].includes(o.status));
      const cancelRate = all.length ? Math.round((all.filter((o) => o.status === "cancelado").length / all.length) * 100) : 0;
      const days7 = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(new Date(), 6 - i);
        const k = format(d, "yyyy-MM-dd");
        const day = all.filter((o) => o.created_at.startsWith(k));
        return { label: format(d, "dd/MM"), revenue: day.filter(o=>o.status==="entregue").reduce((s, o) => s + Number(o.total ?? 0), 0), orders: day.length };
      });
      const hourly = Array.from({ length: 24 }).map((_, h) => ({
        hour: `${h}h`,
        orders: today.filter((o) => new Date(o.created_at).getHours() === h).length,
      })).filter((x) => x.orders > 0 || [11, 12, 13, 19, 20, 21].includes(Number(x.hour.replace("h", ""))));
      const peak = Math.max(0, ...hourly.map((h) => h.orders));
      const topItemsMap = new Map<string, number>();
      ((items ?? []) as (ItemRow&{order_id:string})[]).filter(i=>all.some(o=>o.id===i.order_id&&o.status!=="cancelado")).forEach((it) => topItemsMap.set(it.name, (topItemsMap.get(it.name) ?? 0) + (it.qty ?? 1)));
      const topItems = Array.from(topItemsMap.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
      const activeCustomers = (customers ?? []).filter((c:any) => c.status === "active").length;
      const delivered = all.filter((o) => o.status === "entregue").length;
      const deliveryRate = all.length ? Math.round((delivered / all.length) * 100) : 0;
      return { all, today, revToday, ticket, inProgress, late, cancelRate, days7, hourly, peak, topItems, activeCustomers, deliveryRate };
    },
  });

  const empty = !data || data.all.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description={`${membership?.company?.name ?? ""} · resumo operacional`} />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <KpiCard label="Pedidos hoje" value={data?.today.length ?? 0} />
        <KpiCard label="Pedidos entregues hoje (R$)" value={brl(data?.revToday ?? 0)} />
        <KpiCard label="Ticket médio" value={brl(data?.ticket ?? 0)} />
        <KpiCard label="Em andamento" value={data?.inProgress.length ?? 0} hint={`${data?.late.length ?? 0} em atraso`} />
        <KpiCard label="Pico/hora" value={data?.peak ?? 0} />
        <KpiCard label="Clientes ativos" value={data?.activeCustomers ?? 0} />
        <KpiCard label="Taxa entrega" value={`${data?.deliveryRate ?? 0}%`} />
        <KpiCard label="Cancelamento" value={`${data?.cancelRate ?? 0}%`} />
        <KpiCard label="Top prato" value={data?.topItems[0]?.name ?? "—"} />
        <KpiCard label="Atrasos" value={data?.late.length ?? 0} hint="Regra de 35 minutos" />
      </div>

      {empty && (
        <Card className="p-8 text-center">
          <Sparkles className="h-10 w-10 mx-auto text-primary mb-3" />
          <h3 className="font-semibold">Sem dados ainda</h3>
          <p className="text-sm text-muted-foreground mt-1">Cadastre seu cardápio e compartilhe o link público para começar a receber pedidos.</p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3">Pedidos por hora — hoje</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data?.hourly ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="hour" /><YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Top pratos (30 dias)</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data?.topItems ?? []} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                  {(data?.topItems ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Valor entregue — últimos 7 dias</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data?.days7 ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" /><YAxis />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4" />Pedidos em andamento</h3>
        <div className="space-y-2">
          {(data?.inProgress ?? []).slice(0, 8).map((o) => {
            const age = Math.round((Date.now() - new Date(o.created_at).getTime()) / 60000);
            const isLate = age > 35 && ["preparo", "pronto"].includes(o.status);
            return (
              <div key={o.id} className="flex items-center justify-between rounded border p-3 text-sm">
                <div>
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{o.status} · {o.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{brl(Number(o.total ?? 0))}</div>
                  <div className={`text-xs ${isLate ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                    {isLate && <AlertTriangle className="inline h-3 w-3 mr-1" />}há {age} min
                  </div>
                </div>
              </div>
            );
          })}
          {(data?.inProgress.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">Nenhum pedido em andamento.</p>}
        </div>
      </Card>
    </div>
  );
}

