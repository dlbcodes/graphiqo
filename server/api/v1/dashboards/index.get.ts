import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	// 1. Ensure the user is logged in via Supabase
	const user = await requireAuthUser(event);

	// 2. Fetch all dashboards for this profile
	const dashboards = await prisma.dashboard.findMany({
		where: { profileId: user.id },
		include: {
			charts: {
				include: {
					brandProfile: true, // Show which client brand this chart uses
				},
				orderBy: { createdAt: 'asc' },
			},
		},
		orderBy: { updatedAt: 'desc' },
	});

	// 3. Transformation (if needed)
	// Unlike the Page API, we don't have many messy files to map yet.
	// If you add a logoUrl to brandProfile, you'd map the URL here.
	const formattedDashboards = dashboards.map((db) => ({
		...db,
		chartCount: db.charts.length,
		// Optional: logic to add a "lastEditedAt" based on the newest chart
	}));

	return formattedDashboards;
});