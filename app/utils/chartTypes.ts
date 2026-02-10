import {
	PhChartBar, PhChartLine, PhChartScatter, PhChartPie, PhChartDonut,
	PhTrendUp, PhGraph, PhHexagon, PhSquaresFour, PhFunnel, PhGauge
} from "@phosphor-icons/vue";

export interface ChartTypeOption {
	key: string;
	name: string;
	icon: Component;
	description: string;
}

export const CHART_TYPES: ChartTypeOption[] = [
	{
		key: 'bar',
		name: 'Bar Chart',
		icon: PhChartBar,
		description: 'Compare values across categories'
	},
	{
		key: 'line',
		name: 'Line Chart',
		icon: PhChartLine,
		description: 'Show trends over time'
	},
	{
		key: 'area',
		name: 'Area Chart',
		icon: PhTrendUp,
		description: 'Visualize volume over time'
	},
	{
		key: 'scatter',
		name: 'Scatter',
		icon: PhChartScatter,
		description: 'Show correlations between variables'
	},
	{
		key: 'step',
		name: 'Step Line',
		icon: PhGraph,
		description: 'Show data that changes at intervals'
	},
	{
		key: 'pie',
		name: 'Pie Chart',
		icon: PhChartPie,
		description: 'Show proportions of a whole'
	},
	{
		key: 'donut',
		name: 'Donut',
		icon: PhChartDonut,
		description: 'Proportions with a center hole'
	},
	{
		key: 'radar',
		name: 'Radar',
		icon: PhHexagon,
		description: 'Compare multivariate data (e.g. Skill sets)'
	},
	{
		key: 'heatmap',
		name: 'Heatmap',
		icon: PhSquaresFour,
		description: 'Visualize density or activity matrix'
	},
	{
		key: 'funnel',
		name: 'Funnel',
		icon: PhFunnel,
		description: 'Track conversion stages or pipelines'
	},
	{
		key: 'gauge',
		name: 'Gauge',
		icon: PhGauge,
		description: 'Show progress toward a specific target'
	}

];

export const getChartType = (key: string) => CHART_TYPES.find(t => t.key === key);