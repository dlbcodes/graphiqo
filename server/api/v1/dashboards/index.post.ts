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
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		await tx.chart.create({
			data: {
				dashboardId: dashboard.id,
				name: "Monthly Performance",
				type: "bar",
				rawData: months.map((month, index) => ({
					label: month,
					// Simulating some realistic random data growth
					val1: Math.floor(Math.random() * 40) + 50 + index * 2,
					val2: Math.floor(Math.random() * 30) + 40 + index * 3
				})),
				config: {
					theme: "default",
					showLegend: true,
					smooth: true,
					// Useful for 12 points of data
					showGrid: true
				}
			}
		});

		return dashboard;
	});

	return result;
});