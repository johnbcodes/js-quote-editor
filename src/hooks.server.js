import { db } from '$lib/server/db';

export async function handle({ event, resolve }) {
	event.locals.db = db;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
}
