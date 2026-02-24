import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);

	if (!body.title) {
		throw createError({ statusCode: 400, message: "Title is required" });
	}

	const result = await prisma.$transaction(async (tx) => {
		const dashboard = await tx.dashboard.create({
			data: {
				title: body.title,
				profileId: user.id,
				slug: nanoid(10),
				isPublic: false,
			},
		});

		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		// NEW STRUCTURE: { columns: {}, rows: [] }
		const initialRawData = {
			columns: {
				val1: "Revenue",
				val2: "Expenses"
			},
			rows: months.map((month, index) => ({
				label: month,
				val1: Math.floor(Math.random() * 40) + 50 + index * 2,
				val2: Math.floor(Math.random() * 30) + 40 + index * 3
			}))
		};

		await tx.chart.create({
			data: {
				dashboardId: dashboard.id,
				name: "Monthly Performance",
				type: "bar",
				rawData: initialRawData, // Saving the object instead of the array
				config: {
					theme: "default",
					showLegend: true,
					smooth: true,
					showGrid: true
				}
			}
		});

		return dashboard;
	});

	return result;
});