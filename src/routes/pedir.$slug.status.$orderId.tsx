import {callBackend} from "@/blink/backend";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { brl } from "@/lib/format";
import { CheckCircle2, Circle, Clock, ChefHat, PackageCheck, Bike, Home as HomeIcon } from "lucide-react";

export const Route = createFileRoute("/pedir/$slug/status/$orderId")({
  head: () => ({ meta: [{ title: "Acompanhar pedido" }] }),
  component: Page,
});

const STEPS = [
  { key: "novo", label: "Recebido", icon: CheckCircle2 },
  { key: "preparo", label: "Preparando", icon: ChefHat },
  { key: "pronto", label: "Pronto", icon: PackageCheck },
  { key: "saiu", label: "Saiu para entrega", icon: Bike },
  { key: "entregue", label: "Entregue", icon: HomeIcon },
];

function Page() {
  const { slug, orderId } = Route.useParams();

  const token=typeof window!=='undefined'?(new URLSearchParams(window.location.search).get('token')||localStorage.getItem('food-order:'+orderId)):null;
  const {data:result,error}=useQuery({queryKey:['public-status',slug,orderId,token],refetchInterval:10000,queryFn:()=>callBackend('/api/public',{action:'status',slug,orderId,token})});
  const order=result?.order,items:any[]=result?.items||[];
  const currentIdx = STEPS.findIndex((s) => s.key === order?.status);
  const cancelled = order?.status === "cancelado";

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-primary text-primary-foreground px-6 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold">Acompanhar pedido</h1>
          <p className="text-sm opacity-90 mt-1">#{orderId.slice(0, 8).toUpperCase()}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        <Card className="p-6">
          {!order ? (
            <p className="text-muted-foreground text-sm">{error?error.message:"Carregando…"}</p>
          ) : cancelled ? (
            <div className="text-destructive font-semibold">Pedido cancelado pelo restaurante.</div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Atualiza automaticamente a cada 10s
              </div>
              <ol className="mt-6 space-y-4">
                {STEPS.map((s, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  const Icon = done ? s.icon : Circle;
                  return (
                    <li key={s.key} className="flex items-center gap-3">
                      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className={`font-medium ${active ? "text-primary" : done ? "" : "text-muted-foreground"}`}>{s.label}</span>
                      {active && <span className="text-xs text-primary ml-auto">em andamento</span>}
                    </li>
                  );
                })}
              </ol>
              {order.eta_minutes && currentIdx < 4 && (
                <p className="mt-6 text-sm text-muted-foreground">Previsão: ~{order.eta_minutes} minutos</p>
              )}
            </>
          )}
        </Card>

        {order && (
          <Card className="p-6">
            <h2 className="font-semibold mb-3">Resumo do pedido</h2>
            <div className="text-sm space-y-1">
              {items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.qty}× {it.name}</span>
                  <span>{brl(Number(it.total))}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 text-sm space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>{brl(Number(order.subtotal))}</span></div>
              <div className="flex justify-between"><span>Entrega</span><span>{brl(Number(order.delivery_fee))}</span></div>
              <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{brl(Number(order.total))}</span></div>
              <div className="flex justify-between text-muted-foreground pt-1"><span>Pagamento</span><span>{order.payment_method}</span></div>
            </div>
          </Card>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link to="/pedir/$slug" params={{ slug }}>Voltar ao cardápio</Link>
        </Button>
      </div>
    </div>
  );
}

