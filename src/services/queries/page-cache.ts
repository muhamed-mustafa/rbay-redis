import { client } from '$services/redis';

const cachedRoutes = ['/auth/signin', '/auth/signup', '/about', '/privacy'];

export const getCachedPage = (route: string) => {
	if (cachedRoutes.includes(route)) {
		return client.get(`pagecache#${route}`);
	}

	return null;
};

export const setCachedPage = (route: string, page: string) => {
	if (cachedRoutes.includes(route)) {
		return client.set(`pagecache#${route}`, page, { EX: 2 });
	}
};
