import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	if (!body.title) {
		throw createError({ statusCode: 400, message: "Title is required" });
	}

	// Use a transaction to create both at once
	const result = await prisma.$transaction(async (tx) => {
		// 1. Create the Dashboard
		const dashboard = await tx.dashboard.create({
			data: {
				title: body.title,
				profileId: user.id,
				slug: nanoid(10),
				isPublic: false,
			},
		});

		// 2. Create the Initial Chart linked to that dashboard
		await tx.chart.create({
			data: {
				dashboardId: dashboard.id,
				name: "First Chart",
				type: "bar",
				// Provide some starter data so the user isn't confused by a blank screen
				rawData: [
					{ label: "Example 1", value: 10 },
					{ label: "Example 2", value: 25 },
					{ label: "Example 3", value: 15 }
				],
				config: {
					theme: "default"
				}
			}
		});

		return dashboard;
	});

	return result;
});