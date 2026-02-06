export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.server) {
		return
	}

	const profileStore = useProfileStore();
	const pageStore = usePageStore();

	console.log('in admin middleware')

	// Check authentication
	if (!profileStore.isAuthenticated) {
		return navigateTo('/login');
	}

	// Only fetch pages once (if not already loaded)
	if (pageStore.pages.length === 0 && !pageStore.isLoading) {
		await pageStore.fetchPages();
	}

	// Handle /admin index - redirect based on pages
	if (to.path === '/admin' || to.path === '/admin/') {
		if (pageStore.pages.length === 0) {
			// No pages yet - show onboarding
			return navigateTo('/admin/onboarding');
		} else {
			// Has pages - redirect to first page
			pageStore.setCurrentPage(pageStore.pages[0])
			return navigateTo(`/admin/${pageStore.pages[0].id}`);
		}
	}

	// If trying to access a specific page, verify it exists
	if (to.params.id) {
		const pageId = to.params.id as string;
		const pageExists = pageStore.pages.some(p => p.id === pageId);

		if (!pageExists && !pageStore.isLoading) {
			// Page not found - redirect to admin index
			return navigateTo('/admin');
		}
	}
});