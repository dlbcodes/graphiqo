import { CHART_PALETTES } from "@/utils/chartConstants";

export const useChartFormatter = () => {
	// --- HELPER FOR LEGEND MATH ---
	const getLegendValue = (seriesName: string, rawData: any[], config: any, mode: string) => {
		const seriesKey = Object.keys(config).find(k => config[k] === seriesName)
			|| Object.keys(rawData[0] || {}).find(k => k.replace("val", "Series ") === seriesName);

		const fallback = { val: '—', diff: 0, diffPct: '', rawVal: 0 };
		if (!seriesKey || !rawData.length) return fallback;

		const values = rawData.map(row => Number(row[seriesKey])).filter(v => !isNaN(v));
		if (values.length === 0) return fallback;

		let result = 0;
		let diffPct = '';
		let diff = 0;

		switch (mode) {
			case 'last':
				result = values[values.length - 1];
				if (values.length > 1) {
					const prev = values[values.length - 2];
					diff = result - prev;
					// Safe division
					const pct = prev !== 0 ? ((result - prev) / Math.abs(prev)) * 100 : 0;
					diffPct = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`;
				}
				break;
			case 'sum':
				result = values.reduce((a, b) => a + b, 0);
				break;
			case 'avg':
				result = values.reduce((a, b) => a + b, 0) / values.length;
				break;
			default: return fallback;
		}

		return {
			val: result.toLocaleString(undefined, { maximumFractionDigits: mode === 'avg' ? 1 : 0 }),
			diff,
			diffPct,
			rawVal: result
		};
	};

	const formatOptions = (chart: any, brand?: any) => {
		if (!chart) return {};

		const config = chart.config || {};
		const globalType = chart.type || "bar";
		const raw = chart.rawData || [];

		// 1. Theme Logic
		const isDark = config.darkMode;
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

		// BASE SHARED SETTINGS
		const baseSettings = {
			backgroundColor: isDark ? "#0f0f0f" : "transparent",
			color: finalPalette,
			textStyle: {
				color: finalTextColor,
				fontFamily: finalFont
			},
			legend: {
				show: false,

			},
			tooltip: {
				backgroundColor: isDark ? "#1f2937" : "#ffffff",
				borderColor: isDark ? "#374151" : "#e5e7eb",
				textStyle: { color: finalTextColor },
				trigger: (globalType === 'pie' || globalType === 'donut' || globalType === 'funnel') ? 'item' : 'axis'
			}
		};

		// --- TYPE: RADAR ---
		if (globalType === "radar") {
			return {
				...baseSettings,
				radar: {
					indicator: filtered.map(r => ({ name: r.label, max: config.radarMax || 100 })),
					axisName: { color: finalTextColor, fontFamily: finalFont },
					splitArea: { show: true, areaStyle: { opacity: 0.05 } }
				},
				series: [{
					type: 'radar',
					data: seriesKeys.map((key) => ({
						value: filtered.map(r => Number(r[key]) || 0),
						name: config[`${key}Name`] || key.replace("val", "Series ")
					}))
				}]
			};
		}

		// --- TYPE: HEATMAP ---
		if (globalType === "heatmap") {
			return {
				...baseSettings,
				visualMap: {
					min: 0, max: 100, orient: 'horizontal', left: 'center', bottom: 0,
					textStyle: { color: finalTextColor },
					inRange: { color: [finalPalette[0], finalPalette[1] || '#fff'] }
				},
				xAxis: { type: 'category', data: labels, axisLabel: { color: finalTextColor } },
				yAxis: { type: 'category', data: seriesKeys.map(k => config[`${k}Name`] || k), axisLabel: { color: finalTextColor } },
				series: [{
					type: 'heatmap',
					data: filtered.flatMap((r, i) => seriesKeys.map((k, j) => [i, j, Number(r[k]) || 0])),
					label: { show: config.showLabels, color: finalTextColor }
				}]
			};
		}

		// --- TYPE: FUNNEL ---
		if (globalType === "funnel") {
			return {
				...baseSettings,
				series: [{
					type: 'funnel',
					left: '10%', width: '80%',
					data: filtered.map(r => ({ value: Number(r.val1), name: r.label })),
					label: { position: 'inside', color: '#fff' }
				}]
			};
		}

		// --- TYPE: PIE / DONUT ---
		if (globalType === "pie" || globalType === "donut") {
			return {
				...baseSettings,
				series: [{
					type: 'pie',
					radius: globalType === 'donut' ? ['40%', '70%'] : '70%',
					itemStyle: { borderRadius: 10, borderColor: isDark ? '#111827' : '#fff', borderWidth: 2 },
					label: { show: config.showLabels, color: finalTextColor },
					data: filtered.map((r: any) => ({
						value: Number(r.val1) || 0,
						name: r.label
					}))
				}]
			};
		}

		// --- TYPE: STANDARD GRID ---
		const series = seriesKeys.map((key, idx) => {
			const specificType = config.columnTypes?.[key] || globalType;
			const isArea = specificType === "area";
			const isStep = specificType === "step";

			return {
				name: config[`${key}Name`] || key.replace("val", "Series "),
				type: (isArea || isStep) ? "line" : (specificType === "scatter" ? "scatter" : specificType),
				data: filtered.map((r: any) => Number(r[key]) || 0),
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
				markLine: idx === 0 && config.goalValue ? {
					symbol: ["none", "none"],
					data: [{ yAxis: config.goalValue }],
					lineStyle: { color: "#f43f5e", type: "dashed" },
					label: { formatter: config.goalLabel || "Target" }
				} : null
			};
		});

		return {
			...baseSettings,
			grid: {
				left: '0%',
				right: '0%',
				bottom: config.legend?.position === 'bottom' ? '15%' : '10%',
				top: '2%',
				containLabel: true,
				show: false
			},
			xAxis: {
				show: !config.hideX,
				type: config.horizontal ? "value" : "category",
				data: config.horizontal ? null : labels,
				axisLabel: { color: finalTextColor, fontSize: config.fontSize },
				splitLine: { show: config.showGrid, lineStyle: { opacity: 0.1 } }
			},
			yAxis: {
				show: !config.hideY,
				type: config.horizontal ? "category" : "value",
				data: config.horizontal ? labels : null,
				axisLabel: { color: finalTextColor, fontSize: config.fontSize },
				splitLine: { show: config.showGrid, lineStyle: { opacity: 0.1 } }
			},
			series
		};
	};

	return {
		formatOptions,
		getLegendValue
	};
};