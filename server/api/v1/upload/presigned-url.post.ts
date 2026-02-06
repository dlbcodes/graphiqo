import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const FILE_CONFIGS = {
	avatar: {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSize: 5 * 1024 * 1024,
		pathTemplate: (userId: string) => `${userId}/avatar`,
	},
	cover: {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSize: 10 * 1024 * 1024,
		pathTemplate: (userId: string) => `${userId}/cover`,
	},
	"page-avatar": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
		maxSize: 10 * 1024 * 1024,
		pathTemplate: (userId: string, pageId?: string) =>
			`${userId}/pages/${pageId || 'temp'}/avatar`,
	},
	"page-video": {
		allowedTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
		maxSize: 100 * 1024 * 1024,
		pathTemplate: (userId: string, pageId?: string) =>
			`${userId}/pages/${pageId || 'temp'}/videos`,
	},
	"page-image": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
		maxSize: 10 * 1024 * 1024,
		pathTemplate: (userId: string, pageId?: string) =>
			`${userId}/pages/${pageId || 'temp'}/images`,
	},
	"page-thumbnail": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSize: 5 * 1024 * 1024,
		pathTemplate: (userId: string, pageId?: string) =>
			`${userId}/pages/${pageId || 'temp'}/thumbnails`,
	},
	"page-link-thumbnail": {  // NEW
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
		maxSize: 5 * 1024 * 1024,
		pathTemplate: (userId: string, pageId?: string, linkId?: string) =>
			`${userId}/pages/${pageId || 'temp'}/links/${linkId || 'temp'}/thumbnails`,
	},
} as const;

type FileType = keyof typeof FILE_CONFIGS;

export default defineEventHandler(async (event) => {
	const user = await requireAuthUser(event);
	const body = await readBody(event);
	const { type, contentType, fileSize, pageId, linkId } = body;

	// Validate file type
	if (!type || !(type in FILE_CONFIGS)) {
		throw createError({
			statusCode: 400,
			message: `Invalid type. Must be one of: ${Object.keys(FILE_CONFIGS).join(", ")}`,
		});
	}

	const config = FILE_CONFIGS[type as FileType];

	// Validate context
	if (type.startsWith("page-") && !pageId) {
		throw createError({
			statusCode: 400,
			message: "pageId is required for page-related uploads",
		});
	}

	if (type === "page-link-thumbnail" && !linkId) {
		throw createError({
			statusCode: 400,
			message: "linkId is required for page-link-thumbnail uploads",
		});
	}

	// Validate content type
	if (!contentType || !config.allowedTypes.includes(contentType)) {
		throw createError({
			statusCode: 400,
			message: `Invalid content type. Allowed types: ${config.allowedTypes.join(", ")}`,
		});
	}

	// Validate file size
	if (fileSize && fileSize > config.maxSize) {
		const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
		throw createError({
			statusCode: 400,
			message: `File too large. Maximum size is ${maxSizeMB}MB`,
		});
	}

	try {
		const s3 = getS3Client();

		// Generate unique filename
		const timestamp = Date.now();
		const randomId = Math.random().toString(36).substring(2, 15);
		const fileExtension = contentType.split("/")[1] || "bin";
		const fileName = `${timestamp}-${randomId}.${fileExtension}`;

		// Get path based on type
		const filePath = config.pathTemplate(user.id, pageId, linkId);
		const fileKey = `${filePath}/${fileName}`;

		// Create S3 command
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: fileKey,
			ContentType: contentType,
			CacheControl: "max-age=31536000",
			Metadata: {
				userId: user.id,
				uploadType: type,
				pageId: pageId || "",
				linkId: linkId || "",
				timestamp: timestamp.toString(),
			},
		});

		// Generate presigned URL
		const expiresIn = type.includes("video") ? 600 : 300;
		const presignedUrl = await getSignedUrl(s3, command, { expiresIn });

		// Public URL
		const publicUrl = `${process.env.CLOUDFRONT_URL}/${fileKey}`;

		return {
			success: true,
			data: {
				presignedUrl,
				fileKey,
				fileName,
				publicUrl,
				expiresIn,
				type,
				pageId,
				linkId,
			},
		};
	} catch (error) {
		console.error("Failed to generate presigned URL:", error);
		throw createError({
			statusCode: 500,
			message: "Failed to generate upload URL",
		});
	}
});