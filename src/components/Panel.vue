<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from './Button.vue';

withDefaults(defineProps<{
    canClose?: boolean
    onClose: () => void
}>(), { canClose: true });

const panelRef = ref<HTMLElement>();

onMounted(() => {
    panelRef.value?.focus();
    document.documentElement.scrollTop = 0;
});
</script>

<template>
    <section ref="panelRef" tabindex="-1"
        class="bg-bg-3 flex flex-col fixed bottom-0 max-h-[90dvh] right-0 left-0 z-2 border-t md:border border-border rounded-t-3xl px-0 md:w-2xl md:ml-auto">
        <Button v-if="canClose" action="hide" @click="onClose" />
        <div class="flex-1 min-h-0 overflow-y-scroll overflow-x-hidden pt-1 pb-2">
            <slot />
        </div>
    </section>
</template>