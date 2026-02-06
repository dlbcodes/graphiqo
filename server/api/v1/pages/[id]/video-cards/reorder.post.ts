import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";

interface VideoCardOrder {
	id: string;
	order: number;
}

interface ReorderBody {
	cardOrders: VideoCardOrder[];
}

export default defineEventHandler(async (event) => {
	// 1. Get authenticated user
	const user = await requireAuthUser(event);

	// 2. Get pageId from route params
	const pageId = getRouterParam(event, 'id');

	if (!pageId) {
		throw createError({
			statusCode: 400,
			message: 'Page ID is required'
		});
	}

	// 3. Verify page ownership
	const page = await prisma.page.findFirst({
		where: {
			id: pageId,
			profileId: user.id,
		}
	});

	if (!page) {
		throw createError({
			statusCode: 404,
			message: 'Page not found or access denied'
		});
	}

	// 4. Get body and validate
	const body = await readBody<ReorderBody>(event);

	if (!body.cardOrders || !Array.isArray(body.cardOrders)) {
		throw createError({
			statusCode: 400,
			message: 'Invalid request body'
		});
	}

	// 5. Validate all video cards belong to this page
	const cardIds = body.cardOrders.map(co => co.id);

	const existingCards = await prisma.videoCard.findMany({
		where: {
			id: { in: cardIds },
			pageId: pageId
		},
		select: { id: true }
	});

	if (existingCards.length !== cardIds.length) {
		throw createError({
			statusCode: 400,
			message: 'Some video cards do not belong to this page'
		});
	}

	// 6. Update all orders in a single transaction
	try {
		await prisma.$transaction(
			body.cardOrders.map(({ id, order }) =>
				prisma.videoCard.update({
					where: { id },
					data: { order }
				})
			)
		);

		return {
			success: true,
			message: 'Video card order updated successfully'
		};
	} catch (error) {
		console.error('Failed to update video card orders:', error);

		throw createError({
			statusCode: 500,
			message: 'Failed to update video card order'
		});
	}
});