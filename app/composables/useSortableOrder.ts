import { ref, watch, type Ref } from "vue"
import { useSortable } from "@vueuse/integrations/useSortable"
import { useDebounceFn } from "@vueuse/core"

export function useSortableOrder<T extends { id: string; order: number }>(
	source: Ref<T[]>,
	saveFn: (items: { id: string; order: number }[]) => Promise<void>
) {
	const items = ref<T[]>([])
	const container = ref<HTMLElement | null>(null)

	const isSorting = ref(false)
	const hasUnsavedOrder = ref(false)

	// Keep local copy in sync unless user is actively sorting
	watch(
		source,
		(newItems) => {
			if (!hasUnsavedOrder.value) {
				items.value = [...newItems]
			}
		},
		{ immediate: true }
	)

	const persistOrder = async () => {
		isSorting.value = true
		try {
			await saveFn(
				items.value.map((item, index) => ({
					id: item.id,
					order: index,
				}))
			)
			hasUnsavedOrder.value = false
		} catch (e) {
			console.error("Failed to persist order", e)
			items.value = [...source.value]
			hasUnsavedOrder.value = false
		} finally {
			isSorting.value = false
		}
	}

	const debouncedPersist = useDebounceFn(persistOrder, 1000)

	useSortable(container, items, {
		handle: ".drag-handle",
		animation: 150,
		ghostClass: "opacity-40",

		onEnd() {
			items.value = items.value.map((item, index) => ({
				...item,
				order: index,
			}))

			hasUnsavedOrder.value = true
			debouncedPersist()
		},
	})

	return {
		container,
		items,
		isSorting,
		hasUnsavedOrder,
	}
}
