<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../../components/Button.vue';
import { useMedia } from '../../../../composables/useMedia';
import type { PetEvent } from '../../types';
import EventCard from './EventCard.vue';
import HistoryCard from './HistoryCard.vue';

const { isMd } = useMedia();
const { t } = useI18n();

const props = withDefaults(defineProps<{
    title?: string
    events: PetEvent[]
    history?: boolean
    itemsPerPage?: number
}>(), { history: false });

const currentPage = ref<number>(1);
const itemsPerPage = computed(() => props.itemsPerPage ?? isMd.value ? 2 : 3)

const totalPages = computed(() => Math.ceil(props.events.length / itemsPerPage.value));
const paginatedEvents = computed(() => props.events.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
));

const goPrev = () => { if (currentPage.value > 1) currentPage.value-- };
const goNext = () => { if (currentPage.value < totalPages.value) currentPage.value++ };

watch(() => props.events, () => {
    currentPage.value = 1;
});
</script>

<template>
    <section class="pet-section">
        <h2 v-if="title">{{ title }}</h2>
        <div class="grid grid-cols-1 gap-1 auto-rows-fr">
            <template v-if="history">
                <HistoryCard v-if="events.length" v-for="event in events" :event="event" :key="event.id" />
                <p v-else class="text-text-secondary text-sm">{{ t("common.text.noHistoryText") }}</p>
            </template>
            <template v-else>
                <EventCard v-if="events.length" v-for="event in paginatedEvents" :event="event" :key="event.id" />
                <p v-else class="text-text-secondary text-sm">{{ t("common.text.noEventText") }}</p>
            </template>
        </div>
        <div v-if="totalPages > 1" class="flex gap-0.5 h-max justify-end mt-1">
            <Button variant="ghost" size="xs" :disabled="currentPage === 1" @click="goPrev"
                :aria-label="t('common.button.back')">
                <ChevronLeft />
            </Button>
            <Button variant="ghost" size="xs" :disabled="currentPage === totalPages" @click="goNext"
                :aria-label="t('common.button.next')">
                <ChevronRight />
            </Button>
        </div>
    </section>
</template>