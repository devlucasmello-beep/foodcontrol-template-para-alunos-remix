import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const ROLE_LABEL: Record<string, string> = { admin: "Admin", garcom: "Garçom", cozinha: "Cozinha", caixa: "Caixa", entregador: "Entregador" };

export const Route = createFileRoute("/app/equipe")({ component: Page });

type Member = { id: string; nome: string | null; email: string; role: string; ativo: boolean; ultimo_login: string | null };

function Page() {
  const { companyId } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  type Role = "admin" | "garcom" | "cozinha" | "caixa" | "entregador";
  const [form, setForm] = useState<{ nome: string; email: string; role: Role }>({ nome: "", email: "", role: "garcom" });

  const { data = [] } = useQuery<Member[]>({
    queryKey: ["company_user", companyId], enabled: !!companyId,
    queryFn: async () => { const { data } = await supabase.from("company_user").select("*"); return (data ?? []) as Member[]; },
  });

  const add = useMutation({
    mutationFn: async () => {
      // Email é vinculado ao usuário apenas após login verificado.
      const { error } = await supabase.from("company_user").insert({
        company_id: companyId!, 
        email: form.email, nome: form.nome, role: form.role, ativo: true,
      });
      if (error) throw error;
    },
    onSuccess: () => { setForm({ nome: "", email: "", role: "garcom" }); setOpen(false); qc.invalidateQueries({ queryKey: ["company_user"] }); toast.success("Email autorizado. Compartilhe o link de acesso com o membro."); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => { const { error } = await supabase.from("company_user").update({ ativo }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company_user"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("company_user").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["company_user"] }),
  });

  const ativos = data.filter((m) => m.ativo).length;
  const porRole = (r: string) => data.filter((m) => m.role === r).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Equipe" description={`${data.length} membros · ${ativos} ativos`} actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Convidar</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Convidar membro</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nome</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Cargo</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="garcom">Garçom</SelectItem>
                    <SelectItem value="cozinha">Cozinha</SelectItem>
                    <SelectItem value="caixa">Caixa</SelectItem>
                    <SelectItem value="entregador">Entregador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Email de convite real será implementado em breve. Por ora o registro é adicionado e o membro precisa se cadastrar com o mesmo e-mail.</p>
            </div>
            <DialogFooter><Button onClick={() => add.mutate()} disabled={!form.email || !form.nome}>Enviar convite</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <KpiCard label="Total" value={data.length} />
        <KpiCard label="Admins" value={porRole("admin")} />
        <KpiCard label="Garçons" value={porRole("garcom")} />
        <KpiCard label="Cozinha" value={porRole("cozinha")} />
        <KpiCard label="Caixa" value={porRole("caixa")} />
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Cargo</th><th className="p-3">Último acesso</th><th className="p-3">Ativo</th><th className="p-3"></th></tr></thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3 font-medium">{m.nome ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{m.email}</td>
                <td className="p-3"><Badge variant="outline">{ROLE_LABEL[m.role] ?? m.role}</Badge></td>
                <td className="p-3 text-muted-foreground">{m.ultimo_login ? formatDistanceToNow(new Date(m.ultimo_login), { addSuffix: true, locale: ptBR }) : "—"}</td>
                <td className="p-3"><Switch checked={m.ativo} onCheckedChange={(v) => toggle.mutate({ id: m.id, ativo: v })} /></td>
                <td className="p-3 text-right"><Button size="icon" variant="ghost" onClick={() => del.mutate(m.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Convide o primeiro membro da equipe.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

