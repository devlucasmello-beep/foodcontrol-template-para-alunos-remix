import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, KpiCard } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoRiders, demoZones, demoOrders } from "@/lib/demoData";
import { brl } from "@/lib/format";
import { MapPin, Bike } from "lucide-react";

export const Route = createFileRoute("/demo/entregas")({ component: Page });

function Page() {
  const ativos = demoRiders.filter((r) => r.active);
  const onRoute = demoOrders.filter((o) => o.status === "saiu");

  return (
    <div className="space-y-6">
      <PageHeader title="Entregas" description="Frota, zonas e pedidos em rota" />

      <div className="grid gap-3 md:grid-cols-4">
        <KpiCard label="Entregadores ativos" value={ativos.length} />
        <KpiCard label="Pedidos na rua" value={onRoute.length} />
        <KpiCard label="Zonas configuradas" value={demoZones.length} />
        <KpiCard label="Taxa média entrega" value={brl(demoZones.reduce((s, z) => s + z.delivery_fee, 0) / demoZones.length)} />
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><MapPin className="h-4 w-4" />Mapa de rotas</h3>
        <div className="h-64 rounded-lg bg-gradient-to-br from-primary/10 to-muted flex flex-col items-center justify-center text-sm text-muted-foreground gap-2">
          <MapPin className="h-8 w-8 opacity-40" />
          Mapa Mapbox (placeholder)
          <span className="text-xs">Integração Mapbox/Google Maps disponível na ativação</span>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Bike className="h-4 w-4" />Entregadores</h3>
          <div className="space-y-2">
            {demoRiders.map((r) => (
              <div key={r.id} className="flex justify-between items-center border rounded p-3 text-sm">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.phone} · {r.vehicle_type}{r.plate ? ` · ${r.plate}` : ""} · {r.commission_pct}%</div>
                </div>
                <Badge variant={r.active ? "default" : "secondary"}>{r.active ? "Ativo" : "Inativo"}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Zonas de delivery</h3>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-muted-foreground uppercase"><tr><th className="pb-2">Zona</th><th className="pb-2">Taxa</th><th className="pb-2">Mínimo</th><th className="pb-2">ETA</th></tr></thead>
            <tbody>
              {demoZones.map((z) => (
                <tr key={z.id} className="border-t">
                  <td className="py-2 font-medium">{z.name}</td>
                  <td className="py-2">{brl(z.delivery_fee)}</td>
                  <td className="py-2">{brl(z.min_order)}</td>
                  <td className="py-2">{z.eta_minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

