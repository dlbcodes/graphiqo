export default defineNuxtRouteMiddleware((to) => {
	// Only run on the client to avoid SSR hydration mismatches
	if (import.meta.server) return

	const client = useSupabaseClient()
	const user = useSupabaseUser()

	console.log('🛡️ Admin Middleware: Auth Check Only')

	// 1. Simple Auth Check: If no user, send to login
	if (!user.value) {
		return navigateTo('/login')
	}

	// 2. We let the /admin page component handle the "Onboarding vs Dashboard" logic.
	// This makes the app feel faster because the page loads immediately 
	// while the data fetches in the background.
})