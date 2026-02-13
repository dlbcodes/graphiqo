// config/demo-presets.ts

export const DEMO_CHART_DATA = {
	name: "Growth Analytics",
	config: {
		legend: { valueMode: 'last', show: true, position: 'bottom' },
		smooth: true,
		showGrid: false,
		hideSource: true,
	}
};

export const PRESETS = [
	{
		id: 'source-attribution-combo',
		label: 'Traffic & Conversion',
		icon: 'PhRocketLaunch',
		description: 'Visitors vs. Conv. Rate',
		type: 'bar', // Root type for the grid
		rawData: Array.from({ length: 30 }, (_, i) => ({
			label: `Feb ${i + 1}`,
			val1: Math.floor(1200 + Math.random() * 500 + (i * 20)), // Visitors (Bar)
			val2: Number((3 + Math.random() * 2).toFixed(2)),       // Conv % (Line)
		})),
		config: {
			subtitle: "30-Day Performance Breakdown",
			darkMode: true,
			palette: ["#6366f1", "#f43f5e"],
			hideSource: true,
			// This triggers your formatter's specificType logic
			columnTypes: {
				val2: 'line'
			},
			smooth: true,
			goalValue: 2000,
			goalLabel: 'TRAFFIC GOAL'
		}
	},
	{
		id: 'traffic-stack',
		label: 'Traffic Volume',
		icon: 'PhRocketLaunch',
		description: '30-Day attribution',
		type: 'bar', // ROOT LEVEL
		rawData: Array.from({ length: 30 }, (_, i) => ({
			label: `Feb ${i + 1}`,
			val1: Math.floor(800 + Math.random() * 300 + (i * 10)),
			val2: Math.floor(400 + Math.random() * 200 + (i * 5))
		})),
		config: {
			subtitle: "Daily Visitor Stacked View",
			darkMode: true,
			stack: true,
			palette: ["#818cf8", "#34d399"],
			goalValue: 1500, // Matches your formatter's config.goalValue
			goalLabel: 'DAILY TARGET',
			hideSource: true
		}
	},
	{
		id: 'engagement-trends',
		label: 'User Retention',
		icon: 'PhTrendUp',
		description: 'Active vs. Churn',
		type: 'line', // ROOT LEVEL
		rawData: Array.from({ length: 30 }, (_, i) => ({
			label: `Feb ${i + 1}`,
			val1: Math.floor(5000 + (i * 50) - (Math.random() * 500)),
			val2: Math.floor(4500 + (i * 40) - (Math.random() * 400))
		})),
		config: {
			subtitle: "30-Day Engagement Velocity",
			darkMode: false,
			palette: ["#f43f5e", "#fb923c"],
			goalValue: 6000,
			goalLabel: 'NORTH STAR',
			hideSource: true
		}
	}
];