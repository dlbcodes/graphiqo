import { updateVideoCardSchema } from "~/types/page";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const cardId = getRouterParam(event, 'cardId');
	const body = await readBody(event);

	if (!pageId || !cardId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID and Card ID are required.",
		});
	}

	const validatedData = updateVideoCardSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	// Check ownership through page
	const videoCard = await prisma.videoCard.findFirst({
		where: {
			id: cardId,
			pageId,
			page: {
				profileId: user.id,
			},
		},
	});

	if (!videoCard) {
		throw createError({
			statusCode: 404,
			statusMessage: "Video card not found.",
		});
	}

	const updatedCard = await prisma.videoCard.update({
		where: { id: cardId },
		data: {
			...validatedData.data,
			updatedAt: new Date(),
		},
		include: {
			ctaLinks: {
				orderBy: { order: 'asc' },
			},
		},
	});

	return updatedCard;
});