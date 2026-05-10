<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    id: string
    label: string
    breeds: { id: string, label: string }[]
    placeholder: string
}>();

const model = defineModel<string | undefined | null>();
const dropdownRef = ref<HTMLUListElement>();
const search = ref(model.value ? props.breeds.find(breed => breed.id === model.value)?.label : "");
const open = ref(false);

const filtered = computed(() =>
    search.value?.length
        ? props.breeds.filter(breed => breed.label.toLowerCase().includes(search.value!.toLowerCase()))
        : props.breeds
);

const handleSelect = (option: { id: string, label: string }) => {
    search.value = option.label;
    model.value = option.id;
    open.value = false;
};

const handleFocusOut = (e: FocusEvent) => {
    if (dropdownRef.value?.contains(e.relatedTarget as Node)) return;
    const selected = props.breeds.find(breed => breed.id === model.value);
    search.value = selected?.label ?? "";
    open.value = false;
};

const { activate, deactivate } = useFocusTrap(dropdownRef, {
    clickOutsideDeactivates: true
});

onClickOutside(dropdownRef, () => open.value = false);
onKeyStroke("Escape", () => { open.value = false; });

watch(() => open.value, (open) => {
    if (open) activate();
    else deactivate();
});
</script>

<template>
    <label :for="id">
        <p>{{ label }}</p>
        <div class="relative" ref="dropdownRef" @focusout="handleFocusOut">
            <input v-model="search" role="combobox" :aria-expanded="open && filtered.length > 0"
                aria-autocomplete="list" :aria-controls="`${id}-listbox`" :placeholder="placeholder"
                @focus="open = true" @keydown.esc="open = false" class="font-medium px-1 py-0.5 h-3" required />
            <ul v-if="open" role="listbox" :id="`${id}-listbox`"
                class="filter-blur bg-bg-rgba absolute z-1 w-full border border-border rounded-lg max-h-12 overflow-y-scroll">
                <li tabindex="0" role="option" :aria-selected="model === option.id" class="py-0.5 px-1"
                    v-for="option in filtered" :key="option.id" :id="option.id"
                    @mousedown.prevent="handleSelect(option)" @touchend.prevent="handleSelect(option)"
                    @keydown.enter="handleSelect(option)">
                    {{ option.label }}</li>
            </ul>
        </div>
    </label>
</template>

<style scoped>
ul::-webkit-scrollbar {
    width: 6px;
    background: transparent;
}

ul::-webkit-scrollbar-thumb {
    border-radius: 0.75rem;
    background: var(--color-brand-light);
}

li:focus-visible {
    background: var(--color-gold);
    outline: none;
}
</style>