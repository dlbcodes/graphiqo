import { updatePageSchema } from "~/types/page";


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

	const validatedData = updatePageSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	// Check ownership
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

	// If slug is being updated, check uniqueness
	if (validatedData.data.slug && validatedData.data.slug !== page.slug) {
		const existingPage = await prisma.page.findUnique({
			where: { slug: validatedData.data.slug },
		});

		if (existingPage) {
			throw createError({
				statusCode: 409,
				statusMessage: "Slug already taken.",
			});
		}
	}

	const updatedPage = await prisma.page.update({
		where: { id: pageId },
		data: {
			...validatedData.data,
			updatedAt: new Date(),
		},
		include: {
			videoCards: {
				include: {
					ctaLinks: {
						orderBy: { order: 'asc' },
					},
				},
				orderBy: { order: 'asc' },
			},
			socialLinks: {
				orderBy: { order: 'asc' },
			},
		},
	});

	return updatedPage;
});