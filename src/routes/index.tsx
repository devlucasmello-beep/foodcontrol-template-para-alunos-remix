import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Check, ArrowRight, Sparkles, Globe, Layers, Truck, ChefHat, DollarSign, Brain, BarChart3, Settings, ShoppingBag,
  AlertCircle, Star, Flame,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FoodControl — AI para restaurantes e delivery" },
      { name: "description", content: "Cardápio online, KDS Kanban, gestão de entregas, financeiro e sugestões por regras para sua operação. Tudo num só sistema." },
      { property: "og:title", content: "FoodControl — Gestão de restaurantes" },
      { property: "og:description", content: "Cardápio, KDS, entregas, financeiro e AI Growth para restaurantes e delivery." },
    ],
  }),
  component: Landing,
});

const DEMO_SLUG = "hamburgueria-ze";

const modules = [
  { icon: Globe, title: "Cardápio digital", desc: "Link whitelabel com sua marca. Cliente pede sem app e sem cadastro." },
  { icon: Layers, title: "KDS Kanban de Pedidos", desc: "Recebido → Preparo → Pronto → Entrega → Entregue. Cozinha vê fila em tempo real." },
  { icon: Truck, title: "Gestão de Entregas", desc: "Cadastro de entregadores, atribuição de pedidos e acompanhamento de status." },
  { icon: ChefHat, title: "Cardápio rico", desc: "Categorias, produtos, extras e adicionais com foto e descrição." },
  { icon: DollarSign, title: "Financeiro", desc: "Registre receitas e despesas e acompanhe o saldo dos lançamentos." },
  { icon: Brain, title: "AI Growth", desc: "Orientações por regras para revisar pedidos, cardápio e entregas." },
  { icon: BarChart3, title: "Relatórios", desc: "Produtos mais pedidos, horários e indicadores dos pedidos cadastrados." },
  { icon: Settings, title: "Configurações", desc: "Cor da marca, horários, regiões de entrega e taxas." },
  { icon: ShoppingBag, title: "Painel público", desc: "Link do restaurante com pedido e forma de pagamento combinada na entrega." },
];

const pains = [
  "Pedidos perdidos no WhatsApp — sem rastreio",
  "Cozinha sem visibilidade de fila",
  "Entregadores sem coordenação",
  "Clientes que somem não voltam",
  "Sem dados de ticket médio nem produtos top",
  "Cardápio impresso desatualizado, sem fotos",
];

const steps = [
  { n: "01", title: "Configure seu cardápio", desc: "Adicione produtos com foto, preço e extras em minutos." },
  { n: "02", title: "Compartilhe seu link", desc: "Clientes pedem direto pelo /pedir/[seu-restaurante]." },
  { n: "03", title: "Cozinha recebe no KDS", desc: "Kanban para atualizar o status dos pedidos recebidos." },
  { n: "04", title: "Revise os resultados", desc: "Consulte os pedidos e seus indicadores para planejar as próximas ações." },
];

const aiChecks = [
  "Ajuda a revisar sua operação",
  "Mostra a fila que precisa de atenção",
  "Oferece orientações gerais",
  "Você decide as ações",
];

const aiInsights = [
  { label: "Exemplo: revisar clientes inativos", badge: "ALTA", tone: "bg-red-500/15 text-red-400 border-red-500/30" },
  { label: "Exemplo: verificar pedidos atrasados", badge: "MÉDIA", tone: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { label: "Exemplo: avaliar margem de um combo", badge: "OPORTUNIDADE", tone: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
];

const testimonials=[
 {name:'Cardápio organizado',role:'Recurso do sistema',quote:'Cadastre fotos, descrições, preços e adicionais dos seus pratos.'},
 {name:'Fila da cozinha',role:'Recurso do sistema',quote:'Confira os detalhes e avance cada pedido pelo Kanban.'},
 {name:'Gestão financeira',role:'Recurso do sistema',quote:'Registre receitas e despesas e consulte o saldo dos lançamentos.'},
];

const plans = [
  { name: "Starter", price: "R$ 197", desc: "Exemplo de oferta comercial", bullets: ["Cardápio digital", "KDS Kanban", "1 entregador", "Defina seu suporte"] },
  { name: "Pro", price: "R$ 397", desc: "Exemplo de oferta comercial", featured: true, bullets: ["Gestão de pedidos", "Painel de restaurantes", "AI Growth completo", "Relatórios avançados", "Defina seu suporte"] },
  { name: "Enterprise", price: "R$ 697", desc: "Exemplo de oferta comercial", bullets: ["Tudo do Pro", "Kanban de pedidos", "Personalização da operação", "Cadastro inicial", "Defina suas condições"] },
];

const faqs = [
  { q: "Preciso de cartão para testar?", a: "A demonstração visual abre sem cadastro e usa dados fictícios. Para receber pedidos reais, configure seu restaurante e publique seu cardápio." },
  { q: "Como meus clientes pedem?", a: "Após publicar, compartilhe o link do cardápio. O cliente escolhe os itens e acompanha o pedido. O pagamento é combinado diretamente com o restaurante." },
  { q: "Aceita PIX e cartão?", a: "O cliente informa a forma de pagamento desejada. O restaurante recebe e confere diretamente; não há gateway, QR Code Pix ou cobrança online integrada." },
  { q: "Posso usar minha marca?", a: "Sim. Cor primária, logo e nome aparecem no painel e na página pública. Whitelabel completo." },
  { q: "A IA cobra à parte?", a: "Este template usa orientações por regras, sem modelo de IA. Serviços externos e a plataforma de hospedagem têm suas próprias condições." },
  { q: "E se eu quiser cancelar?", a: "Este template não processa assinaturas. Defina seus contratos e condições comerciais antes de vender o serviço." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-md" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
              <Flame className="h-5 w-5" />
            </span>
            FoodControl
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#modulos" className="hover:text-foreground">Módulos</a>
            <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
            <Link to="/demo/dashboard" className="hover:text-foreground">Demo</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/entrar">Entrar</Link></Button>
            <Button asChild size="sm" className="text-white shadow-md" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
              <Link to="/entrar">Acessar sistema</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top, rgba(220,38,38,0.10), transparent 60%), radial-gradient(ellipse at bottom right, rgba(245,158,11,0.10), transparent 50%)" }} />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
            <Sparkles className="h-3 w-3" /> GESTÃO PARA RESTAURANTES E DELIVERIES
          </span>
          <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Pedidos organizados,<br />
            <span style={{ backgroundImage: "linear-gradient(135deg,#DC2626,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>equipe focada no que importa</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Cardápio online, KDS, gestão de entregas, financeiro e sugestões por regras para sua operação. Tudo num só sistema.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="text-white shadow-lg" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
              <Link to="/demo/cardapio">Explorar cardápio demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline"><Link to="/demo/dashboard">Ver dashboard</Link></Button>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>✓ Sem cadastro</span><span>✓ Demo completa</span><span>✓ Pagamento na entrega</span>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="text-white" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-12 md:grid-cols-4 text-center">
          {[
            { n: "Cardápio", l: "personalizável" },
            { n: "Pedidos", l: "organizados" },
            { n: "Equipe", l: "organizada" },
            { n: "Entrega", l: "acompanhada" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl md:text-5xl font-extrabold">{s.n}</div>
              <div className="mt-1 text-sm text-white/90">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MODULOS */}
      <section id="modulos" className="py-20 bg-surface">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#DC2626" }}>Módulos</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">9 módulos para organizar sua operação.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <Card key={m.title} className="p-6 hover:shadow-lg transition border-transparent hover:border-primary/30">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                  <m.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#DC2626" }}>Dores reais</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Você reconhece alguma destas?</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pains.map((p) => (
              <Card key={p} className="p-5 flex items-start gap-3 border-l-4" style={{ borderLeftColor: "#DC2626" }}>
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#DC2626" }} />
                <p className="font-medium">{p}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="py-20 bg-surface">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#DC2626" }}>Como funciona</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Do cadastro ao acompanhamento dos pedidos</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-5xl font-extrabold opacity-20" style={{ color: "#DC2626" }}>{s.n}</div>
                <h3 className="mt-2 font-semibold text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI GROWTH DARK */}
      <section className="bg-zinc-900 text-white py-20">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
              <Brain className="h-3 w-3" /> AI GROWTH · REGRAS
            </span>
            <h2 className="mt-5 text-3xl md:text-5xl font-bold">Informações para sua operação</h2>
            <p className="mt-4 text-zinc-400">Apresenta regras e orientações a partir dos pedidos. Você decide e executa as ações; não há disparos automáticos.</p>
            <ul className="mt-6 space-y-3">
              {aiChecks.map((c) => (
                <li key={c} className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                    <Check className="h-4 w-4 text-white" />
                  </span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            {aiInsights.map((i) => (
              <div key={i.label} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{i.label}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${i.tone}`}>{i.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Conheça os recursos</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6">
                <Check className="h-5 w-5 text-primary"/>
                <p className="mt-3 text-sm">"{t.quote}"</p>
                <div className="mt-4 border-t pt-3">
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#DC2626" }}>Planos</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Planos ilustrativos para personalizar</h2>
            <p className="mt-2 text-muted-foreground">Valores e condições são exemplos de oferta. Nenhuma cobrança automática está integrada.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.name} className={`p-6 relative ${p.featured ? "ring-2 shadow-xl scale-[1.02]" : ""}`} style={p.featured ? { borderColor: "#DC2626", boxShadow: "0 20px 50px -20px rgba(220,38,38,0.4)" } : undefined}>
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
                    EXEMPLO
                  </span>
                )}
                <div className="text-sm font-medium text-muted-foreground">{p.name}</div>
                <div className="mt-1 text-4xl font-bold">{p.price}<span className="text-base font-normal text-muted-foreground">/mês</span></div>
                <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.bullets.map((b) => <li key={b} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5" style={{ color: "#DC2626" }} />{b}</li>)}
                </ul>
                <Button asChild className={`mt-6 w-full ${p.featured ? "text-white" : ""}`} variant={p.featured ? "default" : "outline"} style={p.featured ? { background: "linear-gradient(135deg,#DC2626,#F59E0B)" } : undefined}>
                  <Link to="/entrar">Começar com {p.name}</Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Dúvidas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`}>
                <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-white py-20" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Pronto para organizar seu restaurante?</h2>
          <p className="mt-3 text-white/90">Cadastre o cardápio, configure a operação e publique seu link para receber pedidos.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/entrar">Acessar sistema</Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-foreground">
              <Link to="/demo/dashboard">Explorar demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-white font-bold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "linear-gradient(135deg,#DC2626,#F59E0B)" }}>
              <Flame className="h-4 w-4" />
            </span>
            FoodControl
          </div>
          <div>© {new Date().getFullYear()} FoodControl · Gestão completa para restaurantes</div>
        </div>
      </footer>
    </div>
  );
}

