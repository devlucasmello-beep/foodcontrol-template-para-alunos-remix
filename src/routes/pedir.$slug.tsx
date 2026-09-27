import {callBackend} from "@/blink/backend";
import { createFileRoute, useParams, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useMemo, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { brl } from "@/lib/format";
import { Plus, Minus, ShoppingBag, Clock, MapPin, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/pedir/$slug")({
  head: ({ params }) => ({ meta: [
    { title: `Pedir online — ${params.slug}` },
    { name: "description", content: `Faça seu pedido online em ${params.slug}. Cardápio com fotos, extras e checkout rápido.` },
  ]}),
  component: PublicRoute,
});

function PublicRoute(){const path=useRouterState({select:s=>s.location.pathname});return path.includes("/status/")?<Outlet/>:<Page/>;}

type Item = { id: string; name: string; description: string | null; price: number; category_id: string | null; image_url: string | null };
type Cat = { id: string; name: string };
type Extra = { id: string; menu_item_id: string; name: string; price: number };
type CartLine = { uid: string; item: Item; qty: number; extras: Extra[]; notes: string; unit: number; total: number };

function Page() {
  const { slug } = useParams({ from: "/pedir/$slug" });
  const [cart, setCart] = useState<CartLine[]>([]);
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", notes: "" });
  const [payment, setPayment] = useState("Pix");
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const requestKey=useRef(crypto.randomUUID());
  const [zoneId,setZoneId]=useState('');
  const {data:menu,error:menuError}=useQuery({queryKey:['public-menu',slug],queryFn:()=>callBackend('/api/public',{action:'menu',slug})});
  const company=menu?.company;const cats:Cat[]=menu?.cats||[];const items:Item[]=menu?.items||[];const extras:Extra[]=menu?.extras||[];const zones:any[]=menu?.zones||[];const zone=zones.find(z=>z.id===zoneId);

  const subtotal = cart.reduce((s, c) => s + c.total, 0);
  const deliveryFee = Number(zone?.delivery_fee ?? company?.delivery_fee ?? 0);
  const minOrder = Number(zone?.min_order ?? company?.min_order ?? 0);
  const total = subtotal + deliveryFee;
  const belowMin = subtotal > 0 && subtotal < minOrder;

  const submit = useMutation({
    mutationFn: async () => {
      if (!company) throw new Error("Restaurante não encontrado");
      if (cart.length === 0) throw new Error("Adicione itens ao carrinho");
      if (belowMin) throw new Error(`Pedido mínimo de ${brl(minOrder)}`);
      if (!customer.name || !customer.phone) throw new Error("Nome e telefone obrigatórios");

      const result=await callBackend('/api/public',{action:'order',slug,requestKey:requestKey.current,customer,payment,zoneId:zoneId||null,items:cart.map(c=>({id:c.item.id,qty:c.qty,extras:c.extras.map(e=>e.id),notes:c.notes}))});
      localStorage.setItem('food-order:'+result.id,result.token);requestKey.current=crypto.randomUUID();return result.id as string;
    },
    onSuccess: (orderId) => {
      setCart([]);
      setCustomer({ name: "", phone: "", address: "", notes: "" });
      setConfirmedOrderId(orderId);
      toast.success("Pedido recebido!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (menuError) return <div className="p-10 text-center">{menuError.message}</div>;
  if (company === null) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Restaurante não encontrado.</div>;
  if (!company) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Carregando…</div>;

  const itemExtras = openItem ? extras.filter((e) => e.menu_item_id === openItem.id) : [];

  return (
    <div className="min-h-screen bg-surface">
      <header className="px-6 py-8 text-white" style={{ background: `linear-gradient(135deg, ${company.cor_primaria}, ${company.cor_primaria}cc)` }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <div className="mt-2 flex flex-wrap gap-4 text-sm opacity-95">
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{menu?.open?"Recebendo pedidos":"Fora do horário de atendimento"}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />Entrega a partir de {brl(deliveryFee)}</span>
            {minOrder > 0 && <span>Pedido mínimo {brl(minOrder)}</span>}
          </div>
        </div>
      </header>

      {cats.length > 0 && (
        <nav className="sticky top-0 z-30 border-b bg-background overflow-x-auto">
          <div className="mx-auto max-w-6xl flex gap-2 px-4 py-3 whitespace-nowrap">
            {cats.map((c) => (
              <a key={c.id} href={`#cat-${c.id}`} className="rounded-full border px-3 py-1 text-sm hover:bg-muted">{c.name}</a>
            ))}
          </div>
        </nav>
      )}

      <div className="mx-auto max-w-6xl px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-8">
          {[...cats,...(items.some(i=>!i.category_id)?[{id:"",name:"Outros itens"}]:[])].map((c) => {
            const list = items.filter((i) => (i.category_id || "") === c.id);
            if (list.length === 0) return null;
            return (
              <div key={c.id} id={`cat-${c.id}`}>
                <h2 className="text-xl font-bold mb-3">{c.name}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {list.map((it) => (
                    <Card key={it.id} className="p-3 flex gap-3 cursor-pointer hover:shadow-md transition" onClick={() => setOpenItem(it)}>
                      {it.image_url && (
                        <img src={it.image_url} alt={it.name} className="h-24 w-24 rounded-md object-cover shrink-0" loading="lazy" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{it.name}</div>
                        {it.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{it.description}</p>}
                        <div className="mt-2 font-bold text-primary">{brl(it.price)}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-muted-foreground">Cardápio em breve.</p>}
        </div>

        <aside>
          <Card className="p-4 sticky top-20">
            <h3 className="font-semibold flex items-center gap-2"><ShoppingBag className="h-4 w-4" />Seu pedido ({cart.length})</h3>
            <div className="mt-3 space-y-2 text-sm max-h-72 overflow-y-auto">
              {cart.length === 0 ? <p className="text-muted-foreground">Carrinho vazio</p> :
                cart.map((c) => (
                  <div key={c.uid} className="flex gap-2 items-start border-b pb-2">
                    <div className="flex-1">
                      <div className="font-medium">{c.qty}× {c.item.name}</div>
                      {c.extras.length > 0 && <div className="text-xs text-muted-foreground">+ {c.extras.map((e) => e.name).join(", ")}</div>}
                      {c.notes && <div className="text-xs italic text-muted-foreground">"{c.notes}"</div>}
                    </div>
                    <div className="text-right">
                      <div>{brl(c.total)}</div>
                      <button className="text-xs text-muted-foreground hover:text-destructive" onClick={() => setCart((p) => p.filter((x) => x.uid !== c.uid))}>remover</button>
                    </div>
                  </div>
                ))
              }
            </div>
            {cart.length > 0 && (
              <>
                <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
                  <div className="flex justify-between"><span>Entrega</span><span>{brl(deliveryFee)}</span></div>
                  <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span>{brl(total)}</span></div>
                </div>
                {belowMin && <p className="mt-2 text-xs text-destructive">Pedido mínimo de {brl(minOrder)}. Faltam {brl(minOrder - subtotal)}.</p>}
                <div className="mt-4 space-y-2">
                  <div><Label>Nome</Label><Input value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /></div>
                  <div><Label>Telefone</Label><Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="(11) 99999-9999" /></div>
                  {zones.length>0&&<div><Label>Região de entrega</Label><select className="w-full h-10 border rounded bg-background" value={zoneId} onChange={e=>setZoneId(e.target.value)}><option value="">Selecione sua região</option>{zones.map(z=><option key={z.id} value={z.id}>{z.name} · {brl(Number(z.delivery_fee ?? company.delivery_fee))}</option>)}</select></div>}
                  <div><Label>Endereço completo</Label><Input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Rua, número, bairro" /></div>
                  <div>
                    <Label>Pagamento na entrega</Label>
                    <RadioGroup value={payment} onValueChange={setPayment} className="grid grid-cols-2 gap-2 mt-1">
                      {["Pix", "Dinheiro", "Cartão"].map((p) => (
                        <label key={p} className="flex items-center gap-2 rounded border p-2 text-sm cursor-pointer hover:bg-muted">
                          <RadioGroupItem value={p} /> {p}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div><Label>Observações</Label><Textarea rows={2} value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} /></div>
                  <Button className="w-full" disabled={submit.isPending || belowMin || !menu?.open || (zones.length>0&&!zoneId)} onClick={() => submit.mutate()}>
                    {submit.isPending ? "Enviando…" : `Fazer pedido · ${brl(total)}`}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </aside>
      </div>

      <ItemModal item={openItem} extras={itemExtras} onClose={() => setOpenItem(null)} onAdd={(line) => { setCart((p) => [...p, line]); setOpenItem(null); toast.success("Adicionado ao carrinho"); }} />

      <Dialog open={!!confirmedOrderId} onOpenChange={(o) => !o && setConfirmedOrderId(null)}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center gap-3">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              Pedido recebido!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Seu pedido <span className="font-mono font-semibold">#{confirmedOrderId?.slice(0, 8).toUpperCase()}</span> foi enviado ao restaurante. Acompanhe o status em tempo real.
          </p>
          <DialogFooter className="sm:justify-center">
            {confirmedOrderId && (
              <Button asChild className="w-full">
                <a href={`/pedir/${encodeURIComponent(slug)}/status/${confirmedOrderId}?token=${encodeURIComponent(localStorage.getItem("food-order:"+confirmedOrderId)||"")}`}>
                  Acompanhar pedido
                </a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemModal({ item, extras, onClose, onAdd }: { item: Item | null; extras: Extra[]; onClose: () => void; onAdd: (line: CartLine) => void }) {
  const [qty, setQty] = useState(1);
  const [chosen, setChosen] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");

  // reset on item change
  useMemo(() => { setQty(1); setChosen({}); setNotes(""); }, [item?.id]);

  if (!item) return null;
  const chosenExtras = extras.filter((e) => chosen[e.id]);
  const unit = Number(item.price) + chosenExtras.reduce((s, e) => s + Number(e.price), 0);
  const total = unit * qty;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-start gap-2">
            <span>{item.name}</span>
            <button onClick={onClose}><X className="h-4 w-4" /></button>
          </DialogTitle>
        </DialogHeader>
        {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-48 rounded-md object-cover" />}
        {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
        <div className="font-bold text-primary">{brl(item.price)}</div>

        {extras.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-2">Adicionais</div>
            <div className="space-y-1">
              {extras.map((e) => (
                <label key={e.id} className="flex items-center justify-between gap-2 rounded border p-2 text-sm cursor-pointer hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <Checkbox checked={!!chosen[e.id]} onCheckedChange={(v) => setChosen((p) => ({ ...p, [e.id]: !!v }))} />
                    {e.name}
                  </span>
                  <span className="font-medium">+ {brl(e.price)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Observações</Label>
          <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex.: sem cebola, ponto da carne…" />
        </div>

        <DialogFooter className="flex items-center justify-between gap-3 sm:justify-between">
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="h-3 w-3" /></Button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <Button size="icon" variant="outline" onClick={() => setQty((q) => Math.min(30,q + 1))}><Plus className="h-3 w-3" /></Button>
          </div>
          <Button className="flex-1" onClick={() => onAdd({ uid: `${item.id}-${Date.now()}`, item, qty, extras: chosenExtras, notes, unit, total })}>
            Adicionar · {brl(total)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

