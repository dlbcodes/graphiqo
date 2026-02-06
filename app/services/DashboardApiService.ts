import type { Dashboard, Chart, BrandProfile } from "@prisma/client";

export class ApiError extends Error {
	// Remove 'public' from message to avoid the 'override' error
	constructor(message: string, public statusCode?: number, public originalError?: any) {
		super(message);
		this.name = "DashboardApiError";
	}
}

export class DashboardApiService {
	private readonly baseUrl: string = "/api/v1";

	// ========================================
	// DASHBOARD METHODS
	// ========================================

	async getDashboards() {
		try {
			return await $fetch<Dashboard[]>(`${this.baseUrl}/dashboards`);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch dashboards");
		}
	}

	async getDashboard(id: string) {
		try {
			return await $fetch<Dashboard & { charts: Chart[] }>(`${this.baseUrl}/dashboards/${id}`);
		} catch (error) {
			throw this._handleError(error, "Failed to fetch dashboard");
		}
	}

	async createDashboard(data: { title: string }) {
		try {
			return await $fetch<Dashboard>(`${this.baseUrl}/dashboards`, {
				method: "POST",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to create dashboard");
		}
	}

	// ========================================
	// CHART METHODS
	// ========================================

	async createChart(dashboardId: string, data: any) {
		try {
			return await $fetch<Chart>(`${this.baseUrl}/dashboards/${dashboardId}/charts`, {
				method: "POST",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to create chart");
		}
	}

	async updateChart(chartId: string, data: any) {
		try {
			return await $fetch<Chart>(`${this.baseUrl}/charts/${chartId}`, {
				method: "PATCH",
				body: data,
			});
		} catch (error) {
			throw this._handleError(error, "Failed to update chart");
		}
	}

	// ========================================
	// BRAND PROFILE METHODS
	// ========================================

	async getBrands() {
		return await $fetch<BrandProfile[]>(`${this.baseUrl}/brands`);
	}

	private _handleError(error: any, fallback: string): ApiError {
		const message = error?.data?.message || fallback;
		return new ApiError(message, error?.status);
	}
}

export const dashboardApi = new DashboardApiService();