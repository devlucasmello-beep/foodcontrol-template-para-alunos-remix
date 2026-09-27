import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { demoOrders, demoRiders, type DemoOrder } from "@/lib/demoData";
import { AlertTriangle, Clock, MapPin, Phone, Receipt } from "lucide-react";
import { toast } from "sonner";

type Status = DemoOrder["status"];
const COLS: { id: Status; label: string; color: string }[] = [
  { id: "novo", label: "Novo", color: "bg-blue-500" },
  { id: "preparo", label: "Preparo", color: "bg-amber-500" },
  { id: "pronto", label: "Pronto", color: "bg-emerald-500" },
  { id: "saiu", label: "Saiu p/ entrega", color: "bg-purple-500" },
  { id: "entregue", label: "Entregue", color: "bg-zinc-500" },
  { id: "cancelado", label: "Cancelado", color: "bg-red-500" },
];

export const Route = createFileRoute("/demo/pedidos")({ component: Page });

function Page() {
  const [orders, setOrders] = useState<DemoOrder[]>(demoOrders);
  const [open, setOpen] = useState<DemoOrder | null>(null);

  const move = (id: string, status: Status) => {
    setOrders((p) => p.map((o) => o.id === id ? { ...o, status } : o));
    toast.success(`Pedido movido para "${COLS.find((c) => c.id === status)?.label}"`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pedidos" description="Kanban tempo real — clique no card para abrir detalhes" />
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {COLS.map((col) => {
          const list = orders.filter((o) => o.status === col.id);
          return (
            <div key={col.id} className="rounded-lg bg-muted/40 p-2 min-h-[400px]">
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${col.color}`} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{col.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{list.length}</span>
              </div>
              <div className="space-y-2 mt-1">
                {list.map((o) => {
                  const ageMin = Math.round((Date.now() - new Date(o.created_at).getTime()) / 60000);
                  const isLate = ageMin > 35 && ["preparo", "pronto"].includes(o.status);
                  return (
                    <Card key={o.id} className={`p-3 text-sm cursor-pointer hover:shadow-md transition ${isLate ? "border-destructive" : ""}`} onClick={() => setOpen(o)}>
                      <div className="flex justify-between items-start">
                        <div className="font-semibold">#{o.number}</div>
                        <span className={`text-[10px] font-bold rounded px-1.5 py-0.5 ${o.payment_status === "pago" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{o.payment_status}</span>
                      </div>
                      <div className="truncate">{o.customer_name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{o.type}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="font-medium">{brl(o.total)}</span>
                        <span className={`text-xs flex items-center gap-0.5 ${isLate ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                          {isLate && <AlertTriangle className="h-3 w-3" />}
                          <Clock className="h-3 w-3" />{ageMin}m
                        </span>
                      </div>
                    </Card>
                  );
                })}
                {list.length === 0 && <p className="text-xs text-muted-foreground p-2">Vazio</p>}
              </div>
            </div>
          );
        })}
      </div>

      <OrderModal order={open} onClose={() => setOpen(null)} onMove={move} />
    </div>
  );
}

function OrderModal({ order, onClose, onMove }: { order: DemoOrder | null; onClose: () => void; onMove: (id: string, s: Status) => void }) {
  if (!order) return null;
  const rider = demoRiders.find((r) => r.id === order.rider_id);
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pedido #{order.number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Cliente</span><span className="font-medium">{order.customer_name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />Telefone</span><span>{order.customer_phone}</span></div>
          {order.customer_address && <div className="flex justify-between gap-2"><span className="text-muted-foreground flex items-center gap-1 shrink-0"><MapPin className="h-3 w-3" />Endereço</span><span className="text-right">{order.customer_address.line}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="capitalize">{order.type}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Pagamento</span><span>{order.payment_method} · {order.payment_status}</span></div>
          {rider && <div className="flex justify-between"><span className="text-muted-foreground">Entregador</span><span>{rider.name}</span></div>}
          {order.notes && <div className="rounded bg-muted p-2 italic">"{order.notes}"</div>}

          <div className="border-t pt-3">
            <div className="font-semibold flex items-center gap-1 mb-2"><Receipt className="h-4 w-4" />Itens</div>
            <ul className="space-y-1">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between">
                  <span>{it.qty}× {it.name}</span><span>{brl(it.total)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t mt-2 pt-2 space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{brl(order.subtotal)}</span></div>
              {order.delivery_fee > 0 && <div className="flex justify-between"><span>Entrega</span><span>{brl(order.delivery_fee)}</span></div>}
              {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Desconto</span><span>-{brl(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{brl(order.total)}</span></div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mudar status</div>
            <div className="grid grid-cols-3 gap-2">
              {COLS.map((c) => (
                <Button key={c.id} variant={order.status === c.id ? "default" : "outline"} size="sm" onClick={() => { onMove(order.id, c.id); onClose(); }}>
                  {c.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

