import { schema } from './schema.js';
import { quotes, lineItemDates, lineItems } from '$lib/server/db/schema.js';
import { transformErrors } from '$lib/errors.js';
import { eq, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export async function load({ locals: { db } }) {
	const t0 = performance.now();
	const quotes = await db.query.quotes.findMany();
	const t1 = performance.now();
	console.log(`Quotes List took ${t1 - t0} milliseconds.`);
	return { quotes };
}

export const actions = {
	create: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = schema.safeParse(formData);

		if (form.success) {
			await db.insert(quotes).values({ name: form.data.name });
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	update: async ({ locals: { db }, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const form = schema.safeParse(formData);

		if (form.success) {
			await db.update(quotes).set({ name: form.data.name }).where(eq(quotes.id, form.data.id));
		} else {
			return fail(422, { error: true, errors: transformErrors(form.error.errors) });
		}
	},

	delete: async ({ locals: { db }, request }) => {
		const data = await request.formData();
		const quoteId = data.get('id');
		await db.transaction(async (tx) => {
			const query = db
				.select({ data: lineItemDates.id })
				.from(lineItemDates)
				.where(eq(lineItemDates.quoteId, quoteId));
			await tx.delete(lineItems).where(inArray(lineItems.lineItemDateId, query));
			await tx.delete(lineItemDates).where(eq(lineItemDates.quoteId, quoteId));
			await tx.delete(quotes).where(eq(quotes.id, quoteId));
		});
	}
};
