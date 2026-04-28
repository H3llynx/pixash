<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAuth } from '../composables/useAuth';
const { user } = useAuth();
const { t } = useI18n();
</script>

<template>
    <div v-if="user">
        <span class="tracking-wide font-extralight text-lg">{{ t("common.header.greetings") }}</span>
        <h2 class="text-3xl">{{ user.firstName }}</h2>
    </div>
</template>