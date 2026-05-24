<script setup lang="ts">
import type { Timestamp } from 'firebase/firestore';
import { useI18n } from 'vue-i18n';
import { tsToDate } from '../../../../utils';

const { t } = useI18n();

const props = withDefaults(defineProps<{
    date: Timestamp
    withMissed?: boolean
}>(), { withMissed: false });

const getTagStyle = () => {
    const daysUntil = tsToDate(props.date, "timeUntil", t);
    const isThisWeek = tsToDate(props.date, "isThisWeek");
    const isNotPast = !tsToDate(props.date, "isPast");
    const isMissed = props.withMissed && tsToDate(props.date, "isPast") && props.date.toDate() < new Date();

    return {
        "tag text-text-secondary": true,
        "border border-border": isNotPast,
        "this-week": daysUntil !== t("tsToDate.today") && daysUntil !== t("tsToDate.tomorrow") && isThisWeek,
        "tomorrow": daysUntil === t("tsToDate.tomorrow"),
        "today": daysUntil === t("tsToDate.today"),
        "is-missed": isMissed
    };
};
</script>

<template>
    <span :class="getTagStyle()">{{ tsToDate(date, 'timeUntil', t) }}</span>
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

.is-missed {
    background: var(--color-error);
    border: 1px solid var(--color-error-border);
    color: var(--color-error-bg);
}
</style>