import { pgTable, text, timestamp, date, integer, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ulid } from 'ulidx';

export const quotes = pgTable('quotes', {
	id: text('id')
		.primaryKey()
		.$default(() => ulid()),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }),
	updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const quotesRelations = relations(quotes, ({ many }) => ({
	lineItemDates: many(lineItemDates)
}));

export const lineItemDates = pgTable('line_item_dates', {
	id: text('id')
		.primaryKey()
		.$default(() => ulid()),
	quoteId: text('quote_id')
		.notNull()
		.references(() => quotes.id),
	date: date('date').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }),
	updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const lineItemDatesRelations = relations(lineItemDates, ({ one, many }) => ({
	quote: one(quotes, {
		fields: [lineItemDates.quoteId],
		references: [quotes.id]
	}),
	lineItems: many(lineItems)
}));

export const lineItems = pgTable('line_items', {
	id: text('id')
		.primaryKey()
		.$default(() => ulid()),
	lineItemDateId: text('line_item_date_id')
		.notNull()
		.references(() => lineItemDates.id),
	name: text('name').notNull(),
	description: text('description'),
	quantity: integer('quantity').notNull(),
	unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
	createdAt: timestamp('created_at', { withTimezone: true }),
	updatedAt: timestamp('updated_at', { withTimezone: true })
});

export const lineItemsRelations = relations(lineItems, ({ one }) => ({
	lineItemDate: one(lineItemDates, {
		fields: [lineItems.lineItemDateId],
		references: [lineItemDates.id]
	})
}));
