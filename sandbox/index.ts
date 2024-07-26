import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
	const type = await client.type('car');

	if (type !== 'none' && type !== 'hash') {        
		await client.del('car');
	}

	await client.hSet('car', { color: 'red', year: 2024 });

	const car = await client.hGetAll('car');

	console.log('car', car);
};
run();
