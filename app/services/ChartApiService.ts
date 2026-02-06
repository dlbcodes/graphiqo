import type { Chart } from "@prisma/client";

export class ChartApiService {
	private readonly baseUrl: string = "/api/v1/charts";

	async createChart(dashboardId: string, data: { name: string, type: string }) {
		return await $fetch<Chart>(this.baseUrl, {
			method: "POST",
			body: { dashboardId, ...data },
		});
	}

	async updateChart(chartId: string, data: { rawData?: any, config?: any, name?: string, type?: string }) {
		return await $fetch<Chart>(`${this.baseUrl}/${chartId}`, {
			method: "PATCH",
			body: data,
		});
	}

	async deleteChart(chartId: string) {
		return await $fetch(`${this.baseUrl}/${chartId}`, {
			method: "DELETE",
		});
	}
}

export const chartApi = new ChartApiService();