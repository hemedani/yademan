/**
 * Hard cap on page size.
 *
 * `page` and `limit` are plain numbers in the validators, so without clamping a
 * client can request `limit: 1000000` and pull an entire collection (and its
 * relations) into memory in one request.
 */
export const MAX_PAGE_SIZE = 200;

export const clampPagination = (page: number, limit: number) => ({
	page: Math.max(1, Math.floor(page) || 1),
	limit: Math.min(Math.max(1, Math.floor(limit) || 1), MAX_PAGE_SIZE),
});
