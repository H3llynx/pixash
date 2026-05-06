<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
    <div>
        <h2 class="text-2xl md:text-3xl">{{ t("common.header.historyH2") }}</h2>
        <span class="tracking-wide font-extralight">{{ t("common.header.historySpan") }}</span>
    </div>
</template>