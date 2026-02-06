// server/api/pages/[pageId]/links/reorder.post.ts

import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";

interface LinkOrder {
	id: string;
	order: number;
}

interface ReorderBody {
	linkOrders: LinkOrder[];
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

	if (!body.linkOrders || !Array.isArray(body.linkOrders)) {
		throw createError({
			statusCode: 400,
			message: 'Invalid request body'
		});
	}

	// 5. Validate all links belong to this page
	const linkIds = body.linkOrders.map(lo => lo.id);

	const existingLinks = await prisma.pageLink.findMany({
		where: {
			id: { in: linkIds },
			pageId: pageId
		},
		select: { id: true }
	});

	if (existingLinks.length !== linkIds.length) {
		throw createError({
			statusCode: 400,
			message: 'Some links do not belong to this page'
		});
	}

	// 6. Update all orders in a single transaction
	try {
		await prisma.$transaction(
			body.linkOrders.map(({ id, order }) =>
				prisma.pageLink.update({
					where: { id },
					data: { order }
				})
			)
		);

		return {
			success: true,
			message: 'Link order updated successfully'
		};
	} catch (error) {
		console.error('Failed to update link orders:', error);

		throw createError({
			statusCode: 500,
			message: 'Failed to update link order'
		});
	}
});