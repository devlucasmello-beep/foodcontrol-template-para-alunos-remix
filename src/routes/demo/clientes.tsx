import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, Search } from "lucide-react";
import { demoCustomers } from "@/lib/demoData";
import { brl } from "@/lib/format";
import { format } from "date-fns";

export const Route = createFileRoute("/demo/clientes")({ component: Page });

function Page() {
  const [q, setQ] = useState("");
  const filtered = demoCustomers.filter((c) =>
    !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.includes(q)
  ).sort((a, b) => b.total_spent - a.total_spent);

  const vip = demoCustomers.filter((c) => c.status === "vip").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Clientes" description={`${demoCustomers.length} cadastrados · ${vip} VIPs`} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome ou telefone…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold flex items-center gap-1">{c.name}{c.status === "vip" && <Crown className="h-3.5 w-3.5 text-amber-500" />}</div>
                <div className="text-xs text-muted-foreground">{c.phone}</div>
              </div>
              {c.status === "vip" && <Badge className="bg-amber-500 hover:bg-amber-500">VIP</Badge>}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Pedidos</div>
                <div className="font-semibold">{c.total_orders}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total gasto</div>
                <div className="font-semibold">{brl(c.total_spent)}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">Último pedido: {format(new Date(c.last_order_at), "dd/MM/yyyy")}</div>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground col-span-full text-center py-12">Nenhum cliente encontrado.</p>}
      </div>
    </div>
  );
}

