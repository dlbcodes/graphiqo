export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'pageId');
	const cardId = getRouterParam(event, 'cardId');
	const linkId = getRouterParam(event, 'linkId');

	if (!pageId || !cardId || !linkId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID, Card ID, and Link ID are required.",
		});
	}

	const ctaLink = await prisma.ctaLink.findFirst({
		where: {
			id: linkId,
			videoCardId: cardId,
			videoCard: {
				pageId,
				page: {
					profileId: user.id,
				},
			},
		},
	});

	if (!ctaLink) {
		throw createError({
			statusCode: 404,
			statusMessage: "CTA link not found.",
		});
	}

	await prisma.ctaLink.delete({
		where: { id: linkId },
	});

	return { message: "CTA link deleted successfully" };
});