<script setup lang="ts">
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/vue";
import { Float } from "@headlessui-float/vue";
import { PhCaretUpDown, PhCheck, PhPlus } from "@phosphor-icons/vue";
import { popoverVariants } from "~/variants/PopoverVariants";
import { navigationVariants } from "~/variants/NavigationVariants";
import { type Page } from "~/types/page";

const pageStore = usePageStore();
const route = useRoute();
const router = useRouter();

const routePageId = computed(() => route.params.id as string | undefined);

// ✅ local mutable ref for Listbox
const selectedPage = ref<Page | null>(null);

/**
 * Sync route → store → local state
 */
watch(
    routePageId,
    async (pageId) => {
        if (!pageId) {
            selectedPage.value = null;
            pageStore.clearCurrentPage();
            return;
        }

        if (!pageStore.hasPages) {
            await pageStore.fetchPages();
        }

        const page = pageStore.pages.find((p) => p.id === pageId);

        if (page) {
            pageStore.setCurrentPage(page);
            selectedPage.value = page;
        } else {
            // fallback: fetch single page
            const ok = await pageStore.fetchPage(pageId);
            if (ok) {
                selectedPage.value = pageStore.currentPage;
            }
        }
    },
    { immediate: true }
);

/**
 * Sync Listbox → store → route
 */
watch(selectedPage, async (page) => {
    if (!page) return;

    if (page.id !== pageStore.currentPage?.id) {
        pageStore.setCurrentPage(page);
        await router.push(`/admin/${page.id}`);
    }
});

/**
 * Initial load
 */
onMounted(async () => {
    if (!pageStore.hasPages) {
        await pageStore.fetchPages();
    }

    if (pageStore.currentPage) {
        selectedPage.value = pageStore.currentPage;
    }
});

const handleCreateProject = async () => {
    await router.push("/admin/onboarding");
};
</script>

<template>
    <Listbox v-model="selectedPage" by="id">
        <div class="relative">
            <Float
                placement="bottom-end"
                :offset="4"
                flip
                shift
                :z-index="99999"
                portal
            >
                <!-- Trigger -->
                <ListboxButton
                    class="relative w-full cursor-pointer rounded-2xl bg-white dark:bg-dark-800 py-2 pl-3 pr-10 text-left ring-1 ring-black/5 focus:outline-none focus:ring-2"
                >
                    <div v-if="selectedPage" class="flex items-center gap-x-2">
                        <Avatar
                            size="base"
                            :src="selectedPage.avatarUrl"
                            :name="selectedPage.title"
                        />

                        <div class="flex flex-1 flex-col gap-y-1 min-w-0">
                            <h6
                                class="font-mono text-sm font-semibold truncate"
                            >
                                {{ selectedPage.slug }}
                            </h6>
                            <Badge variant="secondary">Free</Badge>
                        </div>
                    </div>

                    <span
                        v-else
                        class="block truncate text-stone-400 dark:text-dark-500"
                    >
                        Select a page…
                    </span>

                    <span
                        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                        <PhCaretUpDown
                            class="size-5 shrink-0 text-stone-400"
                            aria-hidden="true"
                        />
                    </span>
                </ListboxButton>

                <!-- Dropdown -->
                <Transition
                    enter="transition ease-out duration-100"
                    enter-from="opacity-0 scale-95"
                    enter-to="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leave-from="opacity-100 scale-100"
                    leave-to="opacity-0 scale-95"
                >
                    <ListboxOptions
                        :class="
                            cn(
                                popoverVariants({
                                    variant: 'primary',
                                    size: 'fit',
                                }),
                                'mt-1'
                            )
                        "
                    >
                        <!-- Pages -->
                        <ListboxOption
                            v-for="page in pageStore.pages"
                            :key="page.id"
                            :value="page"
                            as="template"
                            v-slot="{ active, selected }"
                        >
                            <li
                                :class="
                                    cn(
                                        navigationVariants({
                                            variant: 'primary',
                                        }),
                                        'relative flex items-center gap-x-2'
                                    )
                                "
                            >
                                <Avatar
                                    size="sm"
                                    :src="page.avatarUrl"
                                    :name="page.title"
                                />

                                <span class="flex-1 truncate">
                                    {{ page.slug }}
                                </span>

                                <span
                                    v-if="selected"
                                    class="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <PhCheck
                                        class="size-4 text-stone-600 dark:text-dark-300"
                                        aria-hidden="true"
                                    />
                                </span>
                            </li>
                        </ListboxOption>

                        <!-- Divider -->
                        <div class="my-2 h-px bg-stone-200 dark:bg-dark-700" />

                        <!-- Create new page -->
                        <div class="px-2">
                            <Button
                                class="w-full justify-start"
                                variant="primary"
                                @click="handleCreateProject"
                            >
                                <div class="flex items-center gap-x-2">
                                    <PhPlus class="size-5 shrink-0" />
                                    <span class="text-sm font-medium">
                                        Create new page
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </ListboxOptions>
                </Transition>
            </Float>
        </div>
    </Listbox>
</template>
