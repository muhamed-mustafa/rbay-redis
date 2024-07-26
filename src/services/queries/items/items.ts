import type { CreateItemAttrs } from '$services/types';
import { itemsKey } from '$services/keys';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { serialize } from './serialize';
import { deserialize } from './deserialize';

export const getItem = async (id: string) => {
	const item = await client.hGetAll(itemsKey(id));

	if(!Object.keys(item).length) return null;

	return deserialize(id, item)
};

export const getItems = async (ids: string[]) => {};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();

	const serialized = serialize(attrs);

	await client.hSet(itemsKey(id), serialized);

	return id;
};
