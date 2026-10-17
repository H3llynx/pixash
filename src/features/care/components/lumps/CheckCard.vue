<script setup lang="ts">
import { Pen, X } from '@lucide/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { tsToDate } from '../../../../utils.ts';
import { usePets } from '../../../pets/composables/usePets.ts';
import { useLumpCheck } from '../../composables/useLumpCheck.ts';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpCheckExtended } from '../../types.ts';
import { fromMm } from '../../utils.ts';

const { t } = useI18n();
const { lumpChecks, deleteCheck, selectedCheck, openModal } = useLumpCheck();
const { lumps, savingLogIds } = usePets();

const props = defineProps<{ check: LumpCheckExtended }>();
const lump = computed(() => lumps.value.find(lump => lump.id === props.check.lumpId));
const relatedChecks = computed(() => lumpChecks.value.filter(check => check.lumpId === props.check.lumpId))

const editCheck = () => {
    if (!lump.value) return;
    selectedCheck.value = props.check;
    openModal(lump.value, 'edit');
};

const removeCheck = () => {
    if (relatedChecks.value.length <= 1) return;
    else deleteCheck(props.check);
}
</script>

<template>
    <div
        :class="{ 'card border border-border p-0 w-13 relative overflow-hidden': true, 'opacity-40 animate-pulse': savingLogIds.has(check.id) }">
        <div
            class="w-full bg-picture-placeholder border-b border-border-light h-6 flex justify-center items-center overflow-hidden">
            <img v-if="check.pictures?.length" :src="check.pictures[0]" class="w-full object-cover">
            <span v-else>📷</span>
        </div>
        <div class="px-1 pb-1 pt-0.25 text-left">
            <div class="flex justify-between gap-1">
                <span v-if="check.size" class="text-text-secondary text-xs">{{ fromMm(Number(check.size.valueMm),
                    check.size.displayUnit) }} {{
                        check.size.displayUnit }}</span>
                <span class="text-text-softer capitalize text-xs">{{ tsToDate(check.date, "dateShort") }}</span>
            </div>
            <span v-if="check.status" class="lump-status tag uppercase font-medium mt-0.75"
                :style="{ '--bg-color': LUMP_STATUS.find(s => s.id === check.status)?.rgba, '--text-color': LUMP_STATUS.find(s => s.id === check.status)?.rgb }">
                {{t(LUMP_STATUS.find(s => s.id === check.status)!.label)}}
            </span>
        </div>
        <div class="absolute top-[3px] right-[3px] flex gap-[3px]">
            <Button variant="ghost" size="min" :aria-label="t('health.cta.editMedTime')" @click="editCheck">
                <Pen :size="12" />
            </Button>
            <Button v-if="relatedChecks.length > 1" variant="ghost" size="min" :aria-label="t('common.button.delete')"
                @click="removeCheck">
                <X :size="12" />
            </Button>
        </div>
    </div>
</template>