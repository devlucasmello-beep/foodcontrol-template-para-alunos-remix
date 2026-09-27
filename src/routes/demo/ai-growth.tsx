import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, ChevronDown, Copy, Send, TrendingUp, Wand2 } from "lucide-react";
import { demoAIInsightsPremium } from "@/lib/demoData";
import { brl } from "@/lib/format";
import { toast } from "sonner";

const PRIORITY_STYLES: Record<string, string> = {
  ALTA: "bg-red-100 text-red-700 border-red-200",
  MÉDIA: "bg-amber-100 text-amber-700 border-amber-200",
  OPORTUNIDADE: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const Route = createFileRoute("/demo/ai-growth")({ component: Page });

function Page() {
  const totalPotencial = demoAIInsightsPremium.reduce((s, i) => s + i.impacto, 0);
  const [openId, setOpenId] = useState<string | null>(demoAIInsightsPremium[0]?.id ?? null);

  return (
    <div className="space-y-6">
      <PageHeader title="AI Growth Engine" description="Sugestões inteligentes geradas a partir do seu histórico" />

      {/* HERO CARD */}
      <Card className="p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4 relative">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-white/80">Receita potencial recuperável</div>
              <div className="text-4xl font-bold tabular-nums">{brl(totalPotencial)}</div>
              <div className="text-sm text-white/90 mt-1">{demoAIInsightsPremium.length} oportunidades · 38 clientes envolvidos</div>
            </div>
          </div>
          <Button variant="secondary" size="lg" className="shadow-lg" onClick={() => toast.success("Demonstração: nenhuma campanha foi enviada.")}>
            <Send className="mr-2 h-4 w-4" /> Executar todas
          </Button>
        </div>
      </Card>

      {/* OPPORTUNITIES */}
      <div className="space-y-3">
        {demoAIInsightsPremium.map((i) => {
          const open = openId === i.id;
          return (
            <Collapsible key={i.id} open={open} onOpenChange={(v) => setOpenId(v ? i.id : null)}>
              <Card className="overflow-hidden">
                <CollapsibleTrigger asChild>
                  <button className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/50 transition">
                    <div className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${PRIORITY_STYLES[i.priority]}`}>{i.priority}</span>
                        {i.count > 0 && <Badge variant="outline">{i.count} clientes</Badge>}
                      </div>
                      <h3 className="mt-1 font-semibold">{i.title}</h3>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-xs text-muted-foreground">Impacto estimado</div>
                      <div className="text-lg font-bold tabular-nums flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />{brl(i.impacto)}
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t p-5 space-y-4 bg-muted/30">
                    {i.clientes.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Clientes alvo</div>
                        <div className="flex flex-wrap gap-2">
                          {i.clientes.map((c, k) => <Badge key={k} variant="secondary">{c}</Badge>)}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Mensagem WhatsApp pronta</div>
                      <blockquote className="border-l-4 pl-4 py-2 italic text-sm bg-card rounded-r" style={{ borderColor: "#DC2626" }}>
                        "{i.mensagem}"
                      </blockquote>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(i.mensagem); toast.success("Mensagem copiada"); }}>
                        <Copy className="mr-1.5 h-3 w-3" /> Copiar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Gerando nova variação com IA…")}>
                        <Wand2 className="mr-1.5 h-3 w-3" /> Gerar com IA
                      </Button>
                      <Button size="sm" className="text-white ml-auto" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }} onClick={() => toast.success(`Campanha disparada · ${i.count || "todos os"} clientes`)}>
                        <Send className="mr-1.5 h-3 w-3" /> Disparar campanha
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>

      <Card className="p-5 text-sm text-muted-foreground">
        As sugestões são geradas a partir do seu histórico de pedidos, clientes e operação. Modo demonstração — dados fictícios, sem integração de envio automático.
      </Card>
    </div>
  );
}

