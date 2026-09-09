<script setup lang="ts">
import { History } from '@lucide/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import type { MedicineDb } from '../../types.ts';
import ViewLogs from './modals/ViewLogs.vue';

const { t } = useI18n();

defineProps<{ medication: MedicineDb }>();

const isViewing = ref<boolean>(false);
</script>

<template>
    <div class="p-1">
        <Button variant="ghost" class="w-full" @click="isViewing = true">
            <History />
            {{ t("health.treatment.viewMedLog") }}
        </Button>
    </div>
    <ViewLogs v-model="isViewing" :medication="medication" />
</template>