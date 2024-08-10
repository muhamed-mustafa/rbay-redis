import type { CreateItemAttrs } from '$services/types';
import { DateTime } from 'luxon';

export const serialize = (attrs: CreateItemAttrs) => {
	return {
		...attrs,
		createdAt: attrs.createdAt?.toMillis() || DateTime.now().toMillis(),
		endingAt: attrs.endingAt?.toMillis() || DateTime.now().toMillis()
	};
};
