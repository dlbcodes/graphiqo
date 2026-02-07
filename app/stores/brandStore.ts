import { defineStore } from "pinia";
import { brandApi } from "@/services/BrandApiService";
import type { BrandProfile } from "@prisma/client";
import { useToast } from "@/composables/useToast";

export const useBrandStore = defineStore("brand", () => {
	const { addToast } = useToast();

	// STATE
	const brands = ref<BrandProfile[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// GETTERS (Computed)
	const getBrandById = (id: string) => brands.value.find(b => b.id === id);

	// ACTIONS
	async function fetchBrands() {
		loading.value = true;
		error.value = null;
		try {
			brands.value = await brandApi.getBrands();
		} catch (err: any) {
			error.value = err.message;
			addToast("Failed to load brand profiles", { type: "error" });
		} finally {
			loading.value = false;
		}
	}

	async function createBrand(payload: Partial<BrandProfile>) {
		loading.value = true;
		try {
			const newBrand = await brandApi.createBrand(payload);
			brands.value.push(newBrand);
			addToast(`Brand "${newBrand.name}" created!`, { type: "success" });
			return newBrand;
		} catch (err) {
			addToast("Error creating brand", { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updateBrand(id: string, payload: Partial<BrandProfile>) {
		// Optimistic UI Update
		const index = brands.value.findIndex(b => b.id === id);
		let previousData: BrandProfile | null = null;

		if (index !== -1) {
			previousData = { ...brands.value[index] };
			brands.value[index] = { ...brands.value[index], ...payload };
		}

		try {
			await brandApi.updateBrand(id, payload);
		} catch (err) {
			// Rollback if server fails
			if (index !== -1 && previousData) brands.value[index] = previousData;
			addToast("Failed to save brand changes", { type: "error" });
		}
	}

	async function deleteBrand(id: string) {
		const originalBrands = [...brands.value];
		brands.value = brands.value.filter(b => b.id !== id);

		try {
			await brandApi.deleteBrand(id);
			addToast("Brand profile removed", { type: "success" });
		} catch (err) {
			brands.value = originalBrands; // Rollback
			addToast("Could not delete brand", { type: "error" });
		}
	}

	return {
		// State
		brands,
		loading,
		error,

		// Getters
		getBrandById,

		// Actions
		fetchBrands,
		createBrand,
		updateBrand,
		deleteBrand
	};
});