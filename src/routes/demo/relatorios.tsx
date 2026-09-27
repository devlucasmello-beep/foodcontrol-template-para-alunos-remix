import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Line, LineChart } from "recharts";
import { demoLast30, demoTopItems, demoHourly } from "@/lib/demoData";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/demo/relatorios")({ component: Page });

function Page() {
  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" description="Últimos 30 dias" />

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Faturamento diário</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={demoLast30}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" /><YAxis />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3">Pedidos por dia</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={demoLast30}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" /><YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Top pratos</h3>
          <div className="space-y-2">
            {demoTopItems.map((t, i) => (
              <div key={t.name}>
                <div className="flex justify-between text-sm"><span>{i + 1}. {t.name}</span><span className="font-semibold">{t.value}</span></div>
                <div className="mt-1 h-2 rounded bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${(t.value / demoTopItems[0].value) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Distribuição por hora</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={demoHourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="hour" /><YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

