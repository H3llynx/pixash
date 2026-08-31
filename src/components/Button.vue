<script setup lang="ts">
import { X } from '@lucide/vue';
import { tv } from 'tailwind-variants';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const button = tv({
    base: "font-medium filter-blur rounded-xl flex items-center gap-[5px] justify-center disabled:opacity-40 disabled:cursor-not-allowed",
    variants: {
        variant: {
            primary: "btn-hover-fill bg-brand border border-brand text-bg rounded-full ",
            secondary: "btn-hover-fill border border-brand text-brand bg-bg-rgba rounded-full ",
            tertiary: "btn-hover-fill text-btn-ghost-text enabled:hover:text-brand-light bg-bg-rgba border border-border rounded-full",
            ghost: "btn-hover-fill-ghost text-btn-ghost-text enabled:hover:text-brand-light bg-bg-rgba",
            addon: "text-text-secondary addon-focus rounded-full",
            stacked: "stacked text-text-secondary capitalize justify-end disabled:opacity-100",
            tile: "btn-hover-fill tile capitalize justify-end items-end disabled:opacity-100",
            summaryCta: "btn-hover-fill bg-brand-rgba text-brand-light rounded-full",
            vetOptions: "btn-hover-fill flex-1 border border-border-btn-vet bg-btn-vet",
            add: "flex-start border border-dashed border-text-secondary text-text-secondary hover:text-brand-light hover:border-brand-light"
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

    <button v-else :aria-label="t('common.button.close')" tabindex="0" class="hide-btn">
        <div class="h-[7px] w-4 rounded-full bg-border md:hidden"></div>
        <X class="hidden md:block focus-within:bg-gold" />
    </button>
</template>

<style scoped>
.tile {
    width: 9rem;
    height: 8rem;
    border: 1px solid var(--color-border);
    background: var(--color-bg-2);
    text-transform: capitalize;
    overflow: hidden;
    font-family: var(--font-title);
    font-size: large;

    &:not(.active, :hover) {
        opacity: 0.6;
        filter: grayscale(0.9);
    }

    &.active {
        background: var(--color-brand);
    }
}

.stacked {
    flex-direction: column;

    &.active {
        color: var(--color-brand);
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
    padding: 1rem 2rem 1.5rem 0.5rem;
    height: 1.5rem;
    width: 100%;
}

.active {
    color: var(--color-bg);
}

@media (width >=48rem) {
    .hide-btn {
        align-items: center;
        padding: 0.5rem;
        margin: 1rem 1rem auto auto;
        width: auto;
    }
}

@media (hover: hover) and (pointer: fine) {
    button:not(:disabled, .calendar-active).btn-hover-fill:hover {
        background: var(--color-btn-hover);
        color: var(--color-bg);
        border-color: var(--color-btn-hover)
    }
}
</style>