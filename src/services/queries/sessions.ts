import type { Session } from '$services/types';
import { sessionsKey } from '$services/keys';
import { client } from '$services/redis';

export const getSession = async (id: string) => {
	console.log("client",client);
	
	const session = await client.hGetAll(sessionsKey(id));

	if (Object.keys(session).length === 0) return null;

	return deserialize(id, session);
};

export const saveSession = async (session: Session) => {
	await client.hSet(sessionsKey(session.id), serialize(session));
};

const serialize = ({ userId, username }: Session) => {
	return {
		userId: userId || '',
		username: username
	};
};

const deserialize = (id: string, session: { [key: string]: string }) => {
	return { id, userId: session.userId, username: session.username };
};
