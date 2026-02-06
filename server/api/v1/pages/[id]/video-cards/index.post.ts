import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { createVideoCardSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const body = await readBody(event);

	if (!pageId) {
		throw createError({
			statusCode: 400,
			statusMessage: "Page ID is required.",
		});
	}

	const validatedData = createVideoCardSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	const page = await prisma.page.findFirst({
		where: {
			id: pageId,
			profileId: user.id,
		},
	});

	if (!page) {
		throw createError({
			statusCode: 404,
			statusMessage: "Page not found.",
		});
	}

	// Create video card - no URL fields, those are uploaded separately
	const videoCard = await prisma.videoCard.create({
		data: {
			title: validatedData.data.title,
			description: validatedData.data.description,
			order: validatedData.data.order,
			pageId,
		},
		include: {
			ctaLinks: {
				orderBy: { order: 'asc' },
			},
		},
	});

	return videoCard;
});