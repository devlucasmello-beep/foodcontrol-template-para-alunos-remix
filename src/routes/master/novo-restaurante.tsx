import {callBackend} from "@/blink/backend";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { slugify } from "@/lib/format";

export const Route = createFileRoute("/master/novo-restaurante")({ component: Page });

function Page() {
  const [name, setName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [plano, setPlano] = useState<"starter" | "pro" | "enterprise">("starter");
  const [loading, setLoading] = useState(false);

  const create=async()=>{setLoading(true);try{await callBackend('/api/master/company',{name,ownerEmail,plano});toast.success('Restaurante criado. Compartilhe o link de acesso com o proprietário usando o email informado.');setName('');setOwnerEmail('')}catch(e:any){toast.error(e.message)}finally{setLoading(false)}};

  return (
    <div className="space-y-6">
      <PageHeader title="Novo restaurante" description="Cadastre e autorize o email do administrador" />
      <Card className="p-5 space-y-3 max-w-md">
        <div><Label>Nome do restaurante*</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><Label>E-mail do dono*</Label><Input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="dono@restaurante.com" /></div>
        <div>
          <Label>Plano</Label>
          <select value={plano} onChange={(e) => setPlano(e.target.value as typeof plano)} className="w-full h-10 rounded-md border bg-background px-3 text-sm">
            <option value="starter">Starter — R$ 97/mês</option>
            <option value="pro">Profissional — R$ 197/mês</option>
            <option value="enterprise">Enterprise — R$ 397/mês</option>
          </select>
        </div>
        <Button disabled={!name || !ownerEmail || loading} onClick={create}>{loading ? "Criando…" : "Criar restaurante"}</Button>
        <p className="text-xs text-muted-foreground">Planos e valores são exemplos comerciais. Nenhuma cobrança ou mensagem automática é enviada.</p>
      </Card>
    </div>
  );
}

