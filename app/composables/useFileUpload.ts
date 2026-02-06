export interface UploadResult {
	fileName: string;
	publicUrl: string;
	fileSize: number;
	fileKey: string;
	cardId?: string;
	created?: boolean;
}

export type FileUploadType =
	| "avatar"
	| "cover"
	| "page-avatar"
	| "page-video"
	| "page-image"
	| "page-thumbnail"
	| "page-link-thumbnail";  // NEW

const FILE_CONFIGS = {
	avatar: {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSizeMB: 5,
	},
	cover: {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSizeMB: 10,
	},
	"page-avatar": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSizeMB: 5,
	},
	"page-video": {
		allowedTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
		maxSizeMB: 100,
	},
	"page-image": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
		maxSizeMB: 10,
	},
	"page-thumbnail": {
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
		maxSizeMB: 5,
	},
	"page-link-thumbnail": {  // NEW
		allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
		maxSizeMB: 5,
	},
} as const;

export const useFileUpload = () => {
	const uploading = ref(false);
	const uploadProgress = ref(0);
	const currentUploadType = ref<FileUploadType | null>(null);

	const validateFile = (file: File, type: FileUploadType): void => {
		const config = FILE_CONFIGS[type];

		if (!config.allowedTypes.includes(file.type)) {
			throw new Error(
				`Invalid file type. Allowed types: ${config.allowedTypes.join(", ")}`
			);
		}

		if (file.size > config.maxSizeMB * 1024 * 1024) {
			throw new Error(`File too large. Maximum size is ${config.maxSizeMB}MB`);
		}
	};

	const uploadFile = async (
		file: File,
		type: FileUploadType,
		context?: {
			pageId?: string;
			cardId?: string;
			linkId?: string;  // NEW: for page-link-thumbnail
		}
	): Promise<UploadResult> => {
		if (!file) {
			throw new Error("No file provided");
		}

		validateFile(file, type);

		// Validate context
		if (type.startsWith("page-") && !context?.pageId) {
			throw new Error("pageId is required for page-related uploads");
		}

		if (type === "page-link-thumbnail" && !context?.linkId) {
			throw new Error("linkId is required for page-link-thumbnail uploads");
		}

		uploading.value = true;
		uploadProgress.value = 0;
		currentUploadType.value = type;

		try {
			// Step 1: Get presigned URL
			const { data } = await $fetch("/api/v1/upload/presigned-url", {
				method: "POST",
				body: {
					type,
					contentType: file.type,
					fileSize: file.size,
					pageId: context?.pageId,
					linkId: context?.linkId,  // NEW
				},
			});

			if (!data.presignedUrl) {
				throw new Error("Failed to get upload URL");
			}

			uploadProgress.value = 10;

			// Step 2: Upload to S3
			await new Promise<void>((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				xhr.upload.addEventListener("progress", (e) => {
					if (e.lengthComputable) {
						const percentComplete = 10 + (e.loaded / e.total) * 70;
						uploadProgress.value = Math.round(percentComplete);
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status === 200) {
						uploadProgress.value = 80;
						resolve();
					} else {
						reject(new Error(`Upload failed: ${xhr.statusText}`));
					}
				});

				xhr.addEventListener("error", () => reject(new Error("Upload failed")));
				xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

				xhr.open("PUT", data.presignedUrl);
				xhr.setRequestHeader("Content-Type", file.type);
				xhr.send(file);
			});

			uploadProgress.value = 85;

			// Step 3: Confirm upload
			const confirmResponse = await $fetch("/api/v1/upload/confirm", {
				method: "POST",
				body: {
					type,
					fileName: data.fileName,
					pageId: context?.pageId,
					cardId: context?.cardId,
					linkId: context?.linkId,  // NEW
				},
			});

			uploadProgress.value = 100;

			return {
				fileName: data.fileName,
				publicUrl: data.publicUrl,
				fileSize: file.size,
				fileKey: data.fileKey,
				cardId: confirmResponse.data?.cardId,
				created: confirmResponse.data?.created,
			};
		} catch (error) {
			console.error("Upload failed:", error);
			throw error;
		} finally {
			uploading.value = false;
			uploadProgress.value = 0;
			currentUploadType.value = null;
		}
	};

	return {
		uploading: readonly(uploading),
		uploadProgress: readonly(uploadProgress),
		currentUploadType: readonly(currentUploadType),
		uploadFile,
	};
};