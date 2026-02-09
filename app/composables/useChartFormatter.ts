import { CHART_PALETTES } from "@/utils/chartConstants";

export const useChartFormatter = () => {
	const formatOptions = (chart: any, brand?: any) => {
		if (!chart) return {};

		const config = chart.config || {};
		const globalType = chart.type || "bar";
		const raw = chart.rawData || [];

		// 1. Theme Awareness
		const isDark = config.darkMode;

		// 1. Theme Logic (Priority: Brand Profile > Config Palette > System Default)
		const finalPalette = brand?.palette?.length
			? brand.palette
			: (config.palette || CHART_PALETTES.vibrant);

		const defaultText = isDark ? "#f3f4f6" : "#374151";
		const finalTextColor = brand?.textColor || config.textColor || defaultText;
		const finalFont = brand?.fontFamily || config.fontFamily || "Geist";

		// 2. Data Cleaning
		const filtered = raw.filter((r: any) => r.label && String(r.label).trim() !== "");
		if (filtered.length === 0) return {};

		const labels = filtered.map((r: any) => r.label);
		const seriesKeys = Object.keys(filtered[0] || {}).filter((k) => k.startsWith("val"));

		// 3. PIE / DONUT LOGIC
		if (globalType === "pie" || globalType === "donut") {
			return {
				color: finalPalette,
				textStyle: { fontFamily: finalFont },
				tooltip: { trigger: 'item' },
				legend: { show: true, bottom: 0, textStyle: { color: finalTextColor } },
				series: [{
					type: 'pie',
					radius: globalType === 'donut' ? ['40%', '70%'] : '70%',
					itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
					label: { show: config.showLabels, color: finalTextColor },
					data: filtered.map((r: any) => ({
						value: Number(r.val1) || 0,
						name: r.label
					}))
				}]
			};
		}

		// 4. MULTI-SERIES LOGIC (The "Elevated" Part)
		const series = seriesKeys.map((key, idx) => {
			const specificType = config.columnTypes?.[key] || globalType;
			const isArea = specificType === "area";
			const isStep = specificType === "step";

			return {
				name: key.replace("val", "Series "),
				type: (isArea || isStep) ? "line" : (specificType === "scatter" ? "scatter" : specificType),
				data: filtered.map((r: any) => Number(r[key]) || 0),

				// NEW: Smooth & Area logic from Settings
				smooth: config.smooth ?? false,
				areaStyle: (isArea || config.area) ? { opacity: 0.3 } : null,

				step: isStep ? "start" : false,
				symbolSize: specificType === "scatter" ? 12 : (config.symbolSize ?? 4),
				lineStyle: { width: config.lineWidth || 2 },
				stack: config.stack ? "total" : null,

				label: {
					show: config.showLabels,
					position: config.horizontal ? "right" : "top",
					color: finalTextColor,
					formatter: (p: any) => `${p.value.toFixed(config.precision || 0)}${config.suffix || ""}`,
				},

				// Goal Line
				markLine: idx === 0 && config.goalValue ? {
					symbol: ["none", "none"],
					data: [{ yAxis: config.goalValue }],
					lineStyle: { color: "#f43f5e", type: "dashed" },
					label: { formatter: config.goalLabel || "Target" }
				} : null
			};
		});

		// 5. GRID & AXIS LOGIC
		return {
			backgroundColor: isDark ? "#111827" : "transparent",
			color: brand?.palette?.length ? brand.palette : (config.palette || CHART_PALETTES.vibrant),
			textStyle: {
				color: finalTextColor,
				fontFamily: finalFont
			},
			// LEGEND CUSTOMIZATION
			legend: {
				show: config.showLegend !== false,
				orient: (config.legendPosition === 'left' || config.legendPosition === 'right') ? 'vertical' : 'horizontal',
				left: config.legendPosition === 'left' ? 'left' : (config.legendPosition === 'right' ? 'right' : 'center'),
				top: config.legendPosition === 'top' ? 'top' : (config.legendPosition === 'bottom' ? 'bottom' : 'middle'),
				textStyle: { color: finalTextColor, fontSize: config.fontSize }
			},
			tooltip: {
				trigger: "axis",
				backgroundColor: isDark ? "#1f2937" : "#ffffff",
				borderColor: isDark ? "#374151" : "#e5e7eb",
				textStyle: { color: finalTextColor }
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '10%',
				containLabel: true,
				// NEW: Toggle border if grid is off for a cleaner look
				show: false
			},
			xAxis: {
				show: !config.hideX,
				type: config.horizontal ? "value" : "category",
				data: config.horizontal ? null : labels,
				axisLabel: { color: finalTextColor, fontSize: config.fontSize },
				// NEW: Grid control
				splitLine: { show: config.showGrid, lineStyle: { opacity: 0.1 } }
			},
			yAxis: {
				show: !config.hideY,
				type: config.horizontal ? "category" : "value",
				data: config.horizontal ? labels : null,
				axisLabel: { color: finalTextColor, fontSize: config.fontSize },
				// NEW: Grid control
				splitLine: { show: config.showGrid, lineStyle: { opacity: 0.1 } }
			},
			series
		};
	};

	return { formatOptions };
};