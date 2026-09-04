<script setup lang="ts">
import { Trash2, X } from '@lucide/vue';
import { tv } from 'tailwind-variants';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const button = tv({
    base: "font-medium filter-blur rounded-xl border border-transparent inline-flex items-center gap-[5px] justify-center disabled:opacity-40 disabled:cursor-not-allowed",
    variants: {
        variant: {
            primary: "bg-accent text-bg rounded-full enabled:hover:bg-interactive",
            secondary: "bg-bg-2 text-text rounded-full enabled:hover:bg-interactive enabled:hover:text-bg",
            tertiary: "text-text-softer enabled:hover:text-interactive bg-bg-rgba border-border rounded-full",
            ghost: "enabled:hover:text-accent bg-bg-rgba disabled:opacity-100 disabled:bg-transparent",
            addon: "text-text-secondary addon-focus rounded-full",
            stacked: "stacked-btn text-text-secondary capitalize",
            tile: "tile-btn capitalize justify-end items-end",
            add: "font-light border-dashed border-text-secondary text-text-secondary enabled:hover:text-accent enabled:hover:border-accent enabled:hover:bg-bg-2",
            card: "bg-bg-rgba border-border gap-1 md:max-w-md hover:scale-105 hover:bg-bg-2"
        },
        size: {
            rounded: "w-2 h-2 aspect-square text-xs",
            min: "p-[5px]",
            xxs: "p-0.5 text-xs",
            xs: "p-0.5 text-sm ",
            sm: "px-1 py-0.5",
            md: "px-2 py-[10px]",
            lg: "px-2 py-1",
            tile: "w-9 h-8 px-1 py-0.5",
            third: "w-1/3 px-0.5 py-1 text-sm"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
});

defineProps<{
    action?: "hide" | "delete"
    variant?: keyof typeof button.variants.variant
    size?: keyof typeof button.variants.size
}>();
</script>


<template>
    <button v-if="action === 'delete'" variant="ghost" size="xs"
        :class="[button({ variant: 'ghost', size: 'xs' }), 'ml-auto mb-auto text-text-secondary']">
        <Trash2 :size="22" />
    </button>

    <button v-else-if="action === 'hide'" :aria-label="t('common.button.close')" tabindex="0" class="hide-btn">
        <div class="h-[7px] w-4 rounded-full bg-border md:hidden"></div>
        <X class="hidden md:block focus-within:bg-gold" />
    </button>

    <button v-else tabindex="0" :class="button({ variant, size })">
        <slot />
    </button>
</template>

<style scoped>
.tile-btn {
    position: relative;
    display: inline-flex;
    border: 1px solid var(--color-border);
    background: var(--color-bg-2);
    text-transform: capitalize;
    text-align: right;
    overflow: hidden;
    font-family: var(--font-title);
    font-size: large;

    &:has(img),
    &:hover,
    &.active {
        color: var(--color-off-white);
    }

    &:hover {
        background: var(--color-accent-dark);
    }

    &.active {
        background: var(--color-accent);
        border: 1px solid var(--color-accent);
        box-shadow: 3px 3px 10px var(--color-accent-rgba);
    }

    &:not(.active, :hover)::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(140deg, var(--color-bg-rgba) 20%, transparent 50%);
    }
}

.stacked-btn {
    flex-direction: column;

    &:not(.active) {
        font-weight: 400;
    }

    &.active {
        color: var(--color-accent);
    }
}

.tile-btn:not(.active, :hover),
.stacked-btn:not(.active, :hover) {
    filter: grayscale(60%);
    opacity: 0.6;
}

.addon-focus:focus-visible {
    outline: none;
    color: var(--color-accent);
}

.hide-btn {
    display: flex;
    justify-content: center;
    margin: auto;
    padding: 1rem 2rem 1.5rem 0.5rem;
    height: 1.5rem;
    width: 100%;
}

@media (width >=48rem) {
    .hide-btn {
        align-items: center;
        padding: 0.5rem;
        margin: 1rem 1rem auto auto;
        width: auto;
    }
}
</style>