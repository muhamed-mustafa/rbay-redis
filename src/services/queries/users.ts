import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { usersKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
import { client } from '$services/redis';

export const getUserByUsername = async (username: string) => {
	const decimalId = await client.zScore(usernamesKey(), username);

	if (!decimalId) throw new Error('User not found');

	const id = decimalId.toString(16);

	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async ({ username, password }: CreateUserAttrs) => {
	const id = genId();

	const usernameIsExists = await client.sIsMember(usernamesUniqueKey(), username);

	if (usernameIsExists) throw new Error('Username already exists');

	await client.sAdd(usernamesUniqueKey(), username);

	await client.hSet(usersKey(id), serialize({ username, password }));

	await client.zAdd(usernamesKey(), { value: username, score: parseInt(id, 16) });

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
