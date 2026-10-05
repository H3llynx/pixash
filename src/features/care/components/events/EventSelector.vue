<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import Paw from '../../../../components/icons/Paw.vue';
import { useHistory } from '../../composables/useHistory.ts';
import { EVENT_TYPES } from '../../config.ts';

const { t } = useI18n();
const { eventType } = useHistory();
</script>

<template>
    <div class="pet-selector pt-0 pb-2">
        <Button variant="ghost" size="sm" @click="eventType = null" :class="{ active: eventType === null }">
            <Paw class="w-1 -rotate-20" /> {{ t("common.button.all") }}
        </Button>
        <Button variant="ghost" size="sm" v-for="type in EVENT_TYPES" :key="type.id"
            :class="{ active: type.id === eventType }" @click="eventType = type.id">
            {{ t(type.label) }}
        </Button>
    </div>
</template>

<style scoped>
button {
    background: transparent;
    font-weight: 400;

    &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 2rem;
        transition: 0.6s;
    }

    &:not(.active) {
        background: transparent;
    }

    &:focus-visible {
        outline: none;
        color: var(--color-interactive);

        &::after {
            animation: apearLeft 0.3s ease forwards;
            height: 2px;
            background: var(--color-interactive);
        }
    }
}

.active {
    position: relative;
    color: var(--color-accent);

    &::after {
        animation: apearLeft 0.3s ease forwards;
        height: 2px;
        background: var(--color-accent);
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