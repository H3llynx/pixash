<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Paw from '../../../../components/icons/Paw.vue';
import { useHistory } from '../../composables/useHistory';
import { EVENT_TYPES } from '../../config';

const { t } = useI18n();
const { eventType } = useHistory();
</script>

<template>
    <div class="pet-selector">
        <Button variant="chip" size="sm" @click="eventType = null" :class="{ active: eventType === null }">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button variant="chip" size="sm" v-for="type in EVENT_TYPES" :class="{ active: type.id === eventType }"
            @click="eventType = type.id">
            {{ t(type.label) }}
        </Button>
    </div>
</template>

<style scoped>
.active {
    background: var(--color-brand);
    color: var(--color-text-chip);
    border-color: var(--color-brand);
    font-weight: 500;
}
</style>