<script setup lang="ts">
import { Pen } from '@lucide/vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useMedia } from '../../../../composables/useMedia.ts';
import type { LogExtended, TreatmentExtended, VisitExtended } from '../../types.ts';

const { t } = useI18n();
const { isMd } = useMedia();

defineProps<{
    selectedCare: LogExtended | VisitExtended | TreatmentExtended | null;
    loading: boolean;
    customCta: string;
}>();

const mode = defineModel();
</script>

<template>
    <div class="flex gap-0.5 flex-col-reverse md:flex-row shrink-0 w-full md:w-max md:ml-auto" v-if="!selectedCare ||
        mode === 'edit'">
        <Button type=" button" class="w-full md:w-auto" v-if="selectedCare && mode === 'edit'" variant="secondary"
            size="sm" :disabled="loading" @click="mode = 'view'">
            {{ t("common.button.cancel") }}
        </Button>
        <Button size="sm" class="w-full md:w-auto" :disabled="loading">{{ customCta }}</Button>
    </div>
    <Button v-if="selectedCare && mode === 'view'" :size="isMd ? 'xs' : 'sm'" :aria-label="t('common.button.edit')"
        class="mt-1 md:absolute md:right-0.5 md:bottom-1" @click="mode = 'edit'">
        <Pen v-if="isMd" />
        <span v-else>{{ t("common.button.edit") }}</span>
    </Button>
</template>