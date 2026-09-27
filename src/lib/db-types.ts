// Auto-generated from your database schema — do not edit by hand.
// Regenerates automatically whenever a table is created or altered.

export type AppConfigRow = {
  appName: string | null
  createdAt: string
  id: string
  singleton: boolean
  superAdminEmails: string
  systemSettings: string | null
  updatedAt: string
}

export type CompanyRow = {
  businessHours: string | null
  cnpj: string | null
  corPrimaria: string
  createdAt: string
  deliveryFee: number | string
  email: string | null
  endereco: string | null
  id: string
  logoUrl: string | null
  minOrder: number | string
  name: string
  plano: string
  slug: string
  status: string
  telefone: string | null
  trialAte: string
  ultimoAcesso: string | null
  updatedAt: string
  valorMensal: number | string
  whatsapp: string | null
  ownerEmail: string | null
}

export type CompanyUserRow = {
  ativo: boolean
  companyId: string
  createdAt: string
  email: string
  id: string
  nome: string | null
  role: string
  ultimoLogin: string | null
  updatedAt: string
  userId: string | null
}

export type CustomerRow = {
  address: string | null
  companyId: string
  createdAt: string
  email: string | null
  id: string
  lastOrderAt: string | null
  name: string
  phone: string
  status: string
  totalOrders: number | string
  totalSpent: number | string
  updatedAt: string
}

export type DeliveryZoneRow = {
  active: boolean
  companyId: string
  createdAt: string
  deliveryFee: number | string | null
  etaMinutes: number | string
  id: string
  minOrder: number | string | null
  name: string
  polygon: string | null
  updatedAt: string
}

export type FinancialEntryRow = {
  amount: number | string
  category: string | null
  companyId: string
  createdAt: string
  date: string
  description: string | null
  id: string
  referenceOrderId: string | null
  status: string
  type: string
  updatedAt: string
}

export type MenuCategoryRow = {
  active: boolean
  companyId: string
  createdAt: string
  id: string
  imageUrl: string | null
  name: string
  sortOrder: number | string
  updatedAt: string
}

export type MenuItemRow = {
  available: boolean
  categoryId: string | null
  companyId: string
  createdAt: string
  description: string | null
  featured: boolean
  id: string
  imageUrl: string | null
  name: string
  prepTimeMinutes: number | string
  price: number | string
  updatedAt: string
}

export type MenuItemExtraRow = {
  createdAt: string
  id: string
  maxQty: number | string
  menuItemId: string
  name: string
  price: number | string
  updatedAt: string
  companyId: string
}

export type OrderRow = {
  companyId: string
  createdAt: string
  customerAddress: string | null
  customerId: string | null
  customerName: string
  customerPhone: string
  deliveryFee: number | string
  discount: number | string
  etaMinutes: number | string | null
  id: string
  notes: string | null
  paymentMethod: string | null
  paymentStatus: string
  riderId: string | null
  status: string
  subtotal: number | string
  total: number | string
  type: string
  updatedAt: string
  trackingToken: string
  requestKey: string
}

export type OrderItemRow = {
  createdAt: string
  extras: string | null
  id: string
  menuItemId: string | null
  name: string
  notes: string | null
  orderId: string
  qty: number | string
  total: number | string
  unitPrice: number | string
  companyId: string
}

export type ProfilesRow = {
  userId: string
  email: string | null
}

export type RiderRow = {
  active: boolean
  commissionPct: number | string
  companyId: string
  createdAt: string
  id: string
  name: string
  phone: string
  plate: string | null
  updatedAt: string
  vehicleType: string | null
}

export type TemplateOwnerRow = {
  id: string
  userId: string
}

export type UserRolesRow = {
  companyId: string | null
  createdAt: string
  id: string
  role: string
  userId: string
}
