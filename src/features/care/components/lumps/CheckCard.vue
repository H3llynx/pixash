<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { LUMP_STATUS } from '../../config.ts';
import type { LumpCheck } from '../../types';
import { fromMm } from '../../utils.ts';

const { t } = useI18n();

defineProps<{ check: LumpCheck }>();
</script>

<template>
    <div class="card border border-border p-0 overflow-hidden w-10">
        <div class="w-full card-border h-7 flex justify-center items-center overflow-hidden">
            <img v-if="check.pictures?.length" :src="check.pictures.at(-1)" class="w-full object-cover">
            <span v-else>📷</span>
        </div>
        <div class="px-1 pb-1 pt-0.25 text-left">
            <span v-if="check.size" class="text-text-secondary text-xs">{{ fromMm(Number(check.size.valueMm),
                check.size.displayUnit) }} {{
                    check.size.displayUnit }}</span>
            <span v-if="check.status" class="lump-status tag uppercase font-medium mt-0.75"
                :style="{ '--bg-color': LUMP_STATUS.find(s => s.id === check.status)?.rgba, '--text-color': LUMP_STATUS.find(s => s.id === check.status)?.rgb }">
                {{t(LUMP_STATUS.find(s => s.id === check.status)!.label)}}
            </span>
        </div>
    </div>
</template>