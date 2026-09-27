import {useQuery} from "@tanstack/react-query";import {supabase} from "@/integrations/supabase/client";import {useAuth} from "@/hooks/useAuth";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Send } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

export const Route = createFileRoute("/app/ai-growth")({ component: Page });

function Page() {
  const {companyId}=useAuth();
  const {data:orders=[]}=useQuery({queryKey:['growth-orders',companyId],enabled:!!companyId,queryFn:async()=>{const{data,error}=await supabase.from('order').select('id,total,status,created_at');if(error)throw Error(error.message);return data||[];}});
  const late=orders.filter((o:any)=>['preparo','pronto'].includes(o.status)&&Date.now()-new Date(o.created_at).getTime()>35*60000).length;
  const delivered=orders.filter((o:any)=>o.status==='entregue'),value=delivered.reduce((a:number,o:any)=>a+Number(o.total),0);
  const suggestions=[orders.length?`${orders.length} pedidos cadastrados. Compare dias e horários nos Relatórios.`:'Seu histórico ainda está vazio. Cadastre o cardápio e compartilhe o link de pedidos.',`${late} pedidos em preparo ou prontos há mais de 35 minutos. Confira a fila em Pedidos.`,`${delivered.length} pedidos entregues, total de R$ ${value.toFixed(2)}. Recebimentos são conferidos separadamente no financeiro.`,'Reveja fotos, descrição e disponibilidade dos pratos antes de divulgar.'];
  const reply=(input:string)=>/faturamento|venda|ticket/i.test(input)?suggestions[2]:/entrega|atraso/i.test(input)?suggestions[1]:/cupom|desconto|cliente/i.test(input)?'Sugestão geral: defina a margem antes de uma promoção. Este template não envia mensagens nem aplica cupons automaticamente.':'Veja Cardápio, Pedidos e Relatórios para tomar decisões com os registros atuais.';
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Olá! Sou seu assistente de crescimento. Veja as sugestões abaixo ou me pergunte algo." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const u = input;
    setMsgs((m) => [...m, { role: "user", text: u }]);
    setInput("");
    setTimeout(() => setMsgs((m) => [...m, { role: "ai", text: reply(u) }]), 500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Growth" description="Sugestões por regras com seus registros atuais" />

      <div className="grid gap-3 md:grid-cols-2">
        {suggestions.map((s, i) => (
          <Card key={i} className="p-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="h-4 w-4 text-primary" /></div>
              <p className="text-sm">{s}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Assistente FoodControl</h3>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Pergunte sobre cupons, cardápio, faturamento…" />
          <Button onClick={send}><Send className="h-4 w-4" /></Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Assistente por regras; não usa modelo de IA e não dispara campanhas. Orientações gerais não garantem resultados.</p>
      </Card>
    </div>
  );
}

