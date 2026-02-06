import VueExcelEditor from 'vue3-excel-editor'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'

// Import the ECharts modules you need
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent,
	LegendComponent,
	TitleComponent
} from 'echarts/components'

export default defineNuxtPlugin((nuxtApp) => {
	// 1. Setup ECharts
	use([
		CanvasRenderer,
		BarChart,
		LineChart,
		GridComponent,
		TooltipComponent,
		LegendComponent,
		TitleComponent
	])

	// 2. Register VueExcelEditor
	nuxtApp.vueApp.use(VueExcelEditor)

	// 3. Register VChart component
	nuxtApp.vueApp.component('v-chart', VChart)
})