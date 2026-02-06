import type {
	Page,
	CreatePageDto,
	UpdatePageDto,
	CreateVideoCardDto,
	UpdateVideoCardDto,
	CreateCtaLinkDto,
	UpdateCtaLinkDto,
	CreateSocialLinkDto,
	UpdateSocialLinkDto,
	VideoCard,
	CtaLink,
	SocialLink,
	ApiResponse,
} from "~/types/page";

export class PageApiError extends Error {
	public readonly statusCode?: number;
	public readonly originalError?: any;

	constructor(message: string, statusCode?: number, originalError?: any) {
		super(message);
		this.name = "PageApiError";
		this.statusCode = statusCode;
		this.originalError = originalError;
	}
}

export class PageApiService {
	private readonly baseUrl: string;

	constructor(baseUrl: string = "/api/v1/pages") {
		this.baseUrl = baseUrl;
	}

	// ========================================
	// PAGE METHODS
	// ========================================

	async createPage(data: CreatePageDto): Promise<Page> {
		try {
			const response = await $fetch<Page>(`${this.baseUrl}`, {
				method: "POST",
				body: data,
			});
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to create page");
		}
	}

	async getPages(): Promise<Page[]> {
		try {
			const response = await $fetch<Page[]>(`${this.baseUrl}`);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch pages");
		}
	}

	async getPage(pageId: string): Promise<Page> {
		try {
			const response = await $fetch<Page>(`${this.baseUrl}/${pageId}`);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch page");
		}
	}

	async updatePage(pageId: string, data: UpdatePageDto): Promise<Page> {
		try {
			const response = await $fetch<Page>(`${this.baseUrl}/${pageId}`, {
				method: "PATCH",
				body: data,
			});
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to update page");
		}
	}

	async deleteAvatar(pageId: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${pageId}/avatar`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete avatar");
		}
	}

	async deletePage(pageId: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${pageId}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete page");
		}
	}

	// ========================================
	// VIDEO CARD METHODS
	// ========================================

	async createVideoCard(pageId: string, data: CreateVideoCardDto): Promise<VideoCard> {
		try {
			const response = await $fetch<VideoCard>(
				`${this.baseUrl}/${pageId}/video-cards`,
				{
					method: "POST",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to create video card");
		}
	}

	async getVideoCard(pageId: string, cardId: string): Promise<VideoCard> {
		try {
			const response = await $fetch<VideoCard>(
				`${this.baseUrl}/${pageId}/video-cards/${cardId}`
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to fetch video card");
		}
	}

	async updateVideoCard(
		pageId: string,
		cardId: string,
		data: UpdateVideoCardDto
	): Promise<VideoCard> {
		try {
			const response = await $fetch<VideoCard>(
				`${this.baseUrl}/${pageId}/video-cards/${cardId}`,
				{
					method: "PATCH",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to update video card");
		}
	}

	async reorderVideoCards(
		pageId: string,
		orders: { id: string; order: number }[]
	): Promise<void> {
		try {
			await $fetch(
				`${this.baseUrl}/${pageId}/video-cards/reorder`,
				{
					method: "POST",
					body: { cardOrders: orders },
				}
			);
		} catch (error) {
			throw this._handleError(error, "Failed to reorder video cards");
		}
	}

	async deleteVideoCard(pageId: string, cardId: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${pageId}/video-cards/${cardId}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete video card");
		}
	}

	// ========================================
	// CTA LINK METHODS
	// ========================================

	async createCtaLink(
		pageId: string,
		cardId: string,
		data: CreateCtaLinkDto
	): Promise<CtaLink> {
		try {
			const response = await $fetch<CtaLink>(
				`${this.baseUrl}/${pageId}/video-cards/${cardId}/cta-links`,
				{
					method: "POST",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to create CTA link");
		}
	}

	async updateCtaLink(
		pageId: string,
		cardId: string,
		linkId: string,
		data: UpdateCtaLinkDto
	): Promise<CtaLink> {
		try {
			const response = await $fetch<CtaLink>(
				`${this.baseUrl}/${pageId}/video-cards/${cardId}/cta-links/${linkId}`,
				{
					method: "PATCH",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to update CTA link");
		}
	}

	async deleteCtaLink(
		pageId: string,
		cardId: string,
		linkId: string
	): Promise<void> {
		try {
			await $fetch(
				`${this.baseUrl}/${pageId}/video-cards/${cardId}/cta-links/${linkId}`,
				{
					method: "DELETE",
				}
			);
		} catch (error) {
			throw this._handleError(error, "Failed to delete CTA link");
		}
	}

	// ========================================
	// PAGE LINK METHODS
	// ========================================

	async createPageLink(pageId: string, data: CreatePageLinkDto): Promise<PageLink> {
		try {
			const response = await $fetch<PageLink>(
				`${this.baseUrl}/${pageId}/page-links`,
				{
					method: "POST",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to create page link");
		}
	}

	async updatePageLink(
		pageId: string,
		linkId: string,
		data: UpdatePageLinkDto
	): Promise<PageLink> {
		try {
			const response = await $fetch<PageLink>(
				`${this.baseUrl}/${pageId}/page-links/${linkId}`,
				{
					method: "PATCH",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to update page link");
		}
	}

	async deletePageLink(pageId: string, linkId: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${pageId}/page-links/${linkId}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete page link");
		}
	}


	// ========================================
	// SOCIAL LINK METHODS (similar pattern)
	// ========================================

	async createSocialLink(pageId: string, data: CreateSocialLinkDto): Promise<SocialLink> {
		try {
			const response = await $fetch<SocialLink>(
				`${this.baseUrl}/${pageId}/social-links`,
				{
					method: "POST",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to create social link");
		}
	}


	async updateSocialLink(
		pageId: string,
		linkId: string,
		data: UpdateSocialLinkDto
	): Promise<SocialLink> {
		try {
			const response = await $fetch<SocialLink>(
				`${this.baseUrl}/${pageId}/social-links/${linkId}`,
				{
					method: "PATCH",
					body: data,
				}
			);
			return response;
		} catch (error) {
			throw this._handleError(error, "Failed to update social link");
		}
	}


	async deleteSocialLink(pageId: string, linkId: string): Promise<void> {
		try {
			await $fetch(`${this.baseUrl}/${pageId}/social-links/${linkId}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete social link");
		}
	}



	// ========================================
	// PRIVATE HELPERS
	// ========================================

	private _handleError(error: any, fallbackMessage: string): PageApiError {
		const message = error?.data?.message || error?.message || fallbackMessage;
		const statusCode = error?.status || error?.statusCode;

		console.error("PageApiService Error:", {
			message,
			statusCode,
			originalError: error,
		});

		return new PageApiError(message, statusCode, error);
	}
}

export const pageApiService = new PageApiService();