import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { brl } from "@/lib/format";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { subMonths, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

export const Route = createFileRoute("/app/financeiro")({ component: Page });

const CATEGORIAS_ENTRADA = ["Vendas", "Outras receitas"];
const CATEGORIAS_SAIDA = ["Ingredientes", "Embalagens", "Energia", "Aluguel", "Pessoal", "Marketing", "Manutenção", "Impostos"];

type Entry = { id: string; date: string; description: string | null; type: string; category: string | null; amount: number; status: string };

function Page() {
  const { companyId } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "entrada", category: "Vendas", description: "", amount: "", date: format(new Date(), "yyyy-MM-dd") });

  const { data: entries = [] } = useQuery({
    queryKey: ["fin", companyId], enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("financial_entry").select("*").order("date", { ascending: false }).limit(200);
      return (data ?? []) as Entry[];
    },
  });

  const stats = useMemo(() => {
    const ent = entries.filter((e) => e.type === "entrada").reduce((s, e) => s + Number(e.amount), 0);
    const sai = entries.filter((e) => e.type === "saida").reduce((s, e) => s + Number(e.amount), 0);
    const monthly = Array.from({ length: 6 }).map((_, i) => {
      const m = startOfMonth(subMonths(new Date(), 5 - i));
      const key = format(m, "yyyy-MM");
      const ents = entries.filter((e) => e.date.startsWith(key));
      const entradas = ents.filter((e) => e.type === "entrada").reduce((s, e) => s + Number(e.amount), 0);
      const saidas = ents.filter((e) => e.type === "saida").reduce((s, e) => s + Number(e.amount), 0);
      return { label: format(m, "MMM", { locale: ptBR }), entradas, saidas, lucro: entradas - saidas };
    });
    return { ent, sai, saldo: ent - sai, margem: ent > 0 ? ((ent - sai) / ent) * 100 : 0, monthly };
  }, [entries]);

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("financial_entry").insert({
        company_id: companyId!,
        type: form.type, category: form.category, description: form.description || null,
        amount: Number(form.amount), date: form.date,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["fin"] }); setOpen(false); setForm({ ...form, description: "", amount: "" }); toast.success("Lançamento adicionado"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const ent = entries.filter((e) => e.type === "entrada");
  const sai = entries.filter((e) => e.type === "saida");

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" description="Lançamentos manuais de receitas e despesas. Pedidos não são lançados automaticamente." actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Novo lançamento</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo lançamento</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v, category: v === "entrada" ? "Vendas" : "Ingredientes" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="entrada">Entrada</SelectItem><SelectItem value="saida">Saída</SelectItem></SelectContent>
              </Select>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(form.type === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input className="col-span-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <Input type="number" step="0.01" placeholder="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <DialogFooter><Button onClick={() => create.mutate()} disabled={!form.amount || create.isPending}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      } />

      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <KpiCard label="Entradas" value={brl(stats.ent)} />
        <KpiCard label="Saídas" value={brl(stats.sai)} />
        <KpiCard label="Saldo" value={brl(stats.saldo)} />
        <KpiCard label="Margem" value={`${stats.margem.toFixed(1)}%`} />
        <KpiCard label="Lançamentos" value={entries.length} />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Últimos 6 meses</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={stats.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" /><YAxis />
              <Tooltip formatter={(v: number) => brl(v)} />
              <Legend />
              <Bar dataKey="entradas" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lucro" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Tabs defaultValue="todos">
        <TabsList><TabsTrigger value="todos">Todos</TabsTrigger><TabsTrigger value="entradas">Entradas</TabsTrigger><TabsTrigger value="saidas">Saídas</TabsTrigger></TabsList>
        {[
          { key: "todos", list: entries },
          { key: "entradas", list: ent },
          { key: "saidas", list: sai },
        ].map(({ key, list }) => (
          <TabsContent key={key} value={key}>
            <Card className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left"><tr><th className="p-3">Data</th><th className="p-3">Tipo</th><th className="p-3">Categoria</th><th className="p-3">Descrição</th><th className="p-3 text-right">Valor</th></tr></thead>
                <tbody>
                  {list.map((e) => (
                    <tr key={e.id} className="border-t">
                      <td className="p-3 text-muted-foreground">{format(new Date(e.date), "dd/MM/yyyy")}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={e.type === "entrada" ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/30" : "bg-red-500/15 text-red-700 border-red-500/30"}>
                          {e.type === "entrada" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {e.type}
                        </Badge>
                      </td>
                      <td className="p-3">{e.category}</td>
                      <td className="p-3">{e.description}</td>
                      <td className={`p-3 text-right font-semibold ${e.type === "entrada" ? "text-emerald-700" : "text-red-700"}`}>{e.type === "saida" ? "-" : "+"}{brl(e.amount)}</td>
                    </tr>
                  ))}
                  {list.length === 0 && <tr><td className="p-8 text-center text-muted-foreground" colSpan={5}>Sem lançamentos.</td></tr>}
                </tbody>
              </table>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

