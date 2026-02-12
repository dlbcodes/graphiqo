// composables/useChartDownload.ts
import { ref, readonly } from 'vue'
import html2canvas from 'html2canvas-pro'
import * as echarts from 'echarts'

const isDownloading = ref(false)

export function useChartDownload() {
	const downloadWithPreset = async (
		elementId: string,
		preset: { w: number, h: number, id: string },
		chartOptions: any,
		chartData: any,
		filename?: string
	) => {
		try {
			isDownloading.value = true

			// 1. Get the original preview element to clone the legend
			const originalElement = document.getElementById(elementId)
			if (!originalElement) {
				console.error('Preview element not found')
				return
			}

			// 2. Create high-res container
			const container = document.createElement('div')
			container.style.cssText = `
				position: fixed;
				left: -99999px;
				top: 0;
				width: ${preset.w}px;
				height: ${preset.h}px;
				background: ${chartData?.config?.darkMode ? '#0F0F0F' : '#ffffff'};
				padding: 60px;
				box-sizing: border-box;
			`
			document.body.appendChild(container)

			// 3. Create layout structure
			const wrapper = document.createElement('div')
			wrapper.style.cssText = `
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
			`

			// 4. Add title
			const titleDiv = document.createElement('div')
			titleDiv.style.cssText = `
				margin-bottom: 24px;
			`
			const title = document.createElement('h1')
			title.textContent = chartData?.name || 'Chart'
			title.style.cssText = `
				font-size: 32px;
				font-weight: 700;
				margin: 0;
				color: ${chartData?.config?.darkMode ? '#ffffff' : '#1c1917'};
			`
			titleDiv.appendChild(title)

			if (chartData?.config?.subtitle) {
				const subtitle = document.createElement('p')
				subtitle.textContent = chartData.config.subtitle
				subtitle.style.cssText = `
					font-size: 18px;
					margin: 8px 0 0 0;
					color: ${chartData?.config?.darkMode ? '#a8a29e' : '#78716c'};
					opacity: 0.8;
				`
				titleDiv.appendChild(subtitle)
			}

			wrapper.appendChild(titleDiv)

			// 5. Clone and add the custom legend if it exists
			let legendHeight = 0
			if (chartData?.config?.legend?.show !== false) {
				const legendElement = originalElement.querySelector('[class*="flex flex-wrap gap-x-4"]')
				if (legendElement) {
					const clonedLegend = legendElement.cloneNode(true) as HTMLElement
					// Remove interactive styles
					clonedLegend.style.cssText = `
						display: flex;
						flex-wrap: wrap;
						gap: 1rem 1rem;
						margin-bottom: 32px;
						pointer-events: none;
					`
					// Remove hover/click states from children
					const items = clonedLegend.querySelectorAll('[class*="cursor-pointer"]')
					items.forEach(item => {
						(item as HTMLElement).style.cursor = 'default'
					})

					wrapper.appendChild(clonedLegend)
					legendHeight = clonedLegend.offsetHeight || 80
				}
			}

			// 6. Create chart container
			const chartDiv = document.createElement('div')
			chartDiv.style.cssText = `
				flex: 1;
				width: 100%;
				min-height: 0;
			`
			wrapper.appendChild(chartDiv)

			// 7. Add footer
			const footerDiv = document.createElement('div')
			footerDiv.style.cssText = `
				margin-top: 24px;
				padding-top: 16px;
				border-top: 1px solid ${chartData?.config?.darkMode ? '#292524' : '#e7e5e4'};
				display: flex;
				justify-content: space-between;
				align-items: center;
			`

			if (chartData?.config?.notes) {
				const notes = document.createElement('p')
				notes.textContent = chartData.config.notes
				notes.style.cssText = `
					font-size: 14px;
					font-style: italic;
					margin: 0;
					color: ${chartData?.config?.darkMode ? '#a8a29e' : '#78716c'};
				`
				footerDiv.appendChild(notes)
			}

			if (chartData?.config?.source) {
				const source = document.createElement('p')
				source.textContent = `Source: ${chartData.config.source}`
				source.style.cssText = `
					font-size: 12px;
					margin: 0;
					font-weight: 600;
					color: ${chartData?.config?.darkMode ? '#818cf8' : '#4f46e5'};
				`
				footerDiv.appendChild(source)
			}

			wrapper.appendChild(footerDiv)
			container.appendChild(wrapper)

			// 8. Initialize ECharts with high DPI
			await new Promise(resolve => setTimeout(resolve, 100))

			// Calculate available height for chart using actual measured legend height
			const availableHeight = preset.h - 120 - titleDiv.offsetHeight - footerDiv.offsetHeight - legendHeight
			const availableWidth = preset.w - 120

			// Set explicit dimensions on the chart container
			chartDiv.style.width = `${availableWidth}px`
			chartDiv.style.height = `${availableHeight}px`

			const chart = echarts.init(chartDiv, null, {
				renderer: 'canvas',
				devicePixelRatio: 1, // Use 1 here, we'll scale with html2canvas
				width: availableWidth,
				height: availableHeight
			})

			// 9. Set options and wait for render (disable internal legend)
			const optionsWithoutLegend = {
				...chartOptions,
				legend: { show: false },
				// Force exact sizing in grid
				grid: {
					...chartOptions.grid,
					containLabel: true,
					left: 60,
					right: 40,
					top: 40,
					bottom: 60
				}
			}
			chart.setOption(optionsWithoutLegend)

			// Force resize to exact dimensions
			chart.resize({ width: availableWidth, height: availableHeight })
			await new Promise(resolve => setTimeout(resolve, 800))

			// 10. Capture with html2canvas
			const canvas = await html2canvas(container, {
				scale: 2, // 2x resolution for high quality
				useCORS: true,
				backgroundColor: chartData?.config?.darkMode ? '#0F0F0F' : '#ffffff',
				width: preset.w,
				height: preset.h,
				logging: false
			})

			// 11. Download
			const link = document.createElement('a')
			link.download = filename || `chart-${preset.id}.png`
			link.href = canvas.toDataURL('image/png', 1.0)
			link.click()

			// 12. Cleanup
			chart.dispose()
			document.body.removeChild(container)

		} catch (error) {
			console.error('Download error:', error)
		} finally {
			isDownloading.value = false
		}
	}

	return {
		isDownloading: readonly(isDownloading),
		downloadWithPreset
	}
}