import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { serialize } from './serialize';
import { deserialize } from './deserialize';
import { itemsKey, itemsByViewsKey, itemsByPriceKey, itemsByEndingAtKey } from '$services/keys';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if (Object.keys(item).length === 0) {
		return null;
	}

	return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
	const commands = ids.map((id) => {
		return client.hGetAll(itemsKey(id));
	});

	const results = await Promise.all(commands);

	return results.map((item, idx) => {
		if (Object.keys(item).length === 0) {
			return null;
		}

		return deserialize(ids[idx], item);
	});
};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();

	await Promise.all([
		client.hSet(itemsKey(id), serialize(attrs)),
		client.zAdd(itemsByViewsKey(), { value: id, score: 0 }),
		client.zAdd(itemsByEndingAtKey(), {
			value: id,
			score: attrs.endingAt?.toMillis()
		}),
		client.zAdd(itemsByPriceKey(), {
			value: id,
			score: 0
		})
	]);

	return id;
};
