import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { demoCategories, demoItems, demoExtras } from "@/lib/demoData";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/demo/cardapio")({ component: Page });

function Page() {
  const [items, setItems] = useState(demoItems);

  return (
    <div className="space-y-6">
      <PageHeader title="Cardápio" description="Categorias, itens e adicionais" />
      <Tabs defaultValue="itens">
        <TabsList>
          <TabsTrigger value="itens">Itens ({items.length})</TabsTrigger>
          <TabsTrigger value="categorias">Categorias ({demoCategories.length})</TabsTrigger>
          <TabsTrigger value="extras">Adicionais ({demoExtras.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="itens" className="mt-6 space-y-6">
          {demoCategories.map((cat) => {
            const list = items.filter((i) => i.category_id === cat.id);
            if (list.length === 0) return null;
            return (
              <div key={cat.id}>
                <h3 className="text-lg font-semibold mb-3">{cat.name}</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((it) => (
                    <Card key={it.id} className="overflow-hidden">
                      {it.image_url && <img src={it.image_url} alt={it.name} className="h-40 w-full object-cover" loading="lazy" />}
                      <div className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold">{it.name}</div>
                          {it.featured && <Badge variant="secondary" className="shrink-0"><Star className="h-3 w-3 mr-0.5" />Destaque</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>
                        <div className="flex items-center justify-between pt-1">
                          <div className="font-bold text-primary">{brl(it.price)}</div>
                          <label className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">Disponível</span>
                            <Switch checked={it.available} onCheckedChange={(v) => setItems((p) => p.map((x) => x.id === it.id ? { ...x, available: v } : x))} />
                          </label>
                        </div>
                        <div className="text-xs text-muted-foreground">Preparo: {it.prep_time_minutes} min</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="categorias" className="mt-6">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Ordem</th><th className="p-3">Nome</th><th className="p-3">Itens</th><th className="p-3">Status</th></tr></thead>
              <tbody>
                {demoCategories.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-3">{c.sort_order}</td>
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{items.filter((i) => i.category_id === c.id).length}</td>
                    <td className="p-3"><Badge variant={c.active ? "default" : "secondary"}>{c.active ? "Ativa" : "Inativa"}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="extras" className="mt-6">
          <Card className="p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left"><tr><th className="p-3">Adicional</th><th className="p-3">Item vinculado</th><th className="p-3 text-right">Preço</th></tr></thead>
              <tbody>
                {demoExtras.map((e) => {
                  const it = items.find((i) => i.id === e.menu_item_id);
                  return (
                    <tr key={e.id} className="border-t">
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3 text-muted-foreground">{it?.name}</td>
                      <td className="p-3 text-right font-semibold">+ {brl(e.price)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

