import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Upload, Pencil } from "lucide-react";
import { brl } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/app/cardapio")({ component: Cardapio });

type Cat = { id: string; name: string; sort_order: number; active: boolean; image_url: string | null };
type Item = { id: string; name: string; description: string | null; price: number; category_id: string | null; image_url: string | null; available: boolean; featured: boolean; prep_time_minutes: number };
type Extra = { id: string; menu_item_id: string; name: string; price: number; max_qty: number };

function Cardapio() {
  const { companyId } = useAuth();
  const qc = useQueryClient();

  const { data: cats = [] } = useQuery<Cat[]>({
    queryKey: ["menu_category", companyId], enabled: !!companyId,
    queryFn: async () => { const { data } = await supabase.from("menu_category").select("*").order("sort_order"); return (data ?? []) as Cat[]; },
  });
  const { data: items = [] } = useQuery<Item[]>({
    queryKey: ["menu_item", companyId], enabled: !!companyId,
    queryFn: async () => { const { data } = await supabase.from("menu_item").select("*").order("name"); return (data ?? []) as Item[]; },
  });
  const { data: extras = [] } = useQuery<Extra[]>({
    queryKey: ["menu_item_extra", companyId], enabled: !!companyId,
    queryFn: async () => { const { data } = await supabase.from("menu_item_extra").select("*"); return (data ?? []) as Extra[]; },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Cardápio" description={`${cats.length} categorias · ${items.length} itens · ${extras.length} extras`} />
      <Tabs defaultValue="itens">
        <TabsList>
          <TabsTrigger value="itens">Itens</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        <TabsContent value="itens"><ItemsTab cats={cats} items={items} companyId={companyId} /></TabsContent>
        <TabsContent value="categorias"><CategoriesTab cats={cats} companyId={companyId} qc={qc} /></TabsContent>
        <TabsContent value="extras"><ExtrasTab items={items} extras={extras} /></TabsContent>
      </Tabs>
    </div>
  );
}

function CategoriesTab({ cats, companyId, qc }: { cats: Cat[]; companyId: string | null; qc: ReturnType<typeof useQueryClient> }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const add = useMutation({
    mutationFn: async () => {
      const sort = (cats[cats.length - 1]?.sort_order ?? 0) + 1;
      const { error } = await supabase.from("menu_category").insert({ name, company_id: companyId!, sort_order: sort });
      if (error) throw error;
    },
    onSuccess: () => { setName(""); setOpen(false); qc.invalidateQueries({ queryKey: ["menu_category"] }); toast.success("Categoria criada"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("menu_category").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_category"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("menu_category").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_category"] }),
  });

  const onDragEnd = async (r: DropResult) => {
    if (!r.destination || r.destination.index === r.source.index) return;
    const reordered = Array.from(cats);
    const [moved] = reordered.splice(r.source.index, 1);
    reordered.splice(r.destination.index, 0, moved);
    qc.setQueryData(["menu_category", companyId], reordered.map((c, i) => ({ ...c, sort_order: i + 1 })));
    await Promise.all(reordered.map((c, i) => supabase.from("menu_category").update({ sort_order: i + 1 }).eq("id", c.id)));
    qc.invalidateQueries({ queryKey: ["menu_category"] });
    toast.success("Ordem salva");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Nova categoria</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova categoria</DialogTitle></DialogHeader>
            <div className="space-y-3"><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <DialogFooter><Button onClick={() => add.mutate()} disabled={!name}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-0 overflow-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="cats">
            {(prov) => (
              <div ref={prov.innerRef} {...prov.droppableProps}>
                {cats.map((c, i) => (
                  <Draggable key={c.id} draggableId={c.id} index={i}>
                    {(p) => (
                      <div ref={p.innerRef} {...p.draggableProps} className="flex items-center gap-3 border-b px-4 py-3 bg-card">
                        <button {...p.dragHandleProps} className="text-muted-foreground"><GripVertical className="h-4 w-4" /></button>
                        <div className="flex-1 font-medium">{c.name}</div>
                        <Badge variant="outline">#{c.sort_order}</Badge>
                        <Switch checked={c.active} onCheckedChange={(v) => toggle.mutate({ id: c.id, active: v })} />
                        <Button size="icon" variant="ghost" onClick={() => del.mutate(c.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {prov.placeholder}
                {cats.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhuma categoria. Crie a primeira.</p>}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  );
}

function ItemsTab({ cats, items, companyId }: { cats: Cat[]; items: Item[]; companyId: string | null }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const empty = { id: "", name: "", description: "", price: "", category_id: "", image_url: "", available: true, featured: false, prep_time_minutes: 15 };
  const [form, setForm] = useState<typeof empty>(empty);
  const [uploading, setUploading] = useState(false);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (it: Item) => {
    setEditing(it);
    setForm({ id: it.id, name: it.name, description: it.description ?? "", price: String(it.price), category_id: it.category_id ?? "", image_url: it.image_url ?? "", available: it.available, featured: it.featured, prep_time_minutes: it.prep_time_minutes });
    setOpen(true);
  };

  const upload = async (file: File) => {
    if (!companyId) return;
    setUploading(true);
    const path = `${companyId}/menu/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("tenant-assets").upload(path, file, { upsert: true });
    setUploading(false);
    if (error) return toast.error(error.message);
    const { data: pub } = supabase.storage.from("tenant-assets").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: pub.publicUrl }));
    toast.success("Imagem enviada");
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        company_id: companyId!, name: form.name, description: form.description || null,
        price: Number(form.price), category_id: form.category_id || null,
        image_url: form.image_url || null, available: form.available, featured: form.featured,
        prep_time_minutes: Number(form.prep_time_minutes) || 15,
      };
      if (editing) {
        const { error } = await supabase.from("menu_item").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_item").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { setOpen(false); qc.invalidateQueries({ queryKey: ["menu_item"] }); toast.success("Item salvo"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("menu_item").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_item"] }),
  });
  const toggleAvail = useMutation({
    mutationFn: async ({ id, available }: { id: string; available: boolean }) => {
      const { error } = await supabase.from("menu_item").update({ available }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_item"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1" />Novo item</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const cat = cats.find((c) => c.id === it.category_id);
          return (
            <Card key={it.id} className="overflow-hidden">
              {it.image_url ? <img src={it.image_url} alt={it.name} className="h-36 w-full object-cover" /> : <div className="h-36 bg-muted" />}
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    {cat && <div className="text-xs text-muted-foreground">{cat.name}</div>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(it)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => del.mutate(it.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                {it.description && <p className="text-sm text-muted-foreground line-clamp-2">{it.description}</p>}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">{brl(it.price)}</div>
                  <div className="flex items-center gap-2 text-xs"><span className="text-muted-foreground">Disponível</span><Switch checked={it.available} onCheckedChange={(v) => toggleAvail.mutate({ id: it.id, available: v })} /></div>
                </div>
              </div>
            </Card>
          );
        })}
        {items.length === 0 && <p className="text-muted-foreground">Nenhum item.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar item" : "Novo item"}</DialogTitle></DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            <div><Label>Nome</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Descrição</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Preço</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
              <div><Label>Tempo preparo (min)</Label><Input type="number" value={form.prep_time_minutes} onChange={(e) => setForm({ ...form, prep_time_minutes: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Categoria</Label>
              <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Foto</Label>
              <div className="flex items-center gap-3">
                {form.image_url && <img src={form.image_url} alt="" className="h-16 w-16 rounded object-cover" />}
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent">
                  <Upload className="h-4 w-4" />{uploading ? "Enviando..." : "Enviar foto"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
                </label>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.available} onCheckedChange={(v) => setForm({ ...form, available: v })} /> Disponível</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} /> Destaque</label>
            </div>
          </div>
          <DialogFooter><Button onClick={() => save.mutate()} disabled={!form.name || !form.price || save.isPending}>Salvar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExtrasTab({ items, extras }: { items: Item[]; extras: Extra[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ menu_item_id: "", name: "", price: "", max_qty: "1" });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("menu_item_extra").insert({
        menu_item_id: form.menu_item_id, name: form.name,
        price: Number(form.price), max_qty: Number(form.max_qty) || 1,
      });
      if (error) throw error;
    },
    onSuccess: () => { setForm({ menu_item_id: "", name: "", price: "", max_qty: "1" }); setOpen(false); qc.invalidateQueries({ queryKey: ["menu_item_extra"] }); toast.success("Extra criado"); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("menu_item_extra").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menu_item_extra"] }),
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" />Novo extra</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo extra</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Item</Label>
                <Select value={form.menu_item_id} onValueChange={(v) => setForm({ ...form, menu_item_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecionar item" /></SelectTrigger>
                  <SelectContent>{items.map((it) => <SelectItem key={it.id} value={it.id}>{it.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Nome do extra</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Bacon, Catupiry" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Preço</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                <div><Label>Qtd máx</Label><Input type="number" value={form.max_qty} onChange={(e) => setForm({ ...form, max_qty: e.target.value })} /></div>
              </div>
            </div>
            <DialogFooter><Button onClick={() => add.mutate()} disabled={!form.menu_item_id || !form.name}>Salvar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left"><tr><th className="p-3">Item</th><th className="p-3">Extra</th><th className="p-3">Preço</th><th className="p-3">Qtd máx</th><th className="p-3"></th></tr></thead>
          <tbody>
            {extras.map((x) => {
              const it = items.find((i) => i.id === x.menu_item_id);
              return (
                <tr key={x.id} className="border-t">
                  <td className="p-3">{it?.name ?? "—"}</td>
                  <td className="p-3 font-medium">{x.name}</td>
                  <td className="p-3">{brl(x.price)}</td>
                  <td className="p-3">{x.max_qty}</td>
                  <td className="p-3 text-right"><Button size="icon" variant="ghost" onClick={() => del.mutate(x.id)}><Trash2 className="h-4 w-4" /></Button></td>
                </tr>
              );
            })}
            {extras.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum extra cadastrado.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

