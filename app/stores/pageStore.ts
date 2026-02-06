import { defineStore } from "pinia";
import { useToast } from "@/composables/useToast";
import { pageApiService, PageApiError } from "@/services/PageApiService";
import type {
	Page,
	CreatePageDto,
	UpdatePageDto,
	CreateVideoCardDto,
	UpdateVideoCardDto,
	CreateCtaLinkDto,
	UpdateCtaLinkDto,
	CreateSocialLinkDto,
	UpdateSocialLinkDto,
	UpdatePageLinkDto,
	VideoCard,
	CtaLink,
	SocialLink,
	ApiResponse,
} from "~/types/page";

export const usePageStore = defineStore("page", () => {
	const { addToast } = useToast();

	// STATE
	const pages = ref<Page[]>([]);
	const currentPage = ref<Page | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	// GETTERS
	const hasPages = computed(() => pages.value.length > 0);
	const isLoading = computed(() => loading.value);

	// ACTIONS
	async function fetchPages(): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const fetchedPages = await pageApiService.getPages();
			console.log('pages fetched', fetchedPages)
			pages.value = fetchedPages;
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to fetch pages";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function fetchPage(pageId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const page = await pageApiService.getPage(pageId);
			currentPage.value = page;
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to fetch page";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function createPage(data: CreatePageDto): Promise<Page | null> {
		loading.value = true;
		error.value = null;

		try {
			const newPage = await pageApiService.createPage(data);
			pages.value.unshift(newPage);
			addToast("Page created successfully", { type: "success" });
			return newPage;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to create page";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updatePage(pageId: string, data: UpdatePageDto): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const updatedPage = await pageApiService.updatePage(pageId, data);

			// Update in list
			const index = pages.value.findIndex((p) => p.id === pageId);
			if (index !== -1) {
				pages.value[index] = updatedPage;
			}

			// Update current page if it's the same
			if (currentPage.value?.id === pageId) {
				currentPage.value = updatedPage;
			}

			addToast("Page updated successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to update page";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}


	async function deletePageAvatar(pageId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deleteAvatar(pageId);

			// Update in list
			const index = pages.value.findIndex((p) => p.id === pageId);
			if (index !== -1) {
				pages.value[index] = {
					...pages.value[index],
					avatar: null
				};
			}

			// Update current page if it's the same
			if (currentPage.value?.id === pageId) {
				currentPage.value = {
					...currentPage.value,
					avatar: null
				};
			}

			addToast("Avatar deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete avatar";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}


	async function deletePage(pageId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deletePage(pageId);
			pages.value = pages.value.filter((p) => p.id !== pageId);

			if (currentPage.value?.id === pageId) {
				currentPage.value = null;
			}

			addToast("Page deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete page";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	// ========================================
	// VIDEO CARD ACTIONS
	// ========================================

	async function createVideoCard(
		pageId: string,
		data: CreateVideoCardDto
	): Promise<VideoCard | null> {
		loading.value = true;
		error.value = null;

		try {
			const newCard = await pageApiService.createVideoCard(pageId, data);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId) {
				currentPage.value.videoCards = [
					...(currentPage.value.videoCards || []),
					newCard,
				];
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1) {
				pages.value[pageIndex].videoCards = [
					...(pages.value[pageIndex].videoCards || []),
					newCard,
				];
			}

			addToast("Video card created successfully", { type: "success" });
			return newCard;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to create video card";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updateVideoCard(
		pageId: string,
		cardId: string,
		data: UpdateVideoCardDto
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const updatedCard = await pageApiService.updateVideoCard(pageId, cardId, data);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId && currentPage.value.videoCards) {
				const cardIndex = currentPage.value.videoCards.findIndex((c) => c.id === cardId);
				if (cardIndex !== -1) {
					currentPage.value.videoCards[cardIndex] = updatedCard;
				}
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].videoCards) {
				const cardIndex = pages.value[pageIndex].videoCards!.findIndex((c) => c.id === cardId);
				if (cardIndex !== -1) {
					pages.value[pageIndex].videoCards![cardIndex] = updatedCard;
				}
			}

			addToast("Video card updated successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to update video card";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function reorderVideoCards(
		pageId: string,
		orders: { id: string; order: number }[]
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.reorderVideoCards(pageId, orders);

			// Option A: refetch (safe, simple)
			await fetchPage(pageId);

			// Option B (later): optimistic reorder
			addToast("Video order updated", { type: "success" });

			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError
					? err.message
					: "Failed to reorder video cards";

			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function deleteVideoCard(pageId: string, cardId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deleteVideoCard(pageId, cardId);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId && currentPage.value.videoCards) {
				currentPage.value.videoCards = currentPage.value.videoCards.filter(
					(c) => c.id !== cardId
				);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].videoCards) {
				pages.value[pageIndex].videoCards = pages.value[pageIndex].videoCards!.filter(
					(c) => c.id !== cardId
				);
			}

			addToast("Video card deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete video card";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	// ========================================
	// CTA LINK ACTIONS
	// ========================================

	async function createCtaLink(
		pageId: string,
		cardId: string,
		data: CreateCtaLinkDto
	): Promise<CtaLink | null> {
		loading.value = true;
		error.value = null;

		try {
			const newLink = await pageApiService.createCtaLink(pageId, cardId, data);

			// Update the video card with the new link
			const updateCard = (card: VideoCard) => {
				if (card.id === cardId) {
					return {
						...card,
						ctaLinks: [...(card.ctaLinks || []), newLink],
					};
				}
				return card;
			};

			// Update current page
			if (currentPage.value?.id === pageId && currentPage.value.videoCards) {
				currentPage.value.videoCards = currentPage.value.videoCards.map(updateCard);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].videoCards) {
				pages.value[pageIndex].videoCards = pages.value[pageIndex].videoCards!.map(updateCard);
			}

			addToast("CTA link created successfully", { type: "success" });
			return newLink;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to create CTA link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updateCtaLink(
		pageId: string,
		cardId: string,
		linkId: string,
		data: UpdateCtaLinkDto
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const updatedLink = await pageApiService.updateCtaLink(pageId, cardId, linkId, data);

			// Update the CTA link in the video card
			const updateCard = (card: VideoCard) => {
				if (card.id === cardId && card.ctaLinks) {
					const linkIndex = card.ctaLinks.findIndex((l) => l.id === linkId);
					if (linkIndex !== -1) {
						const updatedLinks = [...card.ctaLinks];
						updatedLinks[linkIndex] = updatedLink;
						return { ...card, ctaLinks: updatedLinks };
					}
				}
				return card;
			};

			// Update current page
			if (currentPage.value?.id === pageId && currentPage.value.videoCards) {
				currentPage.value.videoCards = currentPage.value.videoCards.map(updateCard);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].videoCards) {
				pages.value[pageIndex].videoCards = pages.value[pageIndex].videoCards!.map(updateCard);
			}

			addToast("CTA link updated successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to update CTA link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function deleteCtaLink(
		pageId: string,
		cardId: string,
		linkId: string
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deleteCtaLink(pageId, cardId, linkId);

			// Remove the CTA link from the video card
			const updateCard = (card: VideoCard) => {
				if (card.id === cardId && card.ctaLinks) {
					return {
						...card,
						ctaLinks: card.ctaLinks.filter((l) => l.id !== linkId),
					};
				}
				return card;
			};

			// Update current page
			if (currentPage.value?.id === pageId && currentPage.value.videoCards) {
				currentPage.value.videoCards = currentPage.value.videoCards.map(updateCard);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].videoCards) {
				pages.value[pageIndex].videoCards = pages.value[pageIndex].videoCards!.map(updateCard);
			}

			addToast("CTA link deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete CTA link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	// ========================================
	// PAGE LINK ACTIONS
	// ========================================

	async function createPageLink(
		pageId: string,
		data: CreatePageLinkDto
	): Promise<PageLink | null> {
		loading.value = true;
		error.value = null;

		try {
			const newLink = await pageApiService.createPageLink(pageId, data);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId) {
				currentPage.value.pageLinks = [
					...(currentPage.value.pageLinks || []),
					newLink,
				];
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1) {
				pages.value[pageIndex].pageLinks = [
					...(pages.value[pageIndex].pageLinks || []),
					newLink,
				];
			}

			addToast("Link added successfully", { type: "success" });
			return newLink;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to create link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updatePageLink(
		pageId: string,
		linkId: string,
		data: UpdatePageLinkDto
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const updatedLink = await pageApiService.updatePageLink(pageId, linkId, data);

			// Update current page
			if (currentPage.value?.id === pageId && currentPage.value.pageLinks) {
				const linkIndex = currentPage.value.pageLinks.findIndex((l) => l.id === linkId);
				if (linkIndex !== -1) {
					currentPage.value.pageLinks[linkIndex] = updatedLink;
				}
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].pageLinks) {
				const linkIndex = pages.value[pageIndex].pageLinks!.findIndex((l) => l.id === linkId);
				if (linkIndex !== -1) {
					pages.value[pageIndex].pageLinks![linkIndex] = updatedLink;
				}
			}

			addToast("Link updated successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to update link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function deletePageLink(pageId: string, linkId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deletePageLink(pageId, linkId);

			// Update current page
			if (currentPage.value?.id === pageId && currentPage.value.pageLinks) {
				currentPage.value.pageLinks = currentPage.value.pageLinks.filter(
					(l) => l.id !== linkId
				);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].pageLinks) {
				pages.value[pageIndex].pageLinks = pages.value[pageIndex].pageLinks!.filter(
					(l) => l.id !== linkId
				);
			}

			addToast("Link deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	// ========================================
	// SOCIAL LINK ACTIONS
	// ========================================

	async function createSocialLink(
		pageId: string,
		data: CreateSocialLinkDto
	): Promise<SocialLink | null> {
		loading.value = true;
		error.value = null;

		try {
			const newLink = await pageApiService.createSocialLink(pageId, data);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId) {
				currentPage.value.socialLinks = [
					...(currentPage.value.socialLinks || []),
					newLink,
				];
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1) {
				pages.value[pageIndex].socialLinks = [
					...(pages.value[pageIndex].socialLinks || []),
					newLink,
				];
			}

			addToast("Social link added successfully", { type: "success" });
			return newLink;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to create social link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return null;
		} finally {
			loading.value = false;
		}
	}

	async function updateSocialLink(
		pageId: string,
		linkId: string,
		data: UpdateSocialLinkDto
	): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			const updatedLink = await pageApiService.updateSocialLink(pageId, linkId, data);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId && currentPage.value.socialLinks) {
				const linkIndex = currentPage.value.socialLinks.findIndex((l) => l.id === linkId);
				if (linkIndex !== -1) {
					currentPage.value.socialLinks[linkIndex] = updatedLink;
				}
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].socialLinks) {
				const linkIndex = pages.value[pageIndex].socialLinks!.findIndex((l) => l.id === linkId);
				if (linkIndex !== -1) {
					pages.value[pageIndex].socialLinks![linkIndex] = updatedLink;
				}
			}

			addToast("Social link updated successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to update social link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	async function deleteSocialLink(pageId: string, linkId: string): Promise<boolean> {
		loading.value = true;
		error.value = null;

		try {
			await pageApiService.deleteSocialLink(pageId, linkId);

			// Update current page if it's loaded
			if (currentPage.value?.id === pageId && currentPage.value.socialLinks) {
				currentPage.value.socialLinks = currentPage.value.socialLinks.filter(
					(l) => l.id !== linkId
				);
			}

			// Update in pages list
			const pageIndex = pages.value.findIndex((p) => p.id === pageId);
			if (pageIndex !== -1 && pages.value[pageIndex].socialLinks) {
				pages.value[pageIndex].socialLinks = pages.value[pageIndex].socialLinks!.filter(
					(l) => l.id !== linkId
				);
			}

			addToast("Social link deleted successfully", { type: "success" });
			return true;
		} catch (err) {
			const errorMessage =
				err instanceof PageApiError ? err.message : "Failed to delete social link";
			error.value = errorMessage;
			addToast(errorMessage, { type: "error" });
			return false;
		} finally {
			loading.value = false;
		}
	}

	/**
	 * Set current project
	 */
	function setCurrentPage(project: Page | null): void {
		currentPage.value = project
	}

	/**
	 * Clear current project
	 */
	function clearCurrentPage(): void {
		currentPage.value = null
	}

	/**
	 * Clear all store
	 */
	function clearAll(): void {
		pages.value = [];
		currentPage.value = null;
		error.value = null;
	}

	return {
		// State
		pages: readonly(pages),
		currentPage: readonly(currentPage),
		loading: readonly(loading),
		error: readonly(error),

		// Getters
		hasPages,
		isLoading,

		// Actions
		fetchPages,
		fetchPage,
		createPage,
		updatePage,
		deletePageAvatar,
		deletePage,

		// Video Cards
		createVideoCard,
		updateVideoCard,
		reorderVideoCards,
		deleteVideoCard,

		// CTA Links
		createCtaLink,
		updateCtaLink,
		deleteCtaLink,

		// Page Links
		createPageLink,
		updatePageLink,
		deletePageLink,

		// Social Links
		createSocialLink,
		updateSocialLink,
		deleteSocialLink,
		clearAll,

		setCurrentPage,
		clearCurrentPage
	};
});