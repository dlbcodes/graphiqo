// plugins/tooltip.client.ts
import { useTooltip } from '~/composables/useTooltip'

export default defineNuxtPlugin((nuxtApp) => {
	const { createTooltipDirective } = useTooltip()

	nuxtApp.vueApp.directive('tooltip', createTooltipDirective())
})
