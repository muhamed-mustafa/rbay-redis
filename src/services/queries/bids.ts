import type { CreateBidAttrs, Bid } from '$services/types';
import { DateTime } from 'luxon';
import { bidHistoryKey, itemsKey, itemsByPriceKey } from '$services/keys';
import { client } from '$services/redis';
import { getItem } from './items';

export const createBid = async (attrs: CreateBidAttrs) => {
	return client.executeIsolated(async (isolatedClient) => {
		await isolatedClient.watch(itemsKey(attrs.itemId));

		const item = await getItem(attrs.itemId);

		if (!item) throw new Error('Item not found');

		if (item.price > attrs.amount) throw new Error('Bid amount too low');

		if (item.endingAt.diff(DateTime.now()).toMillis() < 0)
			throw new Error('Item has ended to bid on');

		const serialized = serializeHistory(attrs.amount, attrs.createdAt.toMillis());

		return isolatedClient
			.multi()
			.rPush(bidHistoryKey(attrs.itemId), serialized)
			.hSet(itemsKey(attrs.itemId), {
				bids: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			})
			.zAdd(itemsByPriceKey(), {
				value: attrs.itemId,
				score: attrs.amount
			})
			.exec();
	});
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 * offset;

	const range = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex);
	return range.map((bid) => deserializeHistory(bid));
};

const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':').map(Number);
	return { amount, createdAt: DateTime.fromMillis(createdAt) };
};
