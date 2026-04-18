<script setup lang="ts">
import { Plus, X } from '@lucide/vue';
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
            card: "btn-fill-card rounded-xl border border-border gap-1.5 justify-between items-start text-left",
        },
        size: {
            xxs: "text-xs p-0.5",
            xs: "px-0.5 text-sm py-0.5",
            sm: "px-1 py-0.5",
            md: "px-2 py-[10px]",
            card: "p-1 mb-1 w-full md:max-w-md"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
});

withDefaults(defineProps<{
    action?: "normal" | "hide" | "addEvent"
    variant?: keyof typeof button.variants.variant
    size?: keyof typeof button.variants.size
}>(), { action: "normal" })
</script>


<template>
    <button v-if="action === 'normal'" tabindex="0" :class="button({ variant, size })">
        <slot />
    </button>

    <button v-else-if="action === 'addEvent'" tabindex="0"
        class="gold-btn w-3.5 h-3.5 rounded-full bg-gold shadow-lg text-bg fixed bottom-6 md:bottom-2 right-1 md:right-1.5 flex items-center gap-[5px] justify-center">
        <Plus :size="32" />
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

    &:hover {
        color: var(--color-brand);
        border-color: var(--color-brand-rgba);
        transform: scale(1.02);

        &::before {
            animation: move-overlay 10s ease-out infinite;
            opacity: 1;
        }
    }
}

.addon-focus:focus-visible {
    outline: none;
    color: var(--color-brand);
}

.gold-btn {
    background: linear-gradient(145deg, #d8a756 0%, var(--color-gold) 40%, #b07f2c 100%);
    transition: 1s ease;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background: var(--background-image-brand-gradient);
        opacity: 0;
        z-index: -1;
        transition: 1s ease;
    }

    &:hover {
        transform: scale(1.05);

        &::before {
            opacity: 1;
        }
    }
}
</style>