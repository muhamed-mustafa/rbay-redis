import { client } from '$services/redis';
import { itemsIndexKey } from '$services/keys';
import { SchemaFieldTypes } from 'redis';

export const createIndexes = async () => {
	const indexs = await client.ft._list();
	const exists = indexs.find((index) => index === itemsIndexKey());

	if (exists) return;

	return (
		client.ft.create(itemsIndexKey(), {
			name: { type: SchemaFieldTypes.TEXT, SORTABLE: true },
			description: { type: SchemaFieldTypes.TEXT, SORTABLE: false },
			ownerId: { type: SchemaFieldTypes.TAG, SORTABLE: false },
			endingAt: { type: SchemaFieldTypes.NUMERIC, SORTABLE: true },
			bids: { type: SchemaFieldTypes.NUMERIC, SORTABLE: true },
			views: { type: SchemaFieldTypes.NUMERIC, SORTABLE: true },
			price: { type: SchemaFieldTypes.NUMERIC, SORTABLE: true }
		} as any),
		{
			ON: 'HASH',
			PREFIX: 'items#'
		}
	);
};
