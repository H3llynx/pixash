<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../../utils';
import type { PetEvent } from '../../types';

const { t } = useI18n();

const props = defineProps<{ event: PetEvent }>();

const getTagStyle = () => {
    const daysUntil = tsToDate(props.event.ts, "daysUntil", t);
    const isThisWeek = tsToDate(props.event.ts, "isThisWeek");
    const isNotPast = !tsToDate(props.event.ts, "isPast");

    return {
        "tag text-text-secondary": true,
        "border border-border": isNotPast,
        "this-week": daysUntil !== t("tsToDate.today") && daysUntil !== t("tsToDate.tomorrow") && isThisWeek,
        "tomorrow": daysUntil === t("tsToDate.tomorrow"),
        "today": daysUntil === t("tsToDate.today")
    };
};
</script>

<template>
    <span :class="getTagStyle()">{{ tsToDate(event.ts, 'daysUntil', t) }}</span>
</template>

<style scoped>
.today {
    background: rgba(190, 131, 79, 0.2);
    border: 1px solid rgba(190, 131, 79, 0.6);
    color: rgb(178, 134, 23);
}

.tomorrow {
    background: rgba(190, 179, 79, 0.2);
    border: 1px solid rgba(190, 179, 79, 0.6);
    color: rgb(190, 179, 79);
}

.this-week {
    background: rgba(50, 126, 70, 0.2);
    border: 1px solid rgba(50, 126, 70, 0.6);
    color: rgb(57, 159, 84);
}
</style>