<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
    <div class="pet-section default-padding flex gap-1 mb-3 items-center md:items-start md:p-0 md:flex-col" aria-hidden>
        <h2 class="hidden md:block p-0">{{ t("events.legend") }}</h2>
        <div class="row">
            <div class="w-1 h-1 rounded-md border border-brand-light bg-brand-rgba"></div>
            <span>{{ t("events.visits") }}</span>
        </div>
        <div class="row">
            <div class="w-1 h-1 rounded-md border border-gold bg-gold-rgba"></div>
            <span>{{ t("events.vaccines") }}</span>
        </div>
        <div class="row">
            <div class="w-1 h-1 rounded-md border border-border bg-separator"></div>
            <span>{{ t("events.vaccines") }}</span>
        </div>
    </div>
</template>

<style scoped>
.row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    color: var(--color-text-secondary);
}
</style>