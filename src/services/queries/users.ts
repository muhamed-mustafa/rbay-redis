import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey, usernamesUniqueKey } from '$services/keys';
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	const usernameIsExists = await client.sIsMember(usernamesUniqueKey(), attrs.username);

	if (usernameIsExists) throw new Error('Username already exists');

	await client.sAdd(usernamesUniqueKey(), attrs.username);

	await client.hSet(usersKey(id), serialize(attrs));

	return id;
};

const serialize = ({ username, password }: CreateUserAttrs) => {
	return { username, password };
};

// const deserialize = (id: string, user: { [key: string]: string }) => {
// 	return {
// 		id,
// 		username: user.username,
// 		password: user.password
// 	};
// };

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id,
		username: user.username,
		password: user.password
	};
};
