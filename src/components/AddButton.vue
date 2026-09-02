<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { ref, watch } from 'vue';
import AddMenu from './AddMenu.vue';

const visible = ref<boolean>(false);
const menuBtnRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLButtonElement>();
const props = withDefaults(defineProps<{
    vet?: boolean
}>(), { vet: false });

const { activate, deactivate } = useFocusTrap(menuRef, {
    allowOutsideClick: false,
});

watch(() => visible.value, (visible) => {
    if (visible) activate();
    else deactivate();
});
</script>

<template>
    <div ref="menuRef">
        <button tabindex="0"
            class="fixed bottom-6 md:bottom-2 right-1 md:right-1.5 z-1 w-3.5 h-3.5 rounded-full shadow-lg text-bg flex items-center gap-[5px] justify-center"
            ref="menuBtnRef" @click="visible = !visible">
            <Plus :size="32" :class="{ 'rotate-45': visible, 'default-transition': true }" />
        </button>
        <AddMenu v-model:visible="visible" :toggleRef="menuBtnRef" :vet="props.vet" />
    </div>
</template>

<style scoped>
button {
    background: var(--background-image-eucalyptus-gradient);
    transition: 1s ease;
    overflow: hidden;

    &:hover {
        transform: scale(1.05);
        background: var(--background-image-gold-gradient);
    }
}
</style>