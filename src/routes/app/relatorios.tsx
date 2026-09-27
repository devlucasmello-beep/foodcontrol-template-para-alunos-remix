import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { brl } from "@/lib/format";
import { subDays, format } from "date-fns";


export const Route = createFileRoute("/app/relatorios")({ component: Page });

function Page() {
  const { companyId } = useAuth();
  const { data: orders = [] } = useQuery({
    queryKey: ["rel_orders", companyId], enabled: !!companyId,
    queryFn: async () => {
      const since = subDays(new Date(), 30).toISOString();
      const { data } = await supabase.from("order").select("total,created_at,status").gte("created_at", since);
      return data ?? [];
    },
  });

  const real = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i);
    const key = format(d, "yyyy-MM-dd");
    const list = orders.filter((o:any) => o.created_at?.startsWith(key));
    return { label: format(d, "dd/MM"), orders: list.length, revenue: list.filter((o:any)=>o.status==="entregue").reduce((s:number, o:any) => s + Number(o.total), 0) };
  });
  const data=real; const hourly=Array.from({length:24},(_,h)=>({hour:`${h}h`,orders:orders.filter((o:any)=>new Date(o.created_at).getHours()===h).length}));

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios" description={orders.length === 0 ? "Sem pedidos ainda" : "Últimos 30 dias"} />
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Valor dos pedidos entregues</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" /><YAxis />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Pedidos por hora</h3>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={hourly}>
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

