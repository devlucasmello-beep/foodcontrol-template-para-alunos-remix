import {callBackend} from "@/blink/backend";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { slugify } from "@/lib/format";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/app/onboarding")({ component: Onboarding });

type Cat = { name: string; items: { name: string; price: number }[] };
type Zone = { name: string; fee: number; eta: number };

function Onboarding() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Dados
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cnpj, setCnpj] = useState("");

  // Step 2 — Branding
  const [cor, setCor] = useState("#EF4444");
  const [logo, setLogo] = useState("");

  // Step 3 — Equipe (lista de e-mails para convidar)
  const [teamEmails, setTeamEmails] = useState<string[]>([]);
  const [teamInput, setTeamInput] = useState("");

  // Step 4 — Cardápio inicial
  const [cats, setCats] = useState<Cat[]>([
    { name: "Lanches", items: [{ name: "Hambúrguer Artesanal", price: 32.9 }] },
  ]);

  // Step 5 — Zonas de entrega
  const [zones, setZones] = useState<Zone[]>([
    { name: "Centro", fee: 5, eta: 30 },
  ]);

  const addCat = () => setCats([...cats, { name: "", items: [] }]);
  const removeCat = (i: number) => setCats(cats.filter((_, idx) => idx !== i));
  const addItem = (ci: number) => {
    const next = [...cats];
    next[ci].items.push({ name: "", price: 0 });
    setCats(next);
  };

  const addZone = () => setZones([...zones, { name: "", fee: 0, eta: 30 }]);
  const removeZone = (i: number) => setZones(zones.filter((_, idx) => idx !== i));

  const finish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await callBackend('/api/onboarding',{name,phone,cnpj,cor,logo,cats:cats.filter(c=>c.name.trim()).map(c=>({...c,items:c.items.filter(i=>i.name.trim())})),zones:zones.filter(z=>z.name.trim()),teamEmails});
      if(teamEmails.length)toast.success('Equipe autorizada por email. Compartilhe o link de acesso com cada pessoa.');
      await refresh();
      toast.success("Restaurante criado com sucesso!");
      navigate({ to: "/app/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar restaurante");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <div className="mb-5 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className={`h-1.5 flex-1 rounded ${step >= n ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="mb-1 text-xs text-muted-foreground">Etapa {step} de 5</div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold">Dados do restaurante</h2>
            <div className="mt-4 space-y-3">
              <div><Label>Nome*</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Burger House" /></div>
              <div><Label>Telefone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" /></div>
              <div><Label>CNPJ</Label><Input value={cnpj} onChange={(e) => setCnpj(e.target.value)} /></div>
              <div className="flex justify-end"><Button disabled={!name} onClick={() => setStep(2)}>Continuar</Button></div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold">Identidade visual</h2>
            <div className="mt-4 space-y-3">
              <div><Label>Cor principal</Label>
                <div className="flex gap-2 items-center"><Input type="color" value={cor} onChange={(e) => setCor(e.target.value)} className="h-10 w-20 p-1" /><Input value={cor} onChange={(e) => setCor(e.target.value)} /></div>
              </div>
              <div><Label>Logo (URL)</Label><Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://…" /></div>
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Voltar</Button><Button onClick={() => setStep(3)}>Continuar</Button></div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold">Equipe</h2>
            <p className="text-sm text-muted-foreground mt-1">Autorize os emails da equipe. Depois compartilhe o link; não há envio automático.</p>
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <Input value={teamInput} onChange={(e) => setTeamInput(e.target.value)} placeholder="email@exemplo.com" type="email" />
                <Button type="button" onClick={() => { if (teamInput.includes("@")) { setTeamEmails([...teamEmails, teamInput]); setTeamInput(""); } }}>Adicionar</Button>
              </div>
              <ul className="space-y-1">
                {teamEmails.map((e, i) => (
                  <li key={i} className="flex justify-between text-sm border rounded px-3 py-2">{e}<button onClick={() => setTeamEmails(teamEmails.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4 text-muted-foreground" /></button></li>
                ))}
              </ul>
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Voltar</Button><Button onClick={() => setStep(4)}>Continuar</Button></div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold">Cardápio inicial</h2>
            <p className="text-sm text-muted-foreground mt-1">Adicione categorias e alguns itens. Você poderá editar depois.</p>
            <div className="mt-4 space-y-4">
              {cats.map((cat, ci) => (
                <div key={ci} className="border rounded p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input value={cat.name} onChange={(e) => { const n = [...cats]; n[ci].name = e.target.value; setCats(n); }} placeholder="Nome da categoria (ex: Pizzas)" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCat(ci)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2 pl-2">
                    {cat.items.map((it, ii) => (
                      <div key={ii} className="grid grid-cols-[1fr_120px_auto] gap-2">
                        <Input value={it.name} onChange={(e) => { const n = [...cats]; n[ci].items[ii].name = e.target.value; setCats(n); }} placeholder="Nome do item" />
                        <Input type="number" step="0.01" value={it.price} onChange={(e) => { const n = [...cats]; n[ci].items[ii].price = Number(e.target.value); setCats(n); }} placeholder="0,00" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => { const n = [...cats]; n[ci].items.splice(ii, 1); setCats(n); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button type="button" size="sm" variant="outline" onClick={() => addItem(ci)}><Plus className="h-3 w-3 mr-1" />Item</Button>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addCat}><Plus className="h-4 w-4 mr-1" />Categoria</Button>
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(3)}>Voltar</Button><Button onClick={() => setStep(5)}>Continuar</Button></div>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold">Zonas de entrega</h2>
            <p className="text-sm text-muted-foreground mt-1">Defina taxas e tempos por bairro/região.</p>
            <div className="mt-4 space-y-3">
              {zones.map((z, i) => (
                <div key={i} className="grid grid-cols-[1fr_120px_120px_auto] gap-2">
                  <Input value={z.name} onChange={(e) => { const n = [...zones]; n[i].name = e.target.value; setZones(n); }} placeholder="Nome (Centro, Zona Sul…)" />
                  <Input type="number" step="0.01" value={z.fee} onChange={(e) => { const n = [...zones]; n[i].fee = Number(e.target.value); setZones(n); }} placeholder="Taxa R$" />
                  <Input type="number" value={z.eta} onChange={(e) => { const n = [...zones]; n[i].eta = Number(e.target.value); setZones(n); }} placeholder="ETA min" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeZone(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addZone}><Plus className="h-4 w-4 mr-1" />Zona</Button>
              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(4)}>Voltar</Button>
                <Button disabled={loading || !name} onClick={finish}>{loading ? "Criando…" : "Criar restaurante"}</Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

