<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getLabel } from '../../../utils';
import { VET_TYPES } from '../config';

const props = defineProps<{ type: string }>();
const { t } = useI18n();

const getTagStyle = () => {
    return {
        "tag capitalize": true,
        "primary": props.type === "primary",
        "secondary": props.type === "secondary",
        "emergency": props.type === "emergency",
    };
};
</script>

<template>
    <span :class="getTagStyle()">{{ t(getLabel(type, VET_TYPES)) }}</span>
</template>

<style scoped>
.primary {
    background: rgba(79, 147, 190, 0.2);
    color: rgb(93, 144, 175);
}

.secondary {
    background: rgba(190, 179, 79, 0.2);
    color: rgb(190, 179, 79);
}

.emergency {
    background: rgba(226, 75, 74, 0.2);
    color: rgb(163, 45, 45);
}
</style>