import type { CreateItemAttrs } from '$services/types';

export const serialize = (attrs: CreateItemAttrs) => {
	console.log('serialize', attrs);

	return {
		...attrs,
		createdAt: attrs.createdAt?.toMillis() || new Date().getSeconds(),
		endingAt: attrs.endingAt?.toMillis() || new Date().getSeconds()
	};
};
