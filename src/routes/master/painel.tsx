import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brl } from "@/lib/format";
import { Bar, BarChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { startOfMonth, subMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const PIE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export const Route = createFileRoute("/master/painel")({ component: Page });

type Co = { id: string; name: string; status: string; plano: string; valor_mensal: number; created_at: string; ultimo_acesso: string | null };

function Page() {
  const { data } = useQuery({
    queryKey: ["master_painel"],
    queryFn: async () => {
      const { data: cs } = await supabase.from("company").select("id,name,status,plano,valor_mensal,created_at,ultimo_acesso");
      const all = (cs ?? []) as Co[];
      const active = all.filter((c) => c.status === "active");
      const trial = all.filter((c) => c.status === "trial");
      const inad = all.filter((c) => c.status === "inadimplente");
      const suspended = all.filter((c) => c.status === "suspended" || c.status === "inactive");
      const mrr = active.reduce((s, c) => s + Number(c.valor_mensal), 0);
      const arr = mrr * 12;

      // novos cadastros / churn por mes (6 meses)
      const months = Array.from({ length: 6 }).map((_, i) => {
        const d = subMonths(startOfMonth(new Date()), 5 - i);
        const key = format(d, "yyyy-MM");
        const label = format(d, "MMM", { locale: ptBR });
        const novos = all.filter((c) => c.created_at.startsWith(key)).length;
        return { label, novos };
      });

      // churn estimado: status inativo/suspenso
      const churnRate = all.length ? Math.round((suspended.length / all.length) * 100) : 0;
      const conversionRate = (trial.length + active.length) ? Math.round((active.length / (trial.length + active.length)) * 100) : 0;

      // por plano
      const planos = ["starter", "pro", "enterprise"].map((p) => ({
        name: p, value: active.filter((c) => c.plano === p).length,
      })).filter((p) => p.value > 0);

      // top performers por valor_mensal
      const top = [...active].sort((a, b) => Number(b.valor_mensal) - Number(a.valor_mensal)).slice(0, 5);

      // novos este mes
      const thisMonth = format(new Date(), "yyyy-MM");
      const novosMes = all.filter((c) => c.created_at.startsWith(thisMonth)).length;

      // recentes
      const recentes = [...all].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 6);

      return { all, active, trial, inad, suspended, mrr, arr, months, churnRate, conversionRate, planos, top, novosMes, recentes };
    },
  });

  const d = data;
  return (
    <div className="space-y-6">
      <PageHeader title="Painel Super Admin" description="Visão completa da plataforma" />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <KpiCard label="MRR" value={brl(d?.mrr ?? 0)} hint="Receita mensal" />
        <KpiCard label="ARR" value={brl(d?.arr ?? 0)} hint="Anualizado" />
        <KpiCard label="Restaurantes" value={d?.all.length ?? 0} hint={`${d?.active.length ?? 0} ativos`} />
        <KpiCard label="Em trial" value={d?.trial.length ?? 0} />
        <KpiCard label="Inadimplentes" value={d?.inad.length ?? 0} />
        <KpiCard label="Novos este mês" value={d?.novosMes ?? 0} />
        <KpiCard label="Conversão trial→pago" value={`${d?.conversionRate ?? 0}%`} />
        <KpiCard label="Churn estimado" value={`${d?.churnRate ?? 0}%`} hint={`${d?.suspended.length ?? 0} inativos`} />
        <KpiCard label="Ticket médio" value={brl(d?.active.length ? d.mrr / d.active.length : 0)} />
        <KpiCard label="Plano Pro" value={d?.active.filter((c) => c.plano === "pro").length ?? 0} />
        <KpiCard label="Plano Starter" value={d?.active.filter((c) => c.plano === "starter").length ?? 0} />
        <KpiCard label="Plano Enterprise" value={d?.active.filter((c) => c.plano === "enterprise").length ?? 0} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-3">Novos cadastros — últimos 6 meses</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={d?.months ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" /><YAxis />
                <Tooltip />
                <Bar dataKey="novos" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Ativos por plano</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={d?.planos ?? []} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                  {(d?.planos ?? []).map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                </Pie>
                <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Top performers (MRR)</h3>
          <div className="space-y-2">
            {(d?.top ?? []).map((c) => (
              <div key={c.id} className="flex justify-between border rounded p-3 text-sm">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{c.plano}</div>
                </div>
                <div className="font-semibold">{brl(Number(c.valor_mensal))}/mês</div>
              </div>
            ))}
            {(d?.top.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">Nenhum restaurante ativo ainda.</p>}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Cadastros recentes</h3>
          <div className="space-y-2">
            {(d?.recentes ?? []).map((c) => (
              <div key={c.id} className="flex justify-between items-center border rounded p-3 text-sm">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(c.created_at), "dd MMM yyyy", { locale: ptBR })}</div>
                </div>
                <Badge variant={c.status === "active" ? "default" : c.status === "trial" ? "secondary" : "destructive"}>{c.status}</Badge>
              </div>
            ))}
            {(d?.recentes.length ?? 0) === 0 && <p className="text-sm text-muted-foreground">Sem cadastros.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

