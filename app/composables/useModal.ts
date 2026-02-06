export function useModal<T = null>() {
	const isOpen = ref(false);
	const data = ref<T | null>(null);

	const open = (payload?: T) => {
		data.value = payload ?? null;
		isOpen.value = true;
	};

	const close = () => {
		isOpen.value = false;
		data.value = null;
	};

	return {
		isOpen,
		data,
		open,
		close,
	};
}
