import { client } from '$services/redis';
import { itemsIndexKey } from '$services/keys';
import { SchemaFieldTypes } from 'redis';

export const createIndexes = async () => {
	return (
		client.ft.create(itemsIndexKey(), {
			name: { type: SchemaFieldTypes.TEXT },
			description: { type: SchemaFieldTypes.TEXT }
		}),
		{
			ON: 'HASH',
			PREFIX: 'items#'
		}
	);
};
