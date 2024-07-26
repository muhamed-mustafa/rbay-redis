import type { CreateItemAttrs } from '$services/types';

export const serialize = (attrs: CreateItemAttrs) => {
	console.log('attrs', attrs);
	return {
		...attrs,
		createdAt: attrs.createdAt.toMillis(),
		endingAt: attrs.createdAt.toMillis()
	};
};
