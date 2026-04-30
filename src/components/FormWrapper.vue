<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import Button from './Button.vue';

withDefaults(defineProps<{
    canClose?: boolean
    onClose: () => void
}>(), { canClose: true });

const readonly = inject("readonly", ref(false));

onMounted(() => {
    document.documentElement.scrollTop = 0;
})
</script>

<template>
    <section
        class="bg-bg-3 sticky bottom-0 right-0 z-2 border-t md:border border-border rounded-t-3xl pt-1 pb-2 px-0 md:max-w-2xl md:ml-auto mt-3">
        <Button v-if="canClose" action="hide" @click="onClose" />
        <slot />
    </section>
</template>