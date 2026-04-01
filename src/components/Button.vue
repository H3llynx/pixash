<script setup lang="ts">
import { tv } from 'tailwind-variants';

const button = tv({
    base: "rounded-full font-medium py-0.5 filter-blur flex items-center gap-[5px]",
    variants: {
        variant: {
            primary: "btn-hover-fill bg-brand border border-brand text-btn-primary-text",
            secondary: "btn-hover-fill border border-brand text-brand bg-bg-rgba",
            ghost: "btn-hover-fill-ghost text-btn-ghost-text hover:text-brand-light bg-bg-rgba",
            addon: "text-text-secondary addon-focus",
            chip: "btn-hover-fill border border-border bg-bg-2 text-text-secondary",
        },
        size: {
            xs: "px-0.5 text-sm",
            sm: "px-1",
            md: "px-2.5",
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
});

const props = defineProps<{
    variant?: keyof typeof button.variants.variant
    size?: keyof typeof button.variants.size
}>()
</script>


<template>
    <button tabindex="0" :class="button({ variant, size })">
        <slot />
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