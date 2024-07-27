import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey } from '$services/keys';
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	await client.hSet(usersKey(id), serialize(attrs));

	return id;
};

const serialize = (attrs: CreateUserAttrs) => {
	return {
		username: attrs.username,
		password: attrs.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	console.log('1', {
		id,
		username: user.username,
		password: user.password
	});

	return {
		id,
		username: user.username,
		password: user.password
	};
};
