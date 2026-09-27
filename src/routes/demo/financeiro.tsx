import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { demoFinancial, demoRiders, demoOrders } from "@/lib/demoData";
import { brl } from "@/lib/format";
import { format } from "date-fns";

export const Route = createFileRoute("/demo/financeiro")({ component: Page });

function Page() {
  const entradas = demoFinancial.filter((e) => e.type === "entrada");
  const saidas = demoFinancial.filter((e) => e.type === "saida");
  const totalIn = entradas.reduce((s, e) => s + e.amount, 0);
  const totalOut = saidas.reduce((s, e) => s + e.amount, 0);
  const lucro = totalIn - totalOut;

  const comissoes = demoRiders.filter((r) => r.active).map((r) => {
    const ordersDelivered = demoOrders.filter((o) => o.rider_id === r.id && o.status === "entregue");
    const base = ordersDelivered.reduce((s, o) => s + o.total, 0);
    const commission = Math.round(base * (r.commission_pct / 100) * 100) / 100;
    return { ...r, ordersCount: ordersDelivered.length, base, commission };
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" description="Últimos 30 dias" />
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Receitas" value={brl(totalIn)} />
        <KpiCard label="Despesas" value={brl(totalOut)} />
        <KpiCard label="Lucro líquido" value={brl(lucro)} />
        <KpiCard label="Margem" value={`${Math.round((lucro / totalIn) * 100)}%`} />
      </div>

      <Tabs defaultValue="receitas">
        <TabsList>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
          <TabsTrigger value="comissoes">Comissões</TabsTrigger>
        </TabsList>

        <TabsContent value="receitas" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Data</th><th className="p-3">Descrição</th><th className="p-3">Categoria</th><th className="p-3 text-right">Valor</th></tr></thead>
              <tbody>
                {entradas.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3">{format(new Date(e.date), "dd/MM/yyyy")}</td>
                    <td className="p-3">{e.description}</td>
                    <td className="p-3 text-muted-foreground">{e.category}</td>
                    <td className="p-3 text-right font-semibold text-emerald-600">+ {brl(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="despesas" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Data</th><th className="p-3">Descrição</th><th className="p-3">Categoria</th><th className="p-3 text-right">Valor</th></tr></thead>
              <tbody>
                {saidas.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3">{format(new Date(e.date), "dd/MM/yyyy")}</td>
                    <td className="p-3">{e.description}</td>
                    <td className="p-3 text-muted-foreground">{e.category}</td>
                    <td className="p-3 text-right font-semibold text-destructive">- {brl(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="comissoes" className="mt-4">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Entregador</th><th className="p-3">Pedidos</th><th className="p-3">%</th><th className="p-3 text-right">Base</th><th className="p-3 text-right">Comissão</th></tr></thead>
              <tbody>
                {comissoes.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3">{r.ordersCount}</td>
                    <td className="p-3">{r.commission_pct}%</td>
                    <td className="p-3 text-right">{brl(r.base)}</td>
                    <td className="p-3 text-right font-semibold">{brl(r.commission)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

