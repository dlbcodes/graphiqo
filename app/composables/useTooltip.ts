// composables/useTooltip.ts
import type { DirectiveBinding } from 'vue'

type TooltipBinding = string | undefined

interface TooltipHTMLElement extends HTMLElement {
	_tooltipCleanup?: () => void
}

export const useTooltip = () => {
	const createTooltipDirective = () => ({
		mounted(el: TooltipHTMLElement, binding: DirectiveBinding<TooltipBinding>) {
			let content = binding.value
			if (!content) return

			let tooltipEl: HTMLDivElement | null = null
			let timeoutId: ReturnType<typeof setTimeout> | null = null

			const createTooltip = () => {
				if (tooltipEl) tooltipEl.remove()

				tooltipEl = document.createElement('div')
				tooltipEl.textContent = content ?? ''
				tooltipEl.className =
					'fixed z-50 max-w-xs px-2 py-1 text-xs rounded-md shadow-lg ' +
					'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 ' +
					'pointer-events-none opacity-0 transition-opacity duration-200'

				document.body.appendChild(tooltipEl)
			}

			const positionTooltip = () => {
				if (!tooltipEl) return

				const rect = el.getBoundingClientRect()
				const tooltipRect = tooltipEl.getBoundingClientRect()

				let top = rect.top - tooltipRect.height - 8
				let left = rect.left + (rect.width - tooltipRect.width) / 2

				// Flip if not enough space on top
				if (top < 8) {
					top = rect.bottom + 8
				}

				// Horizontal boundaries
				left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8))

				tooltipEl.style.top = `${top}px`
				tooltipEl.style.left = `${left}px`
			}

			const showTooltip = () => {
				if (!content) return

				if (timeoutId) clearTimeout(timeoutId)

				timeoutId = setTimeout(() => {
					createTooltip()
					positionTooltip()

					requestAnimationFrame(() => {
						tooltipEl?.classList.remove('opacity-0')
						tooltipEl?.classList.add('opacity-100')
					})
				}, 100)
			}

			const hideTooltip = () => {
				if (timeoutId) {
					clearTimeout(timeoutId)
					timeoutId = null
				}

				if (!tooltipEl) return

				tooltipEl.classList.remove('opacity-100')
				tooltipEl.classList.add('opacity-0')

				setTimeout(() => {
					tooltipEl?.remove()
					tooltipEl = null
				}, 200)
			}

			const handleScrollOrResize = () => {
				positionTooltip()
			}

			// Mouse
			el.addEventListener('mouseenter', showTooltip)
			el.addEventListener('mouseleave', hideTooltip)

			// Keyboard accessibility
			el.addEventListener('focus', showTooltip)
			el.addEventListener('blur', hideTooltip)

			// Keep position correct
			window.addEventListener('scroll', handleScrollOrResize, true)
			window.addEventListener('resize', handleScrollOrResize)

			el._tooltipCleanup = () => {
				el.removeEventListener('mouseenter', showTooltip)
				el.removeEventListener('mouseleave', hideTooltip)
				el.removeEventListener('focus', showTooltip)
				el.removeEventListener('blur', hideTooltip)

				window.removeEventListener('scroll', handleScrollOrResize, true)
				window.removeEventListener('resize', handleScrollOrResize)

				if (timeoutId) clearTimeout(timeoutId)
				if (tooltipEl) tooltipEl.remove()
			}
		},

		updated(el: TooltipHTMLElement, binding: DirectiveBinding<TooltipBinding>) {
			// Update content dynamically
			if (binding.value !== binding.oldValue) {
				// content is captured via closure, so we just update binding value
				el.setAttribute('data-tooltip', binding.value ?? '')
			}
		},

		unmounted(el: TooltipHTMLElement) {
			el._tooltipCleanup?.()
		}
	})

	return {
		createTooltipDirective
	}
}
