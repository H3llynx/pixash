<script setup lang="ts">
import Button from './Button.vue';

withDefaults(defineProps<{
    canClose?: boolean
    onClose: () => void
}>(), { canClose: true });
</script>


<template>
    <section
        class="sticky bottom-0 right-0 z-2 bg-bg-3 border-t md:border border-border rounded-t-3xl pt-1 pb-2 px-0 md:max-w-2xl md:ml-auto mt-3">
        <Button v-if="canClose" action="hide" @click="onClose" />
        <slot />
    </section>
</template>