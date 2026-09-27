import {DeliveryZones} from "@/components/DeliveryZones";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Bike, Plus, Phone } from "lucide-react";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/entregas")({ component: Page });

type Rider = { id: string; name: string; phone: string; vehicle_type: string | null; plate: string | null; active: boolean; commission_pct: number };
type Order = { id: string; customer_name: string; status: string; total: number; rider_id: string | null; type: string; created_at: string };

function Page() {
  const { companyId } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", vehicle_type: "moto", plate: "" });

  const { data: riders = [] } = useQuery({
    queryKey: ["riders", companyId], enabled: !!companyId,
    queryFn: async () => { const { data } = await supabase.from("rider").select("*").order("created_at"); return (data ?? []) as Rider[]; },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["deliveries", companyId], enabled: !!companyId, refetchInterval:10000,
    queryFn: async () => {
      const { data } = await supabase.from("order").select("id,customer_name,status,total,rider_id,type,created_at").in("status", ["pronto", "saiu"]).order("created_at", { ascending: false });
      return (data ?? []) as Order[];
    },
  });

  const createRider = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("rider").insert({ ...form, company_id: companyId!, commission_pct: 10 });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["riders"] }); setOpen(false); setForm({ name: "", phone: "", vehicle_type: "moto", plate: "" }); toast.success("Entregador cadastrado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const assign = useMutation({
    mutationFn: async ({ orderId, riderId }: { orderId: string; riderId: string }) => {
      const { error } = await supabase.from("order").update({ rider_id: riderId, status: "saiu" }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["deliveries"] }); toast.success("Entregador atribuído"); },
    onError:(e:Error)=>toast.error(e.message),
  });

  const enRoute = orders.filter((o) => o.status === "saiu").length;
  const pending = orders.filter((o) => o.status === "pronto" && !o.rider_id).length;
  const activeRiders = riders.filter((r) => r.active).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Entregas" description="Frota e pedidos em rota" actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Novo entregador</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar entregador</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="moto">Moto</SelectItem><SelectItem value="bike">Bicicleta</SelectItem><SelectItem value="carro">Carro</SelectItem></SelectContent>
              </Select>
              <Input placeholder="Placa (opcional)" value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={() => createRider.mutate()} disabled={!form.name || !form.phone}>Cadastrar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <KpiCard label="Entregadores ativos" value={activeRiders} />
        <KpiCard label="Em rota agora" value={enRoute} />
        <KpiCard label="Aguardando entregador" value={pending} hint={pending > 0 ? "Atribua abaixo" : "Tudo certo"} />
        <KpiCard label="Prontos / em rota" value={orders.length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Bike className="h-4 w-4" />Entregadores</h3>
          <div className="space-y-2">
            {riders.map((r) => (
              <div key={r.id} className="flex justify-between items-center border rounded p-3 text-sm">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2"><Phone className="h-3 w-3" />{r.phone} · {r.vehicle_type}{r.plate ? ` · ${r.plate}` : ""}</div>
                </div>
                <Badge variant="outline" className={r.active ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-muted"}>
                  {r.active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            ))}
            {riders.length === 0 && <p className="text-sm text-muted-foreground">Nenhum entregador cadastrado.</p>}
          </div>
        </Card>

        <DeliveryZones />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Pedidos prontos / em rota</h3>
        <div className="space-y-2">
          {orders.map((o) => {
            const rider = riders.find((r) => r.id === o.rider_id);
            return (
              <div key={o.id} className="flex justify-between items-center border rounded p-3 text-sm gap-3">
                <div className="flex-1">
                  <div className="font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{o.status} · {o.type} · {brl(o.total)}</div>
                </div>
                {rider ? (
                  <Badge variant="outline" className="bg-blue-500/15 text-blue-700 border-blue-500/30">{rider.name}</Badge>
                ) : (
                  <Select onValueChange={(v) => assign.mutate({ orderId: o.id, riderId: v })}>
                    <SelectTrigger className="w-44"><SelectValue placeholder="Atribuir entregador" /></SelectTrigger>
                    <SelectContent>
                      {riders.filter((r) => r.active).map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
          {orders.length === 0 && <p className="text-sm text-muted-foreground">Nenhum pedido aguardando entrega.</p>}
        </div>
      </Card>
    </div>
  );
}

