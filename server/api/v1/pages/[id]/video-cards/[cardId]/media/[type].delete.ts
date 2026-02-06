import { defineEventHandler, getRouterParam, createError } from 'h3';
import { requireAuthUser } from "~~/server/utils/auth";
import { deleteS3File } from "~~/server/utils/s3";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const pageId = getRouterParam(event, 'id');
	const cardId = getRouterParam(event, 'cardId');
	const type = getRouterParam(event, 'type'); // 'video', 'image', or 'thumbnail'

	if (!pageId || !cardId || !type) {
		throw createError({
			statusCode: 400,
			message: "Page ID, Card ID, and Type are required",
		});
	}

	if (!['video', 'image', 'thumbnail'].includes(type)) {
		throw createError({
			statusCode: 400,
			message: "Type must be 'video', 'image', or 'thumbnail'",
		});
	}

	try {
		// Verify ownership and get current file
		const card = await prisma.videoCard.findFirst({
			where: {
				id: cardId,
				pageId: pageId,
				page: {
					profileId: user.id,
				},
			},
			select: {
				videoFile: true,
				imageFile: true,
				thumbnailFile: true,
			},
		});

		if (!card) {
			throw createError({
				statusCode: 404,
				message: "Video card not found or access denied",
			});
		}

		// Get the file to delete
		let fileName: string | null = null;
		let folder = '';
		let fieldName = '';

		switch (type) {
			case 'video':
				fileName = card.videoFile;
				folder = 'videos';
				fieldName = 'videoFile';
				break;
			case 'image':
				fileName = card.imageFile;
				folder = 'images';
				fieldName = 'imageFile';
				break;
			case 'thumbnail':
				fileName = card.thumbnailFile;
				folder = 'thumbnails';
				fieldName = 'thumbnailFile';
				break;
		}

		if (!fileName) {
			throw createError({
				statusCode: 404,
				message: `No ${type} to delete`,
			});
		}

		// Delete from S3
		const s3Key = `${user.id}/pages/${pageId}/${folder}/${fileName}`;
		await deleteS3File(s3Key);
		console.log(`🗑️ Deleted ${type} from S3:`, s3Key);

		// Clear from database
		await prisma.videoCard.update({
			where: { id: cardId },
			data: { [fieldName]: null },
		});

		console.log(`✅ Video card ${type} deleted`);

		return {
			success: true,
			message: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
		};
	} catch (error) {
		console.error(`❌ Failed to delete ${type}:`, error);

		if (error.statusCode) {
			throw error;
		}

		throw createError({
			statusCode: 500,
			message: `Failed to delete ${type}`,
		});
	}
});