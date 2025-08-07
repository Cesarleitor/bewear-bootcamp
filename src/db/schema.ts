import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
} from "drizzle-orm/pg-core";

export const userTable = pgTable("user_table", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const sessionTable = pgTable("session_table", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("account_table", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const categoryTable = pgTable("category", {
  id: uuid().primaryKey().defaultRandom(), // ID da categoria
  name: text().notNull(), // nome da categoria
  slug: text().notNull().unique(), // slug da categoria, ex: "eletronicos"
  createdAt: timestamp("created_at").notNull().defaultNow(), // data de criação
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  products: many(productTable), // relação com produtos
}));

export const productTable = pgTable("product", {
  id: uuid().primaryKey().defaultRandom(), // ID do produto
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.id, {onDelete: "set null" }), // referência à categoria
  name: text().notNull(), // nome do produto
  slug: text().notNull().unique(), // slug do produto, ex: "iphone-14"
  description: text().notNull(), // descrição do produto
  createdAt: timestamp("created_at").notNull().defaultNow(), // data de criação
});

export const productRelations = relations(productTable, ({ one, many }) => ({
  category: one(categoryTable, {
    fields: [productTable.categoryId],
    references: [categoryTable.id],
  }),
  variants: many(productVariantTable),
}));

export const productVariantTable = pgTable("product_variant", {
  id: uuid().primaryKey().defaultRandom(), // ID da variante
  productId: uuid("product_id")
    .notNull()
    .references(() => productTable.id, {onDelete: "cascade"}), // referência ao produto
  name: text().notNull(), // nome da variante, ex: "Tamanho M"
  slug: text().notNull().unique(), // slug da variante, ex: "tamanho-m"
  color: text().notNull(), // para buscar itens por cor
  priceInCents: integer("price_in_cents").notNull(), // preço em centavos
  imageUrl: text("image_url").notNull(), // URL da imagem da variante
  createdAt: timestamp("created_at").notNull().defaultNow(), // data de criação
});

export const productVariantRelations = relations(
  productVariantTable,
  ({ one }) => ({
    product: one(productTable, {
      fields: [productVariantTable.productId],
      references: [productTable.id],
    }),
  }),
);
