CREATE TABLE IF NOT EXISTS "app_config" (
 "app_name" TEXT DEFAULT 'FoodControl AI',
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "singleton" BOOLEAN NOT NULL DEFAULT 1,
 "super_admin_emails" TEXT NOT NULL DEFAULT '[]',
 "system_settings" TEXT DEFAULT '{}',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS "company" (
 "business_hours" TEXT DEFAULT '{}',
 "cnpj" TEXT,
 "cor_primaria" TEXT NOT NULL DEFAULT '#ef4444',
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "delivery_fee" REAL NOT NULL DEFAULT 0 CHECK("delivery_fee" IS NULL OR "delivery_fee">=0),
 "email" TEXT,
 "endereco" TEXT DEFAULT '{}',
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "logo_url" TEXT,
 "min_order" REAL NOT NULL DEFAULT 0 CHECK("min_order" IS NULL OR "min_order">=0),
 "name" TEXT NOT NULL,
 "plano" TEXT NOT NULL DEFAULT 'starter',
 "slug" TEXT NOT NULL UNIQUE,
 "status" TEXT NOT NULL DEFAULT 'active',
 "telefone" TEXT,
 "trial_ate" TEXT NOT NULL DEFAULT '2099-12-31',
 "ultimo_acesso" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "valor_mensal" REAL NOT NULL DEFAULT 0,
 "whatsapp" TEXT,
 "owner_email" TEXT
);
CREATE TABLE IF NOT EXISTS "company_user" (
 "ativo" BOOLEAN NOT NULL DEFAULT 1,
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "email" TEXT NOT NULL,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "nome" TEXT,
 "role" TEXT NOT NULL DEFAULT 'garcom',
 "ultimo_login" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "user_id" TEXT
);
CREATE INDEX IF NOT EXISTS idx_company_user_company_id ON "company_user"(company_id);
CREATE INDEX IF NOT EXISTS idx_company_user_user_id ON "company_user"(user_id);
CREATE TABLE IF NOT EXISTS "customer" (
 "address" TEXT DEFAULT '{}',
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "email" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "last_order_at" TEXT,
 "name" TEXT NOT NULL,
 "phone" TEXT NOT NULL,
 "status" TEXT NOT NULL DEFAULT 'active',
 "total_orders" REAL NOT NULL DEFAULT 0,
 "total_spent" REAL NOT NULL DEFAULT 0,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_customer_company_id ON "customer"(company_id);
CREATE TABLE IF NOT EXISTS "delivery_zone" (
 "active" BOOLEAN NOT NULL DEFAULT 1,
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "delivery_fee" REAL DEFAULT 0 CHECK("delivery_fee" IS NULL OR "delivery_fee">=0),
 "eta_minutes" REAL NOT NULL DEFAULT '30',
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "min_order" REAL DEFAULT 0 CHECK("min_order" IS NULL OR "min_order">=0),
 "name" TEXT NOT NULL,
 "polygon" TEXT DEFAULT '[]',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_delivery_zone_company_id ON "delivery_zone"(company_id);
CREATE TABLE IF NOT EXISTS "financial_entry" (
 "amount" REAL NOT NULL CHECK("amount" IS NULL OR "amount">=0),
 "category" TEXT,
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "date" TEXT NOT NULL DEFAULT (date('now')),
 "description" TEXT,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "reference_order_id" TEXT,
 "status" TEXT NOT NULL DEFAULT 'pago',
 "type" TEXT NOT NULL DEFAULT 'entrada',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_financial_entry_company_id ON "financial_entry"(company_id);
CREATE INDEX IF NOT EXISTS idx_financial_entry_date ON "financial_entry"(date);
CREATE TABLE IF NOT EXISTS "menu_category" (
 "active" BOOLEAN NOT NULL DEFAULT 1,
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "image_url" TEXT,
 "name" TEXT NOT NULL,
 "sort_order" REAL NOT NULL DEFAULT 0,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_menu_category_company_id ON "menu_category"(company_id);
CREATE TABLE IF NOT EXISTS "menu_item" (
 "available" BOOLEAN NOT NULL DEFAULT 1,
 "category_id" TEXT,
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "description" TEXT,
 "featured" BOOLEAN NOT NULL DEFAULT '0',
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "image_url" TEXT,
 "name" TEXT NOT NULL,
 "prep_time_minutes" REAL NOT NULL DEFAULT '30',
 "price" REAL NOT NULL DEFAULT 0 CHECK("price" IS NULL OR "price">=0),
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_menu_item_company_id ON "menu_item"(company_id);
CREATE TABLE IF NOT EXISTS "menu_item_extra" (
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "max_qty" REAL NOT NULL DEFAULT '1',
 "menu_item_id" TEXT NOT NULL,
 "name" TEXT NOT NULL,
 "price" REAL NOT NULL DEFAULT 0 CHECK("price" IS NULL OR "price">=0),
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "company_id" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_menu_item_extra_company_id ON "menu_item_extra"(company_id);
CREATE TABLE IF NOT EXISTS "order" (
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "customer_address" TEXT DEFAULT '{}',
 "customer_id" TEXT,
 "customer_name" TEXT NOT NULL,
 "customer_phone" TEXT NOT NULL,
 "delivery_fee" REAL NOT NULL DEFAULT 0 CHECK("delivery_fee" IS NULL OR "delivery_fee">=0),
 "discount" REAL NOT NULL DEFAULT 0 CHECK("discount" IS NULL OR "discount">=0),
 "eta_minutes" REAL DEFAULT 0,
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "notes" TEXT,
 "payment_method" TEXT,
 "payment_status" TEXT NOT NULL DEFAULT 'pendente',
 "rider_id" TEXT,
 "status" TEXT NOT NULL DEFAULT 'novo',
 "subtotal" REAL NOT NULL DEFAULT 0 CHECK("subtotal" IS NULL OR "subtotal">=0),
 "total" REAL NOT NULL DEFAULT 0 CHECK("total" IS NULL OR "total">=0),
 "type" TEXT NOT NULL DEFAULT 'delivery',
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "tracking_token" TEXT NOT NULL,
 "request_key" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_company_id ON "order"(company_id);
CREATE TABLE IF NOT EXISTS "order_item" (
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "extras" TEXT DEFAULT '[]',
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "menu_item_id" TEXT,
 "name" TEXT NOT NULL,
 "notes" TEXT,
 "order_id" TEXT NOT NULL,
 "qty" REAL NOT NULL DEFAULT '1' CHECK("qty" IS NULL OR "qty">=0),
 "total" REAL NOT NULL CHECK("total" IS NULL OR "total">=0),
 "unit_price" REAL NOT NULL CHECK("unit_price" IS NULL OR "unit_price">=0),
 "company_id" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_order_item_company_id ON "order_item"(company_id);
CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON "order_item"(order_id);
CREATE TABLE IF NOT EXISTS "rider" (
 "active" BOOLEAN NOT NULL DEFAULT 1,
 "commission_pct" REAL NOT NULL DEFAULT '10' CHECK("commission_pct" BETWEEN 0 AND 100),
 "company_id" TEXT NOT NULL,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "name" TEXT NOT NULL,
 "phone" TEXT NOT NULL,
 "plate" TEXT,
 "updated_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "vehicle_type" TEXT
);
CREATE INDEX IF NOT EXISTS idx_rider_company_id ON "rider"(company_id);
CREATE TABLE IF NOT EXISTS "user_roles" (
 "company_id" TEXT,
 "created_at" TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 "id" TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
 "role" TEXT NOT NULL,
 "user_id" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_user_roles_company_id ON "user_roles"(company_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON "user_roles"(user_id);
CREATE TABLE IF NOT EXISTS profiles(user_id TEXT PRIMARY KEY,email TEXT);
CREATE TABLE IF NOT EXISTS template_owner(id TEXT PRIMARY KEY,user_id TEXT NOT NULL);
CREATE UNIQUE INDEX IF NOT EXISTS company_member_email ON company_user(company_id,lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS user_role_unique ON user_roles(user_id,role);
CREATE UNIQUE INDEX IF NOT EXISTS order_request_unique ON "order"(company_id,request_key);
CREATE UNIQUE INDEX IF NOT EXISTS customer_phone_unique ON customer(company_id,phone);
CREATE TRIGGER IF NOT EXISTS ref_company_user_company_id_insert BEFORE INSERT ON "company_user" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_company_user_company_id_update BEFORE UPDATE ON "company_user" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_customer_company_id_insert BEFORE INSERT ON "customer" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_customer_company_id_update BEFORE UPDATE ON "customer" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_delivery_zone_company_id_insert BEFORE INSERT ON "delivery_zone" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_delivery_zone_company_id_update BEFORE UPDATE ON "delivery_zone" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_financial_entry_company_id_insert BEFORE INSERT ON "financial_entry" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_financial_entry_company_id_update BEFORE UPDATE ON "financial_entry" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_financial_entry_reference_order_id_insert BEFORE INSERT ON "financial_entry" WHEN NEW."reference_order_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "order" WHERE id=NEW."reference_order_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_financial_entry_reference_order_id_update BEFORE UPDATE ON "financial_entry" WHEN NEW."reference_order_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "order" WHERE id=NEW."reference_order_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_category_company_id_insert BEFORE INSERT ON "menu_category" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_category_company_id_update BEFORE UPDATE ON "menu_category" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_company_id_insert BEFORE INSERT ON "menu_item" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_company_id_update BEFORE UPDATE ON "menu_item" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_category_id_insert BEFORE INSERT ON "menu_item" WHEN NEW."category_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_category" WHERE id=NEW."category_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_category_id_update BEFORE UPDATE ON "menu_item" WHEN NEW."category_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_category" WHERE id=NEW."category_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_extra_company_id_insert BEFORE INSERT ON "menu_item_extra" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_extra_company_id_update BEFORE UPDATE ON "menu_item_extra" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_extra_menu_item_id_insert BEFORE INSERT ON "menu_item_extra" WHEN NEW."menu_item_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_item" WHERE id=NEW."menu_item_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_menu_item_extra_menu_item_id_update BEFORE UPDATE ON "menu_item_extra" WHEN NEW."menu_item_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_item" WHERE id=NEW."menu_item_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_company_id_insert BEFORE INSERT ON "order" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_company_id_update BEFORE UPDATE ON "order" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_customer_id_insert BEFORE INSERT ON "order" WHEN NEW."customer_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "customer" WHERE id=NEW."customer_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_customer_id_update BEFORE UPDATE ON "order" WHEN NEW."customer_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "customer" WHERE id=NEW."customer_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_rider_id_insert BEFORE INSERT ON "order" WHEN NEW."rider_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "rider" WHERE id=NEW."rider_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_rider_id_update BEFORE UPDATE ON "order" WHEN NEW."rider_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "rider" WHERE id=NEW."rider_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_company_id_insert BEFORE INSERT ON "order_item" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_company_id_update BEFORE UPDATE ON "order_item" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_order_id_insert BEFORE INSERT ON "order_item" WHEN NEW."order_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "order" WHERE id=NEW."order_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_order_id_update BEFORE UPDATE ON "order_item" WHEN NEW."order_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "order" WHERE id=NEW."order_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_menu_item_id_insert BEFORE INSERT ON "order_item" WHEN NEW."menu_item_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_item" WHERE id=NEW."menu_item_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_order_item_menu_item_id_update BEFORE UPDATE ON "order_item" WHEN NEW."menu_item_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "menu_item" WHERE id=NEW."menu_item_id" AND company_id=NEW.company_id) BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_rider_company_id_insert BEFORE INSERT ON "rider" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS ref_rider_company_id_update BEFORE UPDATE ON "rider" WHEN NEW."company_id" IS NOT NULL AND NOT EXISTS(SELECT 1 FROM "company" WHERE id=NEW."company_id") BEGIN SELECT RAISE(ABORT,'Referência pertence a outro restaurante ou não existe'); END;
CREATE TRIGGER IF NOT EXISTS order_customer_insert AFTER INSERT ON "order" BEGIN UPDATE customer SET total_orders=(SELECT COUNT(*) FROM "order" WHERE customer_id=NEW.customer_id AND status<>'cancelado'),total_spent=COALESCE((SELECT SUM(total) FROM "order" WHERE customer_id=NEW.customer_id AND status='entregue'),0),last_order_at=(SELECT MAX(created_at) FROM "order" WHERE customer_id=NEW.customer_id) WHERE id=NEW.customer_id; END;
CREATE TRIGGER IF NOT EXISTS order_customer_update AFTER UPDATE ON "order" BEGIN UPDATE customer SET total_orders=(SELECT COUNT(*) FROM "order" WHERE customer_id=NEW.customer_id AND status<>'cancelado'),total_spent=COALESCE((SELECT SUM(total) FROM "order" WHERE customer_id=NEW.customer_id AND status='entregue'),0),last_order_at=(SELECT MAX(created_at) FROM "order" WHERE customer_id=NEW.customer_id) WHERE id=NEW.customer_id; END;
CREATE TRIGGER IF NOT EXISTS foodcontrol_schema_v1 AFTER INSERT ON app_config BEGIN SELECT 1; END;
