import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	const carKeys = ['car1', 'car2', 'car3'];

	for (const key of carKeys) {
		const type = await client.type(key);

		if (type !== 'none' && type !== 'hash') {
			await client.del(key);
		}
	}

	await client.hSet('car1', { color: 'red', year: 2024 });
	await client.hSet('car2', { color: 'blue', year: 2023 });
	await client.hSet('car3', { color: 'green', year: 2022 });

	const commands = [1, 2, 3].map(async (ele) => {
		return await client.hGetAll(`car${ele}`);
	});

	const res = await Promise.all(commands);
	console.log(res);
};
run();
