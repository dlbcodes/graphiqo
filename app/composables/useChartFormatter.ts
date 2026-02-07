import { CHART_PALETTES } from "@/utils/chartConstants";

export const useChartFormatter = () => {
	const formatOptions = (chart: any, brand?: any) => {
		if (!chart) return {};

		const config = chart.config || {};
		const globalType = chart.type || "bar";
		const raw = chart.rawData || [];

		// 1. Theme & Branding
		const finalPalette = brand?.palette?.length ? brand.palette : (config.palette || CHART_PALETTES.vibrant);
		const finalTextColor = brand?.textColor || "#374151";
		const finalFont = brand?.fontFamily || config.fontFamily || "Inter";

		// 2. Data Preparation
		const filtered = raw.filter((r: any) => r.label && String(r.label).trim() !== "");
		if (filtered.length === 0) return {};

		const labels = filtered.map((r: any) => r.label);
		const seriesKeys = Object.keys(filtered[0] || {}).filter((k) => k.startsWith("val"));

		// 3. SPECIAL CASE: PIE / DONUT
		if (globalType === "pie" || globalType === "donut") {
			return {
				color: finalPalette,
				textStyle: { fontFamily: finalFont },
				tooltip: { trigger: 'item', formatter: `{b}: {c}${config.suffix || ''} ({d}%)` },
				legend: { show: true, bottom: 0, textStyle: { color: finalTextColor } },
				series: [{
					type: 'pie',
					radius: globalType === 'donut' ? ['40%', '70%'] : '70%',
					avoidLabelOverlap: true,
					itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
					label: { show: config.showLabels, color: finalTextColor },
					data: filtered.map((r: any) => ({
						value: Number(r.val1) || 0,
						name: r.label
					}))
				}]
			};
		}

		// 4. MULTI-SERIES (Mixed Mode, Area, Step, Scatter)
		const series = seriesKeys.map((key, idx) => {
			// Check for specific column type (The "Mixed Mode" feature)
			const specificType = config.columnTypes?.[key] || globalType;

			const isArea = specificType === "area";
			const isStep = specificType === "step";
			const isScatter = specificType === "scatter";

			return {
				name: key.replace("val", "Column "),
				// Map logical types to ECharts internal types
				type: (isArea || isStep) ? "line" : (isScatter ? "scatter" : specificType),
				data: filtered.map((r: any) => Number(r[key]) || 0),

				// Visual Logic
				step: isStep ? "start" : false,
				smooth: config.smooth ?? true,
				symbolSize: isScatter ? 12 : (config.symbolSize ?? 4),
				areaStyle: (isArea || config.area) ? { opacity: 0.3 } : null,
				stack: config.stack ? "total" : null,

				label: {
					show: config.showLabels,
					position: config.horizontal ? "right" : "top",
					color: finalTextColor,
					formatter: (p: any) => `${p.value.toFixed(config.precision || 0)}${config.suffix || ""}`,
				},

				// Goal Line (MarkLine)
				markLine: idx === 0 && config.goalValue ? {
					symbol: ["none", "none"],
					data: [{
						yAxis: config.goalValue,
						lineStyle: { color: "#f43f5e", type: "dashed", width: 2 },
						label: { formatter: config.goalLabel || "Target", position: "end" }
					}]
				} : null
			};
		});

		// 5. AXIS LOGIC (Supports Horizontal Flip)
		return {
			color: finalPalette,
			textStyle: { color: finalTextColor, fontFamily: finalFont },
			tooltip: { trigger: "axis", axisPointer: { type: 'shadow' } },
			legend: { show: true, bottom: 10, textStyle: { color: finalTextColor } },
			grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
			xAxis: {
				show: !config.hideX,
				type: config.horizontal ? "value" : "category",
				data: config.horizontal ? null : labels,
				axisLabel: { color: finalTextColor }
			},
			yAxis: {
				show: !config.hideY,
				type: config.horizontal ? "category" : "value",
				data: config.horizontal ? labels : null,
				axisLabel: { color: finalTextColor },
				splitLine: { show: config.showGrid, lineStyle: { opacity: 0.1 } }
			},
			animationDuration: 1000,
			series
		};
	};

	return { formatOptions };
};