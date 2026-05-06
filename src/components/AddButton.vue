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
    background: linear-gradient(145deg, #d8a756 0%, var(--color-gold) 40%, #b07f2c 100%);
    transition: 1s ease;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background: var(--background-image-brand-gradient);
        opacity: 0;
        z-index: -1;
        transition: 1s ease;
    }

    &:hover {
        transform: scale(1.05);

        &::before {
            opacity: 1;
        }
    }
}
</style>