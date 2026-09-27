import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brl } from "@/lib/format";
import { format } from "date-fns";

export const Route = createFileRoute("/master/lista-restaurantes")({ component: Page });

function Page() {
  const { data = [] } = useQuery({
    queryKey: ["master_list"],
    queryFn: async () => { const { data } = await supabase.from("company").select("*").order("created_at", { ascending: false }); return data ?? []; },
  });
  return (
    <div className="space-y-6">
      <PageHeader title="Restaurantes" />
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Nome</th><th className="p-3">Plano</th><th className="p-3">Status</th><th className="p-3">MRR</th><th className="p-3">Trial até</th></tr></thead>
          <tbody>
            {data.map((c: { id: string; name: string; plano: string; status: string; valor_mensal: number; trial_ate: string }) => (
              <tr key={c.id} className="border-t"><td className="p-3 font-medium">{c.name}<button className="block text-primary text-xs mt-1" onClick={()=>{sessionStorage.setItem("food-company",c.id);window.location.assign("/app/dashboard")}}>Abrir restaurante →</button></td><td className="p-3 capitalize">{c.plano}</td><td className="p-3"><Badge variant="outline">{c.status}</Badge></td><td className="p-3">{brl(c.valor_mensal)}</td><td className="p-3">{format(new Date(c.trial_ate), "dd/MM/yyyy")}</td></tr>
            ))}
            {data.length === 0 && <tr><td className="p-6 text-center text-muted-foreground" colSpan={5}>Nenhum restaurante.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

