<script setup>
definePageMeta({ middleware: "admin" });

const store = useDashboardStore();
const newTitle = ref("");
const isCreating = ref(false);

// Fetch dashboards on load
onMounted(() => store.fetchDashboards());

const handleCreate = async () => {
    if (!newTitle.value) return;
    isCreating.value = true;
    const newDb = await store.createDashboard(newTitle.value);
    if (newDb) {
        newTitle.value = "";
        // Navigate immediately to the new project
        navigateTo(`/admin/dashboard/${newDb.id}`);
    }
    isCreating.value = false;
};
</script>

<template>
    <div class="p-8 max-w-4xl mx-auto">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">My Dashboards</h1>

            <div class="flex gap-2">
                <input
                    v-model="newTitle"
                    placeholder="Dashboard Name..."
                    class="border p-2 rounded w-64"
                    @keyup.enter="handleCreate"
                />
                <button
                    @click="handleCreate"
                    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    :disabled="isCreating"
                >
                    {{ isCreating ? "Creating..." : "+ New" }}
                </button>
            </div>
        </div>

        <div v-if="store.loading" class="text-center py-10">
            Loading projects...
        </div>

        <div
            v-else-if="store.dashboards.length === 0"
            class="border-2 border-dashed rounded-lg p-20 text-center"
        >
            <p class="text-gray-500 mb-4">You don't have any dashboards yet.</p>
            <button
                @click="handleCreate"
                class="text-blue-600 font-bold underline"
            >
                Create your first one
            </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
                v-for="db in store.dashboards"
                :key="db.id"
                class="border p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer bg-white"
                @click="navigateTo(`/admin/dashboard/${db.id}`)"
            >
                <h3 class="font-bold text-xl mb-2">{{ db.title }}</h3>
                <p class="text-sm text-gray-400">
                    Last updated:
                    {{ new Date(db.updatedAt).toLocaleDateString() }}
                </p>
            </div>
        </div>
    </div>
</template>
