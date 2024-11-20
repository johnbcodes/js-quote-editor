import {
	createValidator as lidCreateValidator,
	updateValidator as lidUpdateValidator
} from './lineItemDateValidator.js';
import {
	createValidator as liCreateValidator,
	updateValidator as liUpdateValidator
} from './lineItemValidator.js';
import { quotes, lineItemDates, lineItems } from '$lib/server/db/schema.js';
import { transformErrors } from '$lib/errors.js';
import { sql } from 'drizzle-orm';
import { eq } from 'drizzle-orm/expressions';
import { fail } from '@sveltejs/kit';

export async function load({ params, locals: { db } }) {
	// Possible to do in one query in pure SQL, but doesn't seem to be currently possible with Drizzle Query or Select APIs
	const quote = await db.query.quotes.findFirst({
		where: eq(quotes.id, params.id),
		with: {
			lineItemDates: {
				with: {
					lineItems: true
				}
			}
		}
	});
	const sum = await db
		.select({ value: sql`coalesce(sum(${lineItems.unitPrice}), 0)`.mapWith(lineItems.unitPrice) })
		.from(lineItems)
		.innerJoin(lineItemDates, eq(lineItems.lineItemDateId, lineItemDates.id))
		.where(eq(lineItemDates.quoteId, params.id));
	const total = sum[0].value;

	return { quote, total };
}

export const actions = {
	createDate: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = lidCreateValidator.safeParse(formData);

		if (form.success) {
			await db
				.insert(lineItemDates)
				.values({ quoteId: form.data.quoteId, date: form.data.date.toISOString() });
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	updateDate: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = lidUpdateValidator.safeParse(formData);

		if (form.success) {
			await db
				.update(lineItemDates)
				.set({ date: form.data.date.toISOString() })
				.where(eq(lineItemDates.id, form.data.id));
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	deleteDate: async ({ locals: { db }, request }) => {
		const data = await request.formData();
		const lineItemDateId = data.get('id');
		await db.transaction(async (tx) => {
			await tx.delete(lineItems).where(eq(lineItems.lineItemDateId, lineItemDateId));
			await tx.delete(lineItemDates).where(eq(lineItemDates.id, lineItemDateId));
		});
	},

	createItem: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = liCreateValidator.safeParse(formData);

		if (form.success) {
			await db.insert(lineItems).values({
				lineItemDateId: form.data.lineItemDateId,
				name: form.data.name,
				description: form.data.description,
				quantity: form.data.quantity,
				unitPrice: form.data.unitPrice
			});
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	updateItem: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = liUpdateValidator.safeParse(formData);

		if (form.success) {
			await db
				.update(lineItems)
				.set({
					name: form.data.name,
					description: form.data.description,
					quantity: form.data.quantity,
					unitPrice: form.data.unitPrice
				})
				.where(eq(lineItems.id, form.data.id));
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	deleteItem: async ({ locals: { db }, request }) => {
		const data = await request.formData();
		await db.delete(lineItems).where(eq(lineItems.id, data.get('id')));
	}
};
