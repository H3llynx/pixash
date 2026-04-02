<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
    base: "font-medium rounded-full filter-blur flex items-center gap-[5px] justify-center",
    variants: {
        variant: {
            primary: "btn-hover-fill bg-brand border border-brand text-btn-primary-text",
            secondary: "btn-hover-fill border border-brand text-brand bg-bg-rgba",
            ghost: "btn-hover-fill-ghost text-btn-ghost-text hover:text-brand-light bg-bg-rgba",
            addon: "text-text-secondary addon-focus",
            chip: "btn-hover-fill border border-border bg-bg-2 text-text-secondary capitalize",
        },
        size: {
            xs: "px-0.5 text-sm py-0.5",
            sm: "px-1 py-0.5",
            md: "px-2.5 py-[10px]",
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
});

withDefaults(defineProps<{
    action?: "normal" | "hide"
    variant?: keyof typeof button.variants.variant
    size?: keyof typeof button.variants.size
}>(), { action: "normal" })
</script>


<template>
    <button v-if="action === 'normal'" tabindex="0" :class="button({ variant, size })">
        <slot />
    </button>

    <button v-else aria-label="Hide form" tabindex="0" class="flex justify-center m-auto py-0.5 px-2 h-1.5">
        <div class="h-[7px] w-4 rounded-full bg-border"></div>
    </button>
</template>

<style scoped>
.btn-hover-fill:hover {
    background: var(--color-btn-hover);
    color: var(--color-btn-hover-text);
    border-color: var(--color-btn-hover)
}

.addon-focus:focus-visible {
    outline: none;
    color: var(--color-brand);
}
</style>