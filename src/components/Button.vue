<script setup lang="ts">
import { X } from '@lucide/vue';
import { tv } from 'tailwind-variants';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const button = tv({
    base: "font-medium rounded-full filter-blur flex items-center gap-[5px] justify-center disabled:opacity-40",
    variants: {
        variant: {
            primary: "btn-hover-fill bg-brand border border-brand text-btn-primary-text",
            secondary: "btn-hover-fill border border-brand text-brand bg-bg-rgba",
            ghost: "btn-hover-fill-ghost rounded-xl text-btn-ghost-text hover:text-brand-light bg-bg-rgba",
            addon: "text-text-secondary addon-focus",
            chip: "btn-hover-fill border border-border bg-bg-2 text-text-secondary capitalize",
            summaryCta: "btn-hover-fill bg-brand-rgba text-brand-light",
            card: "btn-hover-fill-card rounded-xl border border-border bg-bg-2 gap-1.5 justify-between items-start text-left"
        },
        size: {
            xxs: "text-xs p-0.5",
            xs: "px-0.5 text-sm py-0.5",
            sm: "px-1 py-0.5",
            md: "px-2 py-[10px]",
            card: "p-1 mb-1 w-full"
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

    <button v-else :aria-label="t('common.panel.hide')" tabindex="0"
        class="flex justify-center m-auto py-0.5 px-2 h-1.5 md:m-0 md:w-full md:justify-end">
        <div class="h-[7px] w-4 rounded-full bg-border md:hidden"></div>
        <X class="hidden md:block" />
    </button>
</template>

<style scoped>
.btn-hover-fill:hover {
    background: var(--color-btn-hover);
    color: var(--color-btn-hover-text);
    border-color: var(--color-btn-hover)
}

.btn-hover-fill-card:hover {
    background: var(--color-brand-rgba);
    color: var(--color-brand);
    border-color: var(--color-btn-hover)
}

.addon-focus:focus-visible {
    outline: none;
    color: var(--color-brand);
}
</style>