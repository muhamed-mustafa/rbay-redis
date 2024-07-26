import type { Session } from '$services/types';
import { client } from '$services/redis';
import { sessionsKey } from '$services/keys';

export const getSession = async (id: string) => {
	const session = await client.hGetAll(sessionsKey(id));

	if (!Object.keys(session).length) return null;

	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
	await client.hSet(sessionsKey(session.id), serialize(session));
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return { id, userId: user.id, username: user.username };
};

const serialize = (session: Session) => {
	return {
		userId: session.userId,
		username: session.username
	};
};
