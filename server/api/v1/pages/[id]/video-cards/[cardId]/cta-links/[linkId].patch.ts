import { updateCtaLinkSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const cardId = getRouterParam(event, 'cardId');
	const linkId = getRouterParam(event, 'linkId');
	const body = await readBody(event);

	if (!pageId || !cardId || !linkId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID, Card ID, and Link ID are required.",
		});
	}

	const validatedData = updateCtaLinkSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	// Check ownership
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

	const updatedLink = await prisma.ctaLink.update({
		where: { id: linkId },
		data: {
			...validatedData.data,
			updatedAt: new Date(),
		},
	});

	return updatedLink;
});