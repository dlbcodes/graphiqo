import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { defineEventHandler, readBody, createError } from "h3";
import { createPageSchema } from "~~/app/types/page";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	const validatedData = createPageSchema.safeParse(body);

	if (!validatedData.success) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid data.",
			data: validatedData.error.format(),
		});
	}

	// Check if slug already exists
	const existingPage = await prisma.page.findUnique({
		where: { slug: validatedData.data.slug },
	});

	if (existingPage) {
		throw createError({
			statusCode: 409,
			statusMessage: "Slug already taken.",
		});
	}

	const newPage = await prisma.page.create({
		data: {
			...validatedData.data,
			profileId: user.id,
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

	return newPage;
});