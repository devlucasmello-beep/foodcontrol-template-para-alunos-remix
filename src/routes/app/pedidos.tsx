import {useState} from "react";import {Button} from "@/components/ui/button";import {Dialog,DialogContent,DialogHeader,DialogTitle} from "@/components/ui/dialog";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/pedidos")({ component: Pedidos });

type Status = "novo" | "preparo" | "pronto" | "saiu" | "entregue" | "cancelado";
const COLS: { id: Status; label: string }[] = [
  { id: "novo", label: "Novo" }, { id: "preparo", label: "Preparo" },
  { id: "pronto", label: "Pronto" }, { id: "saiu", label: "Saiu" },
  { id: "entregue", label: "Entregue" }, { id: "cancelado", label: "Cancelado" },
];

function Pedidos() {
  const { companyId, membership } = useAuth();
  const qc = useQueryClient();const[selected,setSelected]=useState<string|null>(null);
  const{data:detail}=useQuery({queryKey:['order-detail',companyId,selected],enabled:!!selected,queryFn:async()=>{const[{data:order,error},{data:items}]=await Promise.all([supabase.from('order').select('*').eq('id',selected).single(),supabase.from('order_item').select('*').eq('order_id',selected)]);if(error)throw Error(error.message);return{order,items:items||[]};}});

  const { data: orders = [] } = useQuery({
    queryKey: ["orders", companyId], enabled: !!companyId, refetchInterval:10000,
    queryFn: async () => {
      const { data, error } = await supabase.from("order").select("id,customer_name,status,total,created_at").order("created_at", { ascending: false }).limit(200);
      if (error) throw error;
      return data as Array<{ id: string; customer_name: string; status: Status; total: number; created_at: string }>;
    },
  });
  const move = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("order").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const onDragEnd = (r: DropResult) => {
    if (!r.destination) return;
    move.mutate({ id: r.draggableId, status: r.destination.droppableId as Status });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Pedidos" description="Arraste entre colunas para mudar de status" />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          {COLS.map((col) => {
            const list = orders.filter((o) => o.status === col.id);
            return (
              <div key={col.id} className="rounded-lg bg-muted/40 p-2">
                <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{col.label} ({list.length})</div>
                <Droppable droppableId={col.id}>
                  {(p) => (
                    <div ref={p.innerRef} {...p.droppableProps} className="space-y-2 min-h-[300px]">
                      {list.map((o, idx) => (
                        <Draggable key={o.id} draggableId={o.id} index={idx}>
                          {(dp) => (
                            <Card ref={dp.innerRef} {...dp.draggableProps} {...dp.dragHandleProps} className="p-3 text-sm">
                              <div className="font-medium">{o.customer_name}</div>
                              <div className="text-xs text-muted-foreground">{brl(o.total)}</div><Button size="sm" variant="ghost" onClick={()=>setSelected(o.id)}>Ver pedido</Button>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {p.placeholder}
                      {list.length === 0 && <p className="text-xs text-muted-foreground p-2">Vazio</p>}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <Dialog open={!!selected} onOpenChange={o=>!o&&setSelected(null)}><DialogContent><DialogHeader><DialogTitle>Detalhes do pedido</DialogTitle></DialogHeader>{detail&&<div className="space-y-3"><p className="font-semibold">{detail.order.customer_name}</p><p>{detail.order.customer_phone} · {detail.order.customer_address?.line}</p><p>{detail.order.notes}</p>{detail.items.map((i:any)=><div className="border rounded p-3" key={i.id}><b>{i.qty}× {i.name}</b><p>{i.extras?.map((e:any)=>e.name).join(', ')}</p><p>{i.notes}</p><p>{brl(i.total)}</p></div>)}<p>Total: {brl(detail.order.total)} · {detail.order.payment_method} · {detail.order.payment_status}</p>{['admin','caixa'].includes(membership?.role||'')&&detail.order.payment_status!=='pago'&&<Button onClick={async()=>{const{error}=await supabase.from('order').update({payment_status:'pago'}).eq('id',selected);if(error)toast.error(error.message);else{toast.success('Pagamento conferido. Registre a receita no Financeiro.');qc.invalidateQueries({queryKey:['order-detail']});}}}>Confirmar pagamento recebido</Button>}</div>}</DialogContent></Dialog>

    </div>
  );
}

