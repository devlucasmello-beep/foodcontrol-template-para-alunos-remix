// Rich mock dataset for /demo/* and as fallback seeds. Pure in-memory.
import { subDays, subHours, subMinutes, format } from "date-fns";

const IMG = (id: string, w = 600, h = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const demoCompany = {
  id: "demo-co",
  name: "Hamburgueria do Zé",
  slug: "hamburgueria-ze",
  cnpj: "12.345.678/0001-90",
  email: "contato@hamburgueriadoze.com.br",
  telefone: "(11) 3344-5566",
  whatsapp: "(11) 98765-4321",
  endereco: { rua: "Rua das Flores, 234", bairro: "Vila Madalena", cidade: "São Paulo", uf: "SP", cep: "05435-010" },
  cor_primaria: "#DC2626",
  logo_url: null,
  delivery_fee: 8,
  min_order: 30,
  plano: "profissional",
  status: "active",
  valor_mensal: 397,
  trial_ate: subDays(new Date(), -60).toISOString(),
  business_hours: {
    seg: "18:00-23:30", ter: "18:00-23:30", qua: "18:00-23:30", qui: "18:00-23:30",
    sex: "18:00-00:30", sab: "12:00-00:30", dom: "12:00-23:00",
  },
};

// Premium hardcoded KPIs for "vendável" demo
export const demoKpisPremium = {
  pedidosHoje: 47,
  pedidosHojeDelta: 8,
  pedidosSemana: 312,
  pedidosMes: 1284,
  receitaMes: 68400,
  receitaMesDelta: 22,
  ticketMedio: 53.30,
  ticketMedioDelta: 4,
  clientesAtivos: 287,
  clientesAtivosDelta: 24,
  taxaConversao: 0.18,
  tempoMedioPreparo: 18,
  entregadoresAtivos: 4,
  entregadoresTotal: 6,
  avaliacaoMedia: 4.7,
  emPreparoAgora: 8,
  alertasAi: 5,
};

export const demoDashboardAlerts = [
  { tone: "red" as const, title: "4 pedidos novos aguardando preparo", desc: "Cozinha tem fila — atenção ao tempo de resposta" },
  { tone: "amber" as const, title: "Terças 19h-21h: ocupação 40%", desc: "Padrão de baixa recorrente — criar promo happy-hour" },
  { tone: "emerald" as const, title: "Recorde do dia! 47 pedidos às 18h", desc: "Acima da média diária (32) — operação rodando 100%" },
  { tone: "sky" as const, title: "18 clientes inativos +30 dias", desc: "Reativar via WhatsApp pode gerar até R$ 2.500" },
];

export const demoTopProductsRich = [
  { rank: 1, name: "Smash Burger Duplo", qty: 142, revenue: 4544 },
  { rank: 2, name: "X-Bacon Artesanal", qty: 98, revenue: 2744 },
  { rank: 3, name: "Batata Frita Rústica", qty: 168, revenue: 2688 },
  { rank: 4, name: "Classic Burger", qty: 76, revenue: 1672 },
  { rank: 5, name: "Milkshake 400ml", qty: 64, revenue: 1152 },
];

export const demoWeeklyRevenue = [
  { day: "Seg", revenue: 8400 },
  { day: "Ter", revenue: 7200 },
  { day: "Qua", revenue: 8900 },
  { day: "Qui", revenue: 9100 },
  { day: "Sex", revenue: 12400 },
  { day: "Sáb", revenue: 14200 },
  { day: "Dom", revenue: 8200 },
];

export const demoCategoryDistribution = [
  { name: "Hambúrgueres", value: 42 },
  { name: "Pizzas", value: 22 },
  { name: "Acompanhamentos", value: 18 },
  { name: "Bebidas", value: 12 },
  { name: "Sobremesas", value: 6 },
];

export const demoAIInsightsPremium = [
  {
    id: "ai1", title: "18 clientes inativos há +30 dias", priority: "ALTA" as const,
    impacto: 2500, count: 18,
    clientes: ["Marina Souza", "Carlos Lima", "Beatriz Rocha", "Felipe Alves", "+14 mais"],
    mensagem: "Oi {nome}! 🍔 Sentimos sua falta na Hamburgueria do Zé! Hoje você ganha frete grátis no seu primeiro pedido. Quer testar nosso novo Smash Burger Duplo? 🔥",
  },
  {
    id: "ai2", title: "12 clientes com ticket baixo (R$25-35)", priority: "OPORTUNIDADE" as const,
    impacto: 1440, count: 12,
    clientes: ["Pedro Santos", "Júlia Mendes", "Lucas Ferreira", "+9 mais"],
    mensagem: "Que tal subir o nível? 😋 Combo Smash Burger + Batata + Bebida por R$ 45 (você economiza R$ 10). Pedir agora?",
  },
  {
    id: "ai3", title: "Terças 19h-21h: ocupação em 40%", priority: "MÉDIA" as const,
    impacto: 3200, count: 0,
    clientes: [],
    mensagem: "Terça é dia de Happy-Hour! 🍻 30% off em bebidas das 19h às 21h. Chama a galera e bora!",
  },
  {
    id: "ai4", title: "Combo X-Bacon + Batata converte 40%", priority: "OPORTUNIDADE" as const,
    impacto: 4200, count: 0,
    clientes: [],
    mensagem: "Sugerir no checkout: 'Adicione Batata Rústica por +R$12 e ganhe Coca-Cola grátis'.",
  },
  {
    id: "ai5", title: "8 aniversariantes do mês", priority: "ALTA" as const,
    impacto: 1460, count: 8,
    clientes: ["Sofia Cardoso", "Mateus Gomes", "Larissa Almeida", "+5 mais"],
    mensagem: "Parabéns, {nome}! 🎂🎉 Sua sobremesa é por nossa conta esse mês. Faz seu pedido e a gente manda junto. ❤️",
  },
];

export const demoCompanyUsers = [
  { id: "u1", nome: "Ana Owner", email: "ana@excellence.com.br", role: "admin", ativo: true, ultimo_login: subHours(new Date(), 2).toISOString() },
  { id: "u2", nome: "Bruno Gerente", email: "bruno@excellence.com.br", role: "admin", ativo: true, ultimo_login: subHours(new Date(), 5).toISOString() },
  { id: "u3", nome: "Carla Garçonete", email: "carla@excellence.com.br", role: "garcom", ativo: true, ultimo_login: subDays(new Date(), 1).toISOString() },
  { id: "u4", nome: "Diego Garçom", email: "diego@excellence.com.br", role: "garcom", ativo: true, ultimo_login: subDays(new Date(), 1).toISOString() },
  { id: "u5", nome: "Eduardo Cozinha", email: "edu@excellence.com.br", role: "cozinha", ativo: true, ultimo_login: subHours(new Date(), 3).toISOString() },
  { id: "u6", nome: "Fabio Cozinha", email: "fabio@excellence.com.br", role: "cozinha", ativo: true, ultimo_login: subHours(new Date(), 1).toISOString() },
  { id: "u7", nome: "Gabriela Caixa", email: "gabi@excellence.com.br", role: "caixa", ativo: true, ultimo_login: subHours(new Date(), 4).toISOString() },
  { id: "u8", nome: "Helena Financeiro", email: "helena@excellence.com.br", role: "caixa", ativo: false, ultimo_login: subDays(new Date(), 7).toISOString() },
];

export const demoCategories = [
  { id: "c1", name: "Entradas", sort_order: 1, active: true },
  { id: "c2", name: "Pratos Principais", sort_order: 2, active: true },
  { id: "c3", name: "Hambúrgueres", sort_order: 3, active: true },
  { id: "c4", name: "Pizzas", sort_order: 4, active: true },
  { id: "c5", name: "Bebidas", sort_order: 5, active: true },
  { id: "c6", name: "Sobremesas", sort_order: 6, active: true },
];

export type DemoItem = {
  id: string; category_id: string; name: string; description: string;
  price: number; image_url: string; prep_time_minutes: number; featured: boolean; available: boolean;
};

export const demoItems: DemoItem[] = [
  // Entradas
  { id: "i1", category_id: "c1", name: "Bruschetta", description: "Pão italiano grelhado, tomate fresco, manjericão e azeite", price: 22, image_url: IMG("1572441713132-51c75654db73"), prep_time_minutes: 10, featured: false, available: true },
  { id: "i2", category_id: "c1", name: "Bolinho de Bacalhau", description: "6 unidades, crocante por fora, macio por dentro", price: 28, image_url: IMG("1626804475297-41608ea09aeb"), prep_time_minutes: 15, featured: false, available: true },
  { id: "i3", category_id: "c1", name: "Carpaccio", description: "Finas fatias de filé mignon, alcaparras e parmesão", price: 38, image_url: IMG("1547573854-74d2a71d0826"), prep_time_minutes: 8, featured: true, available: true },
  // Pratos
  { id: "i4", category_id: "c2", name: "Salmão Grelhado", description: "Filé de salmão, legumes salteados e arroz de jasmim", price: 78, image_url: IMG("1467003909585-2f8a72700288"), prep_time_minutes: 25, featured: true, available: true },
  { id: "i5", category_id: "c2", name: "Picanha 300g", description: "Picanha grelhada, farofa, vinagrete e arroz", price: 95, image_url: IMG("1558030006-450675393462"), prep_time_minutes: 30, featured: true, available: true },
  { id: "i6", category_id: "c2", name: "Risoto de Cogumelos", description: "Arroz arbóreo, mix de cogumelos frescos e parmesão", price: 58, image_url: IMG("1476124369491-e7addf5db371"), prep_time_minutes: 25, featured: false, available: true },
  { id: "i7", category_id: "c2", name: "Massa Carbonara", description: "Spaghetti, bacon, gema, parmesão e pimenta-do-reino", price: 48, image_url: IMG("1612874742237-6526221588e3"), prep_time_minutes: 20, featured: false, available: true },
  { id: "i8", category_id: "c2", name: "Filé Mignon", description: "200g, molho madeira e batata gratinada", price: 92, image_url: IMG("1546833999-b9f581a1996d"), prep_time_minutes: 25, featured: false, available: true },
  // Hambúrgueres
  { id: "i9", category_id: "c3", name: "X-Tudo", description: "Blend 180g, bacon, ovo, queijo, alface, tomate, batata", price: 32, image_url: IMG("1568901346375-23c9450c58cd"), prep_time_minutes: 18, featured: true, available: true },
  { id: "i10", category_id: "c3", name: "Cheese Burger", description: "Blend 150g, cheddar derretido, picles e molho", price: 28, image_url: IMG("1572802419224-296b0aeee0d9"), prep_time_minutes: 15, featured: false, available: true },
  { id: "i11", category_id: "c3", name: "Veggie Burger", description: "Burger de grão-de-bico, rúcula, tomate seco", price: 30, image_url: IMG("1525059696034-4967a729002e"), prep_time_minutes: 15, featured: false, available: true },
  { id: "i12", category_id: "c3", name: "Smash Burger", description: "Dois blends 90g esmagados, cebola, queijo americano", price: 36, image_url: IMG("1565299507177-b0ac66763828"), prep_time_minutes: 18, featured: true, available: true },
  // Pizzas
  { id: "i13", category_id: "c4", name: "Pizza Margherita", description: "Molho de tomate, muçarela de búfala, manjericão", price: 48, image_url: IMG("1565299624946-b28f40a0ae38"), prep_time_minutes: 25, featured: true, available: true },
  { id: "i14", category_id: "c4", name: "Pizza Calabresa", description: "Calabresa fatiada, cebola roxa, azeitona preta", price: 52, image_url: IMG("1571407970349-bc81e7e96d47"), prep_time_minutes: 25, featured: false, available: true },
  { id: "i15", category_id: "c4", name: "Pizza Quatro Queijos", description: "Muçarela, gorgonzola, parmesão e provolone", price: 58, image_url: IMG("1513104890138-7c749659a591"), prep_time_minutes: 25, featured: false, available: true },
  { id: "i16", category_id: "c4", name: "Pizza Portuguesa", description: "Presunto, ovo, cebola, ervilha, azeitona", price: 56, image_url: IMG("1574071318508-1cdbab80d002"), prep_time_minutes: 25, featured: false, available: true },
  // Bebidas
  { id: "i17", category_id: "c5", name: "Coca-Cola Lata", description: "350ml gelada", price: 8, image_url: IMG("1554866585-cd94860890b7"), prep_time_minutes: 1, featured: false, available: true },
  { id: "i18", category_id: "c5", name: "Suco Natural", description: "Laranja ou limão, 500ml", price: 12, image_url: IMG("1600271886742-f049cd451bba"), prep_time_minutes: 3, featured: false, available: true },
  { id: "i19", category_id: "c5", name: "Cerveja Long Neck", description: "Heineken ou Stella, 330ml", price: 10, image_url: IMG("1608270586620-248524c67de9"), prep_time_minutes: 1, featured: false, available: true },
  { id: "i20", category_id: "c5", name: "Taça de Vinho", description: "Tinto ou branco, da casa", price: 22, image_url: IMG("1510812431401-41d2bd2722f3"), prep_time_minutes: 2, featured: false, available: true },
  // Sobremesas
  { id: "i21", category_id: "c6", name: "Pudim de Leite", description: "Tradicional com calda de caramelo", price: 15, image_url: IMG("1563729784474-d77dbb933a9e"), prep_time_minutes: 5, featured: false, available: true },
  { id: "i22", category_id: "c6", name: "Petit Gateau", description: "Bolinho quente com sorvete de creme", price: 22, image_url: IMG("1602351447937-745cb720612f"), prep_time_minutes: 12, featured: true, available: true },
  { id: "i23", category_id: "c6", name: "Mousse de Maracujá", description: "Cremoso, com calda azedinha", price: 14, image_url: IMG("1551024506-0bccd828d307"), prep_time_minutes: 5, featured: false, available: true },
];

export const demoExtras = [
  { id: "x1", menu_item_id: "i9", name: "Bacon extra", price: 5 },
  { id: "x2", menu_item_id: "i9", name: "Queijo extra", price: 3 },
  { id: "x3", menu_item_id: "i9", name: "Cebola caramelizada", price: 4 },
  { id: "x4", menu_item_id: "i10", name: "Bacon", price: 5 },
  { id: "x5", menu_item_id: "i10", name: "Cheddar duplo", price: 4 },
  { id: "x6", menu_item_id: "i12", name: "Smash extra", price: 8 },
  { id: "x7", menu_item_id: "i12", name: "Cebola caramelizada", price: 4 },
  { id: "x8", menu_item_id: "i13", name: "Borda recheada catupiry", price: 8 },
  { id: "x9", menu_item_id: "i13", name: "Borda recheada cheddar", price: 8 },
  { id: "x10", menu_item_id: "i14", name: "Borda recheada catupiry", price: 8 },
  { id: "x11", menu_item_id: "i15", name: "Borda recheada catupiry", price: 8 },
  { id: "x12", menu_item_id: "i4", name: "Porção extra de arroz", price: 6 },
  { id: "x13", menu_item_id: "i5", name: "Porção extra de farofa", price: 6 },
  { id: "x14", menu_item_id: "i7", name: "Bacon extra", price: 5 },
  { id: "x15", menu_item_id: "i22", name: "Bola extra de sorvete", price: 6 },
];

export const demoRiders = [
  { id: "r1", name: "João Silva", phone: "(11) 91234-5678", vehicle_type: "moto", plate: "ABC-1234", active: true, commission_pct: 10 },
  { id: "r2", name: "Pedro Santos", phone: "(11) 99876-5432", vehicle_type: "bike", plate: null, active: true, commission_pct: 8 },
  { id: "r3", name: "Carlos Oliveira", phone: "(11) 95555-1234", vehicle_type: "moto", plate: "DEF-5678", active: true, commission_pct: 12 },
  { id: "r4", name: "Roberto Alves", phone: "(11) 94444-2222", vehicle_type: "carro", plate: "GHI-9012", active: true, commission_pct: 15 },
  { id: "r5", name: "Lucas Pereira", phone: "(11) 93333-7777", vehicle_type: "moto", plate: "JKL-3456", active: false, commission_pct: 10 },
];

export const demoZones = [
  { id: "z1", name: "Centro", delivery_fee: 5, min_order: 25, eta_minutes: 30, active: true },
  { id: "z2", name: "Bairro Norte", delivery_fee: 8, min_order: 30, eta_minutes: 45, active: true },
  { id: "z3", name: "Bairro Sul", delivery_fee: 7, min_order: 30, eta_minutes: 40, active: true },
  { id: "z4", name: "Periferia", delivery_fee: 15, min_order: 50, eta_minutes: 60, active: true },
];

const firstNames = ["Ana", "Pedro", "Júlia", "Carlos", "Marina", "Lucas", "Camila", "Felipe", "Beatriz", "Rafael", "Sofia", "Mateus", "Larissa", "Gustavo", "Letícia", "Diego", "Isabela", "Thiago", "Manuela", "Bruno", "Helena", "André", "Carolina", "Ricardo", "Vitória", "Eduardo", "Fernanda", "Marcelo", "Patrícia", "Rodrigo"];
const lastNames = ["Silva", "Santos", "Costa", "Oliveira", "Souza", "Lima", "Pereira", "Rocha", "Alves", "Mendes", "Rodrigues", "Ferreira", "Almeida", "Gomes", "Cardoso"];

export const demoCustomers = Array.from({ length: 30 }).map((_, i) => {
  const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
  const total_orders = Math.max(1, Math.round(Math.abs(Math.sin(i + 1) * 18) + (i % 7)));
  const total_spent = Math.round(total_orders * (45 + Math.random() * 50) * 100) / 100;
  return {
    id: `cu${i + 1}`, name, phone: `(11) 9${String(1000 + i).slice(-4)}-${String(1000 + i * 7).slice(-4)}`,
    address: { line: `Rua ${lastNames[i % lastNames.length]}, ${100 + i}` },
    total_orders, total_spent,
    last_order_at: subDays(new Date(), i % 30).toISOString(),
    status: total_orders >= 10 ? "vip" : "active",
  };
});

type Status = "novo" | "preparo" | "pronto" | "saiu" | "entregue" | "cancelado";
const PAYMENTS = ["Pix", "Dinheiro", "Cartão", "Online"];
const TYPES = ["delivery", "balcao", "mesa"];

export type DemoOrder = {
  id: string; number: number; customer_name: string; customer_phone: string; customer_address?: { line: string };
  status: Status; type: string; payment_method: string; payment_status: "pendente" | "pago";
  subtotal: number; delivery_fee: number; discount: number; total: number;
  rider_id?: string; items: { name: string; qty: number; unit_price: number; total: number; extras?: { name: string; price: number }[] }[];
  created_at: string; notes?: string;
};

function makeOrder(i: number, status: Status): DemoOrder {
  const c = demoCustomers[i % demoCustomers.length];
  const itemsCount = 1 + (i % 4);
  const items = Array.from({ length: itemsCount }).map((_, k) => {
    const it = demoItems[(i * 3 + k) % demoItems.length];
    const qty = 1 + (k % 2);
    return { name: it.name, qty, unit_price: it.price, total: it.price * qty };
  });
  const subtotal = items.reduce((s, x) => s + x.total, 0);
  const type = TYPES[i % TYPES.length];
  const delivery_fee = type === "delivery" ? 7 : 0;
  const discount = i % 8 === 0 ? 5 : 0;
  const total = subtotal + delivery_fee - discount;
  const minutesAgo = status === "novo" ? (i % 15) + 1 : status === "preparo" ? 15 + (i % 20) : status === "pronto" ? 30 + (i % 15) : 45 + (i % 60);
  return {
    id: `o${i + 1}`, number: 1000 + i,
    customer_name: c.name, customer_phone: c.phone,
    customer_address: type === "delivery" ? c.address : undefined,
    status, type, payment_method: PAYMENTS[i % PAYMENTS.length],
    payment_status: status === "entregue" || i % 3 === 0 ? "pago" : "pendente",
    subtotal, delivery_fee, discount, total,
    rider_id: type === "delivery" && (status === "saiu" || status === "entregue") ? demoRiders[i % 4].id : undefined,
    items, notes: i % 6 === 0 ? "Sem cebola, por favor" : undefined,
    created_at: subMinutes(new Date(), minutesAgo).toISOString(),
  };
}

const STATUS_PLAN: Status[] = ["novo", "novo", "novo", "novo", "novo", "preparo", "preparo", "preparo", "preparo", "preparo", "preparo", "preparo", "pronto", "pronto", "pronto", "pronto", "saiu", "saiu", "saiu", "saiu", "saiu", "entregue", "entregue", "entregue", "entregue", "entregue", "entregue", "entregue", "entregue", "entregue", "cancelado", "cancelado"];

export const demoOrders: DemoOrder[] = STATUS_PLAN.map((s, i) => makeOrder(i, s));

// 30-day sales aggregation
export const demoLast30 = Array.from({ length: 30 }).map((_, i) => {
  const d = subDays(new Date(), 29 - i);
  const orders = 18 + Math.round(Math.sin(i / 3) * 6 + Math.random() * 8);
  const revenue = Math.round(orders * (55 + Math.random() * 25) * 100) / 100;
  return { date: format(d, "yyyy-MM-dd"), label: format(d, "dd/MM"), orders, revenue };
});

// Hourly distribution today
export const demoHourly = Array.from({ length: 14 }).map((_, i) => {
  const h = i + 10; // 10h..23h
  const peak = (h >= 12 && h <= 14) || (h >= 19 && h <= 22);
  const orders = peak ? 6 + Math.round(Math.random() * 8) : 1 + Math.round(Math.random() * 3);
  return { hour: `${h}h`, orders };
});

export const demoTopItems = [
  { name: "Pizza Margherita", value: 28 },
  { name: "X-Tudo", value: 22 },
  { name: "Smash Burger", value: 18 },
  { name: "Picanha 300g", value: 15 },
  { name: "Salmão Grelhado", value: 12 },
];

export const demoFinancial = (() => {
  const entries: { id: string; date: string; description: string; type: "entrada" | "saida"; category: string; amount: number }[] = [];
  demoLast30.forEach((d, i) => {
    entries.push({ id: `f-in-${i}`, date: d.date, description: `Vendas do dia (${d.orders} pedidos)`, type: "entrada", category: "Vendas", amount: d.revenue });
    if (i % 3 === 0) entries.push({ id: `f-fx-${i}`, date: d.date, description: "Fornecedor - insumos", type: "saida", category: "Insumos", amount: Math.round(d.revenue * 0.32 * 100) / 100 });
    if (i % 7 === 0) entries.push({ id: `f-rd-${i}`, date: d.date, description: "Comissão entregadores", type: "saida", category: "Comissões", amount: Math.round(d.revenue * 0.08 * 100) / 100 });
  });
  return entries.reverse();
})();

export const demoKpis = (() => {
  const today = demoLast30[demoLast30.length - 1];
  const ordersInProgress = demoOrders.filter((o) => ["novo", "preparo", "pronto", "saiu"].includes(o.status));
  const delivered = demoOrders.filter((o) => o.status === "entregue");
  const canceled = demoOrders.filter((o) => o.status === "cancelado");
  return {
    ordersToday: today.orders,
    revenueToday: today.revenue,
    peakOrders: Math.max(...demoHourly.map((h) => h.orders)),
    avgTicket: Math.round((today.revenue / today.orders) * 100) / 100,
    activeCustomers: demoCustomers.filter((c) => c.total_orders >= 3).length,
    deliveryRate: Math.round((delivered.length / demoOrders.length) * 100),
    avgDeliveryMin: 42,
    activeRiders: demoRiders.filter((r) => r.active).length,
    cancelRate: Math.round((canceled.length / demoOrders.length) * 100),
    aiAlerts: 4,
    ordersInProgress: ordersInProgress.length,
  };
})();

export const demoAIInsights = [
  { title: "3 pratos com baixa saída esta semana", body: "Bolinho de Bacalhau, Mousse de Maracujá e Suco Natural caíram 35%. Sugestão: destacar como combo ou aplicar 15% off por 7 dias.", action: "Criar promoção" },
  { title: "Horários vazios entre 15h e 17h", body: "Apenas 8% dos pedidos acontecem nesse período. Sugestão: happy-hour com 20% off em bebidas.", action: "Ativar happy-hour" },
  { title: "47 clientes não pedem há 30+ dias", body: "Total potencial estimado: R$ 2.350. Sugestão: cupom de reativação de R$ 10 via WhatsApp.", action: "Enviar cupom" },
  { title: "Entregador Roberto com baixa ocupação", body: "Apenas 12% de utilização. Sugestão: redistribuir zona Sul para ele.", action: "Redistribuir zonas" },
];

