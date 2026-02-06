import { defineEventHandler, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";
import { deleteS3File } from "~~/server/utils/s3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);

	try {
		// Get current avatar
		const profile = await prisma.profile.findUnique({
			where: { id: user.id },
			select: { avatar: true },
		});

		if (!profile?.avatar) {
			throw createError({
				statusCode: 404,
				message: "No avatar to delete",
			});
		}

		// Delete from S3
		const s3Key = `${user.id}/avatar/${profile.avatar}`;
		await deleteS3File(s3Key);
		console.log('🗑️ Deleted profile avatar from S3:', s3Key);

		// Clear from database
		await prisma.profile.update({
			where: { id: user.id },
			data: { avatar: null },
		});

		console.log('✅ Profile avatar deleted');

		return {
			success: true,
			message: "Avatar deleted successfully",
		};
	} catch (error) {
		console.error("❌ Failed to delete avatar:", error);

		if (error.statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			message: "Failed to delete avatar",
		});
	}
});