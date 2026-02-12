// utils/demo-presets.ts

// Shared mock data to make the charts look real
const mockSeriesData = [120, 200, 150, 80, 70, 110, 130];
const mockCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DEMO_CHART_DATA = {
	name: "Revenue Performance",
	config: {
		subtitle: "Weekly growth metrics",
		notes: "Includes seasonal adjustments for the current quarter.",
		source: "Financial Cloud API",
		darkMode: false,
	}
};

export const PRESETS = [
	{
		id: 'modern-dark',
		label: 'Modern Dark',
		icon: 'PhMoon',
		description: 'High-contrast neon for dashboards.',
		config: { darkMode: true },
		options: {
			backgroundColor: 'transparent',
			color: ['#6366f1'],
			grid: { top: 20, right: 20, bottom: 40, left: 40 },
			xAxis: {
				type: 'category',
				data: mockCategories,
				axisLine: { lineStyle: { color: '#444' } }
			},
			yAxis: {
				type: 'value',
				splitLine: { lineStyle: { color: '#222' } }
			},
			series: [{
				data: mockSeriesData,
				type: 'line',
				smooth: true,
				areaStyle: { opacity: 0.2, color: '#6366f1' },
				lineStyle: { width: 3 }
			}]
		}
	},
	{
		id: 'corporate-light',
		label: 'Professional',
		icon: 'PhBriefcase',
		description: 'Clean, minimal look for reports.',
		config: { darkMode: false },
		options: {
			backgroundColor: 'transparent',
			color: ['#1c1917'],
			grid: { top: 20, right: 20, bottom: 40, left: 40 },
			xAxis: {
				type: 'category',
				data: mockCategories,
				axisLine: { lineStyle: { color: '#e7e5e4' } }
			},
			yAxis: {
				type: 'value',
				splitLine: { lineStyle: { color: '#f5f5f4' } }
			},
			series: [{
				data: mockSeriesData,
				type: 'bar',
				barWidth: '60%',
				itemStyle: { borderRadius: [4, 4, 0, 0] }
			}]
		}
	},
	{
		id: 'accent-brand',
		label: 'Brand Indigo',
		icon: 'PhLightning',
		description: 'Vibrant colors to stand out.',
		config: { darkMode: false },
		options: {
			backgroundColor: 'transparent',
			color: ['#4f46e5'],
			grid: { top: 20, right: 20, bottom: 40, left: 40 },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: mockCategories
			},
			yAxis: { type: 'value' },
			series: [{
				data: [150, 230, 224, 218, 135, 147, 260],
				type: 'line',
				symbol: 'circle',
				symbolSize: 8,
				lineStyle: { width: 4 }
			}]
		}
	}
];