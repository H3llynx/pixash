<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import Header from '../components/Header.vue';
import EventListSkeleton from '../components/loading/EventListSkeleton.vue';
import Calendar from '../features/health/components/Calendar.vue';
import EventList from '../features/health/components/EventList.vue';
import { showTypes } from '../features/health/utils';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePet';
import { tsToDate } from '../utils';

const { pets, vaccines, vetVisits, selectedDate, loading } = usePets();
const { t } = useI18n();

const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const petId = ref<string>("");

const calendarEvents = computed(() => [
    ...vaccines.value.filter(vaccine => vaccine.dueOn)
        .map(vaccine => ({
            id: vaccine.id,
            title: showTypes(vaccine.types, pets.value.find(pet => pet.id === vaccine.petId)),
            date: tsToDate(vaccine.dueOn!, "input"),
            event: vaccine,
        })),
    ...vetVisits.value.map(visit => ({
        id: visit.id,
        title: visit.title,
        date: tsToDate(visit.date, "input"),
        event: visit,
    }))
]);

const eventsThisMonth = computed(() => [
    ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "isThatMonth", currentMonth.value)),
    ...vetVisits.value.filter(visit => tsToDate(visit.date, "isThatMonth", currentMonth.value))
].sort((a, b) => a.ts.seconds - b.ts.seconds));

const getTitle = () => {
    const now = new Date().getMonth();
    return now === currentMonth.value.getMonth() ? t("events.thisMonth") : currentMonthName.value
};

const filteredCalendarEvents = computed(() => petId.value
    ? calendarEvents.value.filter(e => e.event.petId === petId.value)
    : calendarEvents.value
);

const filteredMonthEvents = computed(() => petId.value
    ? eventsThisMonth.value.filter(e => e.petId === petId.value)
    : eventsThisMonth.value
);

onBeforeRouteLeave(() => {
    selectedDate.value = "null";
});
</script>

<template>
    <Header />
    <main class="lg:grid lg:grid-cols-[1fr_35%]">
        <section class="p-0 my-1">
            <PetSelector calendar v-model:petId="petId" />
            <Calendar :events="filteredCalendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" />
        </section>
        <section class="p-0 md:default-padding lg:bg-bg-rgba lg:p-1.5 lg:border-l lg:border-border lg:h-full">
            <EventListSkeleton v-if="loading" />
            <EventList v-else :title="getTitle()" :events="filteredMonthEvents" mdLocation="right" />
        </section>
    </main>
</template>