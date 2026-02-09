import { defineStore } from "pinia";
import { dashboardApi } from "@/services/DashboardApiService";
import { chartApi } from "@/services/ChartApiService";
import type { Dashboard, Chart } from "@prisma/client";
import { useToast } from "@/composables/useToast";

export const useDashboardStore = defineStore("dashboard", () => {
	const { addToast } = useToast();

	// STATE
	const dashboards = ref<Dashboard[]>([]);
	const currentDashboard = ref<(Dashboard & { charts: Chart[] }) | null>(null);
	const activeChartId = ref<string | null>(null); // Track which chart is being edited
	const loading = ref(false);

	// ACTIONS - DASHBOARDS
	async function fetchDashboards() {
		loading.value = true;
		try {
			dashboards.value = await dashboardApi.getDashboards();
		} finally {
			loading.value = false;
		}
	}

	async function fetchDashboard(id: string) {
		loading.value = true;
		try {
			const data = await dashboardApi.getDashboard(id);
			currentDashboard.value = data;

			// Pro Tip: If activeChartId is null OR the current activeChartId 
			// doesn't belong to this new dashboard, reset it to the first chart.
			const chartExists = data.charts.find(c => c.id === activeChartId.value);
			if (data.charts.length > 0 && !chartExists) {
				activeChartId.value = data.charts[0].id;
			}
		} finally {
			loading.value = false;
		}
	}

	async function createDashboard(title: string) {
		loading.value = true;
		try {
			const newDb = await dashboardApi.createDashboard({ title });
			dashboards.value.unshift(newDb);
			addToast("Dashboard created successfully!", { type: "success" });
			return newDb;
		} catch (err) {
			addToast("Failed to create dashboard", { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	// ACTIONS - CHARTS
	async function addChartToDashboard(dashboardId: string, type: string = 'bar') {
		try {
			const newChart = await chartApi.createChart(dashboardId, {
				name: "New Chart",
				type
			});

			if (currentDashboard.value?.id === dashboardId) {
				currentDashboard.value.charts.push(newChart);
				activeChartId.value = newChart.id; // Switch to the new chart automatically
			}
			addToast("Chart added!", { type: "success" });
			return newChart;
		} catch (err) {
			addToast("Failed to add chart", { type: "error" });
		}
	}

	async function updateChartData(chartId: string, payload: { rawData?: any, config?: any, name?: string, type?: string }) {
		if (!currentDashboard.value) return;

		const chartIndex = currentDashboard.value.charts.findIndex(c => c.id === chartId);

		if (chartIndex !== -1) {
			const updatedChart = {
				...currentDashboard.value.charts[chartIndex],
				...payload
			};
			currentDashboard.value.charts[chartIndex] = updatedChart as Chart;
		}

		try {
			await chartApi.updateChart(chartId, payload);
		} catch (err) {
			addToast("Sync error: Changes might not be saved", { type: "error" });
		}
	}

	async function removeChart(chartId: string) {
		try {
			await chartApi.deleteChart(chartId);
			if (currentDashboard.value) {
				currentDashboard.value.charts = currentDashboard.value.charts.filter(c => c.id !== chartId);
				// Reset active chart if we deleted the current one
				if (activeChartId.value === chartId) {
					activeChartId.value = currentDashboard.value.charts[0]?.id || null;
				}
			}
			addToast("Chart deleted", { type: "success" });
		} catch (err) {
			addToast("Failed to delete chart", { type: "error" });
		}
	}

	return {
		// State
		dashboards,
		currentDashboard,
		activeChartId,
		loading,

		// Actions
		fetchDashboards,
		fetchDashboard,
		createDashboard,
		addChartToDashboard,
		updateChartData,
		removeChart
	};
});