import { client } from '$services/redis';
import { deserialize } from './deserialize';
import { itemsIndexKey } from '$services/keys';
interface QueryOpts {
	page: number;
	perPage: number;
	sortBy: string;
	direction: string;
}

export const itemsByUser = async (userId: string, opts: QueryOpts) => {
	const query = `@ownerId:${userId}`;

	const sortCriteria = opts.sortBy &&
		opts.direction && {
			BY: opts.sortBy,
			direction: opts.direction
		};

	const { total, documents } = await client.ft.search(itemsIndexKey(), query, {
		ON: 'HASH',
		SORTBY: sortCriteria,
		LIMIT: {
			from: opts.page * opts.perPage,
			size: opts.perPage
		}
	} as any);

	return {
		totalPages: Math.ceil(total / opts.perPage),
		items: documents.map(({ id, value }) => deserialize(id.replace('items#', ''), value as any))
	};
};
