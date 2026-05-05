<script setup lang="ts">
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap.js';
import { onMounted, onUnmounted, ref } from 'vue';
import Button from './Button.vue';

withDefaults(defineProps<{
    canClose?: boolean
    onClose: () => void
}>(), { canClose: true });

const panelRef = ref<HTMLElement>();
const { activate, deactivate } = useFocusTrap(panelRef, {
    immediate: true,
    allowOutsideClick: false,
});

onMounted(() => {
    document.documentElement.scrollTop = 0;
    activate();
});

onUnmounted(() => {
    deactivate();
});
</script>

<template>
    <section ref="panelRef"
        class="bg-bg-3 sticky bottom-0 right-0 z-2 border-t md:border border-border rounded-t-3xl pt-1 pb-2 px-0 md:w-2xl md:ml-auto mt-auto">
        <Button v-if="canClose" action="hide" @click="onClose" />
        <slot />
    </section>
</template>