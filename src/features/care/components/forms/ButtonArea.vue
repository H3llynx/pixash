<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import type { LogExtended, TreatmentExtended, VisitExtended } from '../../types.ts';

const { t } = useI18n();

defineProps<{
    selectedCare: LogExtended | VisitExtended | TreatmentExtended;
    loading: boolean;
    customCta: string;
}>();

const mode = defineModel();
</script>

<template>
    <div class="flex gap-0.5 mt-1 items-center md:ml-auto" v-if="!selectedCare || mode === 'edit'">
        <Button type="button" class="w-full md:w-auto" v-if="selectedCare && mode === 'edit'" variant="secondary"
            size="sm" :disabled="loading" @click="mode = 'view'">
            {{ t("common.button.cancel") }}
        </Button>
        <Button size="sm" class="w-full md:w-auto" :disabled="loading">{{ customCta }}</Button>
    </div>
    <Button v-if="selectedCare && mode === 'view'" size="sm" class="mt-1 md:ml-auto" @click="mode = 'edit'">
        {{ t("common.button.edit") }}
    </Button>
</template>