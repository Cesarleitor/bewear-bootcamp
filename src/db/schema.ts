import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(), // ID do usuário
  name: text().notNull(), // nome do usuário
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
    .references(() => categoryTable.id), // referência à categoria
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
    .references(() => productTable.id), // referência ao produto
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