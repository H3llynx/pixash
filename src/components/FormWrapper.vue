<script setup lang="ts">
import Button from './Button.vue';

withDefaults(defineProps<{
    canClose?: boolean;
    onClose: () => void;
}>(), { canClose: true });
</script>


<template>
    <section class="sticky bottom-0 z-1 mt-auto
           bg-bg-3 border-t border-border rounded-t-3xl pt-1 pb-2 p-0">
        <Button v-if="canClose" action="hide" @click="onClose" />
        <slot />
    </section>
</template>