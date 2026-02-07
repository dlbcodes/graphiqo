import type { BrandProfile } from "@prisma/client";

export class BrandApiError extends Error {
	constructor(message: string, public statusCode?: number, public originalError?: any) {
		super(message);
		this.name = "BrandApiError";
	}
}

export class BrandApiService {
	private readonly baseUrl: string = "/api/v1/brands";

	// ========================================
	// BRAND PROFILE METHODS
	// ========================================

	async getBrands() {
		try {
			return await $fetch<BrandProfile[]>(this.baseUrl);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch brand profiles");
		}
	}

	async getBrand(id: string) {
		try {
			return await $fetch<BrandProfile>(`${this.baseUrl}/${id}`);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch brand profile");
		}
	}

	async createBrand(data: Partial<BrandProfile>) {
		try {
			return await $fetch<BrandProfile>(this.baseUrl, {
				method: "POST",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to create brand profile");
		}
	}

	async updateBrand(id: string, data: Partial<BrandProfile>) {
		try {
			return await $fetch<BrandProfile>(`${this.baseUrl}/${id}`, {
				method: "PATCH",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to update brand profile");
		}
	}

	async deleteBrand(id: string) {
		try {
			return await $fetch(`${this.baseUrl}/${id}`, {
				method: "DELETE",
			});
		} catch (error) {
			throw this._handleError(error, "Failed to delete brand profile");
		}
	}

	// ========================================
	// PRIVATE HELPERS
	// ========================================

	private _handleError(error: any, fallback: string): BrandApiError {
		const message = error?.data?.message || fallback;
		return new BrandApiError(message, error?.status, error);
	}
}

export const brandApi = new BrandApiService();