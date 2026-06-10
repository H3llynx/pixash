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
        <Button variant="ghost" size="sm" @click="eventType = null" :class="{ active: eventType === null }">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.allChip") }}
        </Button>
        <Button variant="ghost" size="sm" v-for="type in EVENT_TYPES" :class="{ active: type.id === eventType }"
            @click="eventType = type.id">
            {{ t(type.label) }}
        </Button>
    </div>
</template>

<style scoped>
button {
    background: transparent;

    &:not(.active) {
        background: transparent;
    }
}

.active {
    position: relative;
    color: var(--color-brand-light);

    &::after {
        content: "";
        position: absolute;
        animation: apearLeft 0.3s ease forwards;
        height: 2px;
        bottom: 0;
        left: 0;
        background: var(--color-brand-light);
        border-radius: 2rem;
    }
}

@keyframes apearLeft {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}
</style>