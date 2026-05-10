<script setup lang="ts">
import { X } from '@lucide/vue';
import { tv } from 'tailwind-variants';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const button = tv({
    base: "font-medium rounded-full filter-blur flex items-center gap-[5px] justify-center disabled:opacity-40",
    variants: {
        variant: {
            primary: "btn-hover-fill bg-brand border border-brand text-bg",
            secondary: "btn-hover-fill border border-brand text-brand bg-bg-rgba",
            ghost: "btn-hover-fill-ghost rounded-xl text-btn-ghost-text hover:text-brand-light bg-bg-rgba",
            addon: "text-text-secondary addon-focus",
            chip: "btn-hover-fill border border-border bg-bg-2 text-text-secondary capitalize",
            summaryCta: "btn-hover-fill bg-brand-rgba text-brand-light",
            vetOptions: "btn-hover-fill flex-1 rounded-xl border border-border-btn-vet bg-btn-vet",
            add: "flex-start rounded-xl border border-dashed border-text-secondary text-text-secondary hover:text-brand-light hover:border-brand-light"
        },
        size: {
            xxs: "text-xs p-0.5",
            xs: "px-0.5 text-sm py-0.5",
            sm: "px-1 py-0.5",
            md: "px-2 py-[10px]",
            lg: "px-2 py-1",
            vetOptions: "px-0.5 py-1 text-sm"
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

    <button v-else :aria-label="t('common.panel.hide')" tabindex="0" class="hide-btn">
        <div class="h-[7px] w-4 rounded-full bg-border md:hidden"></div>
        <X class="hidden md:block focus-within:bg-gold" />
    </button>
</template>

<style scoped>
.btn-fill-card {
    background: var(--color-bg-2);
    position: relative;
    overflow: hidden;
    transition: 1s ease;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background-image: var(--background-image-card);
        background-size: 150% 100%;
        opacity: 0;
        z-index: -1;
        transition: 1s ease;
    }
}

.addon-focus:focus-visible {
    outline: none;
    color: var(--color-brand);
}

.hide-btn {
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 1rem 2rem 0.5rem;
    height: 1.5rem;
}

@media (width >=48rem) {
    .hide-btn {
        align-items: center;
        padding: 0.5rem;
        margin: 1rem 1rem auto auto;
    }
}

@media (hover: hover) and (pointer: fine) {
    .btn-hover-fill:hover {
        background: var(--color-btn-hover);
        color: var(--color-btn-hover-text);
        border-color: var(--color-btn-hover)
    }
}
</style>