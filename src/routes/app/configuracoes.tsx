import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/configuracoes")({ component: Config });

const DAYS: { key: string; label: string }[] = [
  { key: "seg", label: "Segunda" }, { key: "ter", label: "Terça" }, { key: "qua", label: "Quarta" },
  { key: "qui", label: "Quinta" }, { key: "sex", label: "Sexta" }, { key: "sab", label: "Sábado" }, { key: "dom", label: "Domingo" },
];

function Config() {
  const { companyId, membership, refresh } = useAuth();
  const [form, setForm] = useState({
    name: "", slug: "", cnpj: "", telefone: "", whatsapp: "", email: "",
    cor_primaria: "#EF4444", logo_url: "", delivery_fee: 0, min_order: 0,
  });
  const [hours, setHours] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    supabase.from("company").select("*").eq("id", companyId).single().then(({ data }) => {
      if (!data) return;
      setForm({
        name: data.name, slug: data.slug, cnpj: data.cnpj ?? "",
        telefone: data.telefone ?? "", whatsapp: data.whatsapp ?? "", email: data.email ?? "",
        cor_primaria: data.cor_primaria, logo_url: data.logo_url ?? "",
        delivery_fee: Number(data.delivery_fee ?? 0), min_order: Number(data.min_order ?? 0),
      });
      setHours((data.business_hours ?? {}) as Record<string, string>);
    });
  }, [companyId]);

  const save = async () => {
    if (!companyId) return;
    const { error } = await supabase.from("company").update({ ...form, business_hours: hours }).eq("id", companyId);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("Configurações salvas");
  };

  const uploadLogo = async (file: File) => {
    if (!companyId) return;
    setUploading(true);
    const path = `${companyId}/logos/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("tenant-assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data: pub } = supabase.storage.from("tenant-assets").getPublicUrl(path);
    setForm((f) => ({ ...f, logo_url: pub.publicUrl }));
    toast.success("Logo enviada — clique em Salvar");
  };

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/pedir/${form.slug}` : "";

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" description="Dados, marca, entrega e horários do restaurante" />
      <Tabs defaultValue="restaurante">
        <TabsList>
          <TabsTrigger value="restaurante">Restaurante</TabsTrigger>
          <TabsTrigger value="aparencia">Aparência</TabsTrigger>
          <TabsTrigger value="entrega">Entrega</TabsTrigger>
          <TabsTrigger value="horarios">Horários</TabsTrigger>
          <TabsTrigger value="link">Link público</TabsTrigger>
          <TabsTrigger value="cobranca">Cobrança</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurante">
          <Card className="p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>CNPJ</Label><Input value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} /></div>
              <div><Label>E-mail</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Telefone</Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
              <div><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></div>
              <div><Label>Slug (link público)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            </div>
            <Button onClick={save}>Salvar</Button>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia">
          <Card className="p-5 space-y-4 max-w-xl">
            <div>
              <Label>Cor primária</Label>
              <div className="flex gap-2">
                <Input type="color" value={form.cor_primaria} onChange={(e) => setForm({ ...form, cor_primaria: e.target.value })} className="h-10 w-20" />
                <Input value={form.cor_primaria} onChange={(e) => setForm({ ...form, cor_primaria: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {form.logo_url ? <img src={form.logo_url} alt="logo" className="h-16 w-16 rounded object-cover border" /> : <div className="h-16 w-16 rounded border bg-muted" />}
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" />{uploading ? "Enviando..." : "Trocar logo"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadLogo(f); }} />
                </label>
              </div>
            </div>
            <Button onClick={save}>Salvar</Button>
          </Card>
        </TabsContent>

        <TabsContent value="entrega">
          <Card className="p-5 space-y-4 max-w-md">
            <div><Label>Taxa de entrega padrão (R$)</Label><Input type="number" step="0.01" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: Number(e.target.value) })} /></div>
            <div><Label>Pedido mínimo (R$)</Label><Input type="number" step="0.01" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: Number(e.target.value) })} /></div>
            <p className="text-xs text-muted-foreground">Zonas de entrega específicas podem ser configuradas em <a href="/app/entregas" className="text-primary underline">Entregas</a>.</p>
            <Button onClick={save}>Salvar</Button>
          </Card>
        </TabsContent>

        <TabsContent value="horarios">
          <Card className="p-5 space-y-3 max-w-xl">
            {DAYS.map((d) => (
              <div key={d.key} className="flex items-center gap-3">
                <Label className="w-24">{d.label}</Label>
                <Input placeholder="11:00-23:00 ou fechado" value={hours[d.key] ?? ""} onChange={(e) => setHours({ ...hours, [d.key]: e.target.value })} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Horário de Brasília. Sem horários configurados: recebe pedidos sempre. Ao definir horários, dias vazios/fechados não recebem pedidos.</p><Button onClick={save}>Salvar horários</Button>
          </Card>
        </TabsContent>

        <TabsContent value="link">
          <Card className="p-5 space-y-3">
            <Label>Link público de pedidos</Label>
            <div className="flex gap-2">
              <Input readOnly value={publicUrl} />
              <Button variant="outline" onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success("Link copiado"); }}>Copiar</Button>
              <Button variant="outline" onClick={() => window.open(publicUrl, "_blank")}>Abrir</Button>
            </div>
            <p className="text-xs text-muted-foreground">Compartilhe esse link nas redes, cardápios e WhatsApp para receber pedidos online.</p>
          </Card>
        </TabsContent>

        <TabsContent value="cobranca">
          <Card className="p-5 space-y-2">
            <div className="text-sm text-muted-foreground">Plano comercial de exemplo</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold capitalize">{membership?.company?.plano}</div>
              <Badge>{membership?.company?.status}</Badge>
            </div>
            <div className="text-lg">{brl(membership?.company?.valor_mensal ?? 0)}<span className="text-sm text-muted-foreground">/mês</span></div>
            <Button variant="outline" disabled>Cobrança não integrada</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

