import { prisma } from "~~/server/utils/prisma";
import { requireAuthUser } from "~~/server/utils/auth";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);

	return await prisma.brandProfile.findMany({
		where: { profileId: user.id },
		orderBy: { name: 'asc' },
	});
});