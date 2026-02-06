import { z } from "zod";

// Zod Schemas
export const createPageSchema = z.object({
	slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
	title: z.string().min(1).max(100),
	bio: z.string().max(500).optional(),
	avatar: z.string().url().optional(),
	theme: z.enum(["dark", "light"]).default("dark"),
	primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).default("#4f39f6"),
	metaTitle: z.string().max(60).optional(),
	metaDescription: z.string().max(160).optional(),
	googleAnalyticsId: z.string().optional(),
	facebookPixelId: z.string().optional(),
	isNsfw: z.boolean().optional(),
	isPublished: z.boolean().optional()
});

export const updatePageSchema = createPageSchema.partial();

export const createVideoCardSchema = z.object({
	title: z.string().min(1).max(200).optional(),
	description: z.string().max(1000).optional(),
	order: z.number().int().min(0).default(0),
	isActive: z.boolean().optional(),
	isNsfw: z.boolean().optional(),
	// No URL fields needed - files are uploaded separately
});

export const updateVideoCardSchema = createVideoCardSchema.partial();

export const createCtaLinkSchema = z.object({
	title: z.string().min(1).max(100),
	url: z.string().url(),
	icon: z.string().max(50).optional(),
	order: z.number().int().min(0).default(0),
});

export const updateCtaLinkSchema = createCtaLinkSchema.partial();

export const createSocialLinkSchema = z.object({
	platform: z.string().min(1).max(50),
	url: z.string().url(),
	order: z.number().int().min(0).default(0),
});

export const updateSocialLinkSchema = createSocialLinkSchema.partial();

export const thumbnailTypeEnum = z.enum(['NONE', 'FAVICON', 'CUSTOM']);

export type ThumbnailTypeValue = z.infer<typeof thumbnailTypeEnum>;

export const THUMBNAIL_TYPE = {
	NONE: 'NONE',
	FAVICON: 'FAVICON',
	CUSTOM: 'CUSTOM',
} as const;



export const createPageLinkSchema = z.object({
	title: z.string().min(1).max(100),
	url: z.string().url(),
	icon: z.string().max(50).optional(),
	isActive: z.boolean().optional(),
	isNsfw: z.boolean().optional(),
	order: z.number().int().min(0).default(0),
	scheduledStartAt: z.preprocess(
		(val) => val === '' || val === undefined ? null : val,
		z.union([z.string().datetime(), z.null()])
	).optional(),
	scheduledEndAt: z.preprocess(
		(val) => val === '' || val === undefined ? null : val,
		z.union([z.string().datetime(), z.null()])
	).optional(),
	thumbnailType: thumbnailTypeEnum.optional(),
	thumbnail: z.string().optional().nullable(),
});

export const updatePageLinkSchema = createPageLinkSchema.partial();

// TypeScript Types
export type CreatePageDto = z.infer<typeof createPageSchema>;
export type UpdatePageDto = z.infer<typeof updatePageSchema>;
export type CreateVideoCardDto = z.infer<typeof createVideoCardSchema>;
export type UpdateVideoCardDto = z.infer<typeof updateVideoCardSchema>;
export type CreateCtaLinkDto = z.infer<typeof createCtaLinkSchema>;
export type UpdateCtaLinkDto = z.infer<typeof updateCtaLinkSchema>;
export type CreateSocialLinkDto = z.infer<typeof createSocialLinkSchema>;
export type UpdateSocialLinkDto = z.infer<typeof updateSocialLinkSchema>;
export type CreatePageLinkDto = z.infer<typeof createPageLinkSchema>;
export type UpdatePageLinkDto = z.infer<typeof updatePageLinkSchema>;

export interface Page {
	id: string;
	slug: string;
	profileId: string;
	title: string;
	bio?: string | null;
	avatar?: string | null;
	avatarUrl?: string | null;
	theme: string;
	primaryColor: string;
	metaTitle?: string | null;
	metaDescription?: string | null;
	googleAnalyticsId?: string | null;
	facebookPixelId?: string | null;
	isNsfw: boolean;
	isPublished: boolean;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
	videoCards?: VideoCard[];
	socialLinks?: SocialLink[];
	pageLinks?: PageLink[]
}

export interface VideoCard {
	id: string;
	pageId: string;

	// Computed URLs (from API)
	videoUrl?: string | null;
	imageUrl?: string | null;
	thumbnailUrl?: string | null;

	// Database fields (filenames only)
	videoFile?: string | null;
	imageFile?: string | null;
	thumbnailFile?: string | null;

	title?: string;
	description?: string | null;
	order: number;

	isActive: boolean;
	isNsfw?: boolean;

	viewCount: number;
	clickCount: number;
	createdAt: string;
	updatedAt: string;
	ctaLinks?: CtaLink[];
}

export interface CtaLink {
	id: string;
	videoCardId: string;
	title: string;
	url: string;
	icon?: string | null;
	order: number;
	isActive: boolean;
	clickCount: number;
	createdAt: string;
	updatedAt: string;
}

export enum ThumbnailType {
	NONE = 'NONE',
	FAVICON = 'FAVICON',
	CUSTOM = 'CUSTOM'
}

export interface PageLink {
	id: string;
	pageId: string;
	title: string;
	url: string;
	icon?: string | null;
	order: number;
	isActive: boolean;
	isNsfw?: boolean;
	scheduledStartAt?: Date | string | null;
	scheduledEndAt?: Date | string | null;
	thumbnailType: ThumbnailType;
	thumbnail?: string | null;
	thumbnailUrl?: string | null;
	clickCount: number;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface SocialLink {
	id: string;
	pageId: string;
	platform: string;
	url: string;
	order: number;
	isActive: boolean;
	clickCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface ApiResponse<T> {
	data?: T;
	message?: string;
	error?: string;
}





