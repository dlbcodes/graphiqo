export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const cardId = getRouterParam(event, 'cardId');

	if (!pageId || !cardId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID and Card ID are required.",
		});
	}

	const videoCard = await prisma.videoCard.findFirst({
		where: {
			id: cardId,
			pageId,
			page: {
				profileId: user.id,
			},
		},
		include: {
			ctaLinks: {
				orderBy: { order: 'asc' },
			},
		},
	});

	if (!videoCard) {
		throw createError({
			statusCode: 404,
			statusMessage: "Video card not found.",
		});
	}

	return videoCard;
});
