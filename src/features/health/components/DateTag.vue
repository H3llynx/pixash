<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../utils';
import type { PetEvent } from '../types';

const { t } = useI18n();

const props = defineProps<{ event: PetEvent }>();

const getTagStyle = () => {
    const daysUntil = tsToDate(props.event.ts, "daysUntil", t);
    const isThisWeek = tsToDate(props.event.ts, "isThisWeek");
    const isNotPast = !tsToDate(props.event.ts, "isPast");

    return {
        "days-until w-max": true,
        "tag": isNotPast,
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
.days-until {
    font-size: x-small;
    font-weight: 500;
    display: flex;
    flex-shrink: 0;
    color: var(--color-text-secondary)
}

.tag {
    padding: 2px 0.5rem;
    border-radius: 10px;
    border: 1px solid var(--color-text-secondary);
}

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