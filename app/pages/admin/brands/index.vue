<script setup lang="ts">
const brandStore = useBrandStore();

// UI State
const isCreating = ref(false);
const newBrandName = ref("");

// Load brands on mount
onMounted(() => brandStore.fetchBrands());

const handleCreate = async () => {
    if (!newBrandName.value) return;
    await brandStore.createBrand({ 
        name: newBrandName.value,
        palette: ["#4f39f6", "#10b981", "#f59e0b"], // Default starting palette
        textColor: "#374151"
    });
    newBrandName.value = "";
    isCreating.value = false;
};

const updatePaletteColor = (brandId: string, index: number, color: string) => {
    const brand = brandStore.brands.find(b => b.id === brandId);
    if (!brand) return;
    
    const newPalette = [...brand.palette];
    newPalette[index] = color;
    brandStore.updateBrand(brandId, { palette: newPalette });
};

const addColor = (brandId: string) => {
    const brand = brandStore.brands.find(b => b.id === brandId);
    if (!brand) return;
    brandStore.updateBrand(brandId, { palette: [...brand.palette, "#cbd5e1"] });
};

const removeColor = (brandId: string, index: number) => {
    const brand = brandStore.brands.find(b => b.id === brandId);
    if (!brand || brand.palette.length <= 1) return;
    const newPalette = brand.palette.filter((_, i) => i !== index);
    brandStore.updateBrand(brandId, { palette: newPalette });
};
</script>

<template>
    <div class="p-8 max-w-6xl mx-auto">
        <header class="flex justify-between items-center mb-10">
            <div>
                <h1 class="text-3xl font-black text-gray-900 tracking-tight">Brand Styles</h1>
                <p class="text-gray-500 text-sm mt-1">Manage palettes and identities for your clients.</p>
            </div>
            <button 
                @click="isCreating = true"
                class="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
                + Create Brand
            </button>
        </header>

        <div v-if="isCreating" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 class="text-xl font-bold mb-4">New Brand Profile</h3>
                <input v-model="newBrandName" placeholder="Client or Project Name" class="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 mb-6" />
                <div class="flex gap-3">
                    <button @click="isCreating = false" class="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
                    <button @click="handleCreate" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold">Create</button>
                </div>
            </div>
        </div>

        <div class="grid gap-8">
            <div v-for="brand in brandStore.brands" :key="brand.id" 
                class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 grid grid-cols-12 gap-8 items-start">
                
                <div class="col-span-12 lg:col-span-7 space-y-6">
                    <div class="flex items-center justify-between">
                        <input 
                            :value="brand.name" 
                            @blur="(e) => brandStore.updateBrand(brand.id, { name: (e.target as HTMLInputElement).value })"
                            class="text-xl font-black bg-transparent border-none focus:ring-0 p-0"
                        />
                        <button @click="brandStore.deleteBrand(brand.id)" class="text-gray-300 hover:text-red-500 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Color Palette</label>
                        <div class="flex flex-wrap gap-3">
                            <div v-for="(color, index) in brand.palette" :key="index" class="group relative">
                                <input 
                                    type="color" 
                                    :value="color" 
                                    @input="(e) => updatePaletteColor(brand.id, index, (e.target as HTMLInputElement).value)"
                                    class="w-14 h-14 rounded-xl border-4 border-gray-50 cursor-pointer overflow-hidden"
                                />
                                <button 
                                    @click="removeColor(brand.id, index)"
                                    class="absolute -top-2 -right-2 bg-white shadow-md rounded-full p-1 opacity-0 group-hover:opacity-100 transition text-red-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>
                            <button @click="addColor(brand.id)" class="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition">
                                <span class="text-xl">+</span>
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Text Color</label>
                            <div class="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl">
                                <input type="color" :value="brand.textColor" @input="(e) => brandStore.updateBrand(brand.id, { textColor: (e.target as HTMLInputElement).value })" class="w-8 h-8 rounded-lg border-none" />
                                <span class="text-xs font-mono text-gray-500 uppercase">{{ brand.textColor }}</span>
                            </div>
                        </div>
                        <div>
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Font Family</label>
                            <select :value="brand.fontFamily" @change="(e) => brandStore.updateBrand(brand.id, { fontFamily: (e.target as HTMLSelectElement).value })" class="w-full bg-gray-50 p-3 rounded-2xl border-none text-xs font-bold">
                                <option value="Inter">Inter (Modern)</option>
                                <option value="Georgia">Georgia (Classic)</option>
                                <option value="Monaco">Monaco (Tech)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-5 bg-gray-50 rounded-[1.5rem] p-6 flex flex-col items-center justify-center border border-gray-100 min-h-[200px]">
                    <div class="w-full space-y-4">
                        <div class="flex items-center gap-3">
                           <div :style="{ backgroundColor: brand.palette[0] }" class="w-10 h-10 rounded-full shadow-lg"></div>
                           <h2 :style="{ color: brand.textColor, fontFamily: brand.fontFamily }" class="text-lg font-bold">Chart Preview</h2>
                        </div>
                        <div class="flex items-end gap-2 h-24">
                            <div v-for="(color, i) in brand.palette" :key="i" :style="{ backgroundColor: color, height: `${20 + (i * 15)}%` }" class="flex-1 rounded-t-md"></div>
                        </div>
                        <p :style="{ color: brand.textColor, fontFamily: brand.fontFamily }" class="text-[10px] text-center opacity-70 italic">Example chart text style with your palette.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>