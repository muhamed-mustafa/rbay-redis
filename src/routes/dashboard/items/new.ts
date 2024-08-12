import type { RequestHandler } from '@sveltejs/kit';
import { createItem } from '$services/queries/items/items';
import { DateTime } from 'luxon';

export const post: RequestHandler = async ({ request, locals }) => {
	
	const data = await request.json();
	console.log("data", data);
	console.log("3", locals.session.userId);

	const id = await createItem({ ...data, endingAt: DateTime.now().plus({ minutes: 10 }) }, locals.session.userId);

	return {
		status: 200,
		body: {
			id
		}
	};
};
