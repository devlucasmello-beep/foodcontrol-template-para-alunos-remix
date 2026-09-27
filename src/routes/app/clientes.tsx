import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { brl } from "@/lib/format";
import { Search, Crown, Phone, MapPin, History } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/app/clientes")({ component: Page });

type Customer = { id: string; name: string; phone: string; email: string | null; total_orders: number; total_spent: number; status: string; last_order_at: string | null; address: Record<string, unknown> | null };

function statusBadge(c: Customer): { label: string; cls: string } {
  if (c.total_spent >= 500) return { label: "VIP", cls: "bg-amber-500/15 text-amber-700 border-amber-500/30" };
  if (c.total_orders >= 3) return { label: "Recorrente", cls: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" };
  if (c.last_order_at && (Date.now() - new Date(c.last_order_at).getTime()) / 86400000 > 45) return { label: "Inativo", cls: "bg-muted text-muted-foreground border-border" };
  return { label: "Novo", cls: "bg-blue-500/15 text-blue-700 border-blue-500/30" };
}

function Page() {
  const { companyId } = useAuth();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const { data: customers = [] } = useQuery({
    queryKey: ["customers", companyId], enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("customer").select("*").order("total_spent", { ascending: false });
      return (data ?? []) as Customer[];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["cust_orders", selected?.id], enabled: !!selected?.id,
    queryFn: async () => {
      const { data } = await supabase.from("order").select("id,total,status,type,created_at").eq("customer_id", selected!.id).order("created_at", { ascending: false }).limit(20);
      return data ?? [];
    },
  });

  const filtered = useMemo(() => customers.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)), [customers, q]);
  const stats = useMemo(() => {
    const vips = customers.filter((c) => c.total_spent >= 500).length;
    const ativos = customers.filter((c) => c.status === "active").length;
    const ticket = customers.length ? customers.reduce((s, c) => s + Number(c.total_spent), 0) / Math.max(1, customers.reduce((s, c) => s + c.total_orders, 0)) : 0;
    const ltv = customers.length ? customers.reduce((s, c) => s + Number(c.total_spent), 0) / customers.length : 0;
    return { total: customers.length, vips, ativos, ticket, ltv };
  }, [customers]);

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description="Base de clientes e histórico de pedidos" />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <KpiCard label="Total" value={stats.total} />
        <KpiCard label="VIPs" value={stats.vips} hint="Gastam R$ 500+" />
        <KpiCard label="Ativos" value={stats.ativos} />
        <KpiCard label="Ticket médio" value={brl(stats.ticket)} />
        <KpiCard label="LTV médio" value={brl(stats.ltv)} />
      </div>

      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou telefone…" className="pl-9" />
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Pedidos</th>
                <th className="p-3 text-right">Total gasto</th>
                <th className="p-3">Último pedido</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const b = statusBadge(c);
                return (
                  <tr key={c.id} className="border-t hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-1">{c.name}{b.label === "VIP" && <Crown className="h-3 w-3 text-amber-500" />}</div>
                          {c.email && <div className="text-xs text-muted-foreground">{c.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.phone}</td>
                    <td className="p-3"><Badge variant="outline" className={b.cls}>{b.label}</Badge></td>
                    <td className="p-3 text-right">{c.total_orders}</td>
                    <td className="p-3 text-right font-medium">{brl(c.total_spent)}</td>
                    <td className="p-3 text-xs text-muted-foreground">{c.last_order_at ? format(new Date(c.last_order_at), "dd/MM/yyyy", { locale: ptBR }) : "—"}</td>
                    <td className="p-3 text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelected(c)}><History className="h-3 w-3 mr-1" />Histórico</Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                          <SheetHeader><SheetTitle>{selected?.name ?? c.name}</SheetTitle></SheetHeader>
                          {selected && (
                            <div className="space-y-4 mt-4">
                              <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" />{selected.phone}</div>
                                {(selected.address as { rua?: string })?.rua && (
                                  <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" />{(selected.address as { rua: string }).rua}</div>
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-2">
                                <Card className="p-3"><div className="text-xs text-muted-foreground">Pedidos</div><div className="font-semibold">{selected.total_orders}</div></Card>
                                <Card className="p-3"><div className="text-xs text-muted-foreground">Total</div><div className="font-semibold">{brl(selected.total_spent)}</div></Card>
                                <Card className="p-3"><div className="text-xs text-muted-foreground">Ticket</div><div className="font-semibold">{brl(selected.total_orders ? selected.total_spent / selected.total_orders : 0)}</div></Card>
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm mb-2">Últimos pedidos</h4>
                                <div className="space-y-2">
                                  {orders.length === 0 && <p className="text-xs text-muted-foreground">Sem pedidos registrados.</p>}
                                  {orders.map((o: { id: string; total: number; status: string; type: string; created_at: string }) => (
                                    <div key={o.id} className="flex justify-between items-center text-sm border rounded p-2">
                                      <div>
                                        <div className="font-medium capitalize">{o.status} · {o.type}</div>
                                        <div className="text-xs text-muted-foreground">{format(new Date(o.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
                                      </div>
                                      <div className="font-semibold">{brl(o.total)}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td className="p-8 text-center text-muted-foreground" colSpan={7}>Nenhum cliente encontrado.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

