<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import Header from '../components/Header.vue';
import EventListSkeleton from '../components/loading/EventListSkeleton.vue';
import { useMedia } from '../composables/useMedia';
import Calendar from '../features/health/components/events/Calendar.vue';
import CalendarLegend from '../features/health/components/events/CalendarLegend.vue';
import EventList from '../features/health/components/events/EventList.vue';
import EventMenu from '../features/health/components/events/EventMenu.vue';
import { showTypes } from '../features/health/utils';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';
import { getIcon } from '../features/pets/utils';
import { tsToDate } from '../utils';

const { pets, vaccines, vetVisits, logs, selectedDate, loading, healthLoading } = usePets();
const { t } = useI18n();
const { isMd } = useMedia();

const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const petId = ref<string>("");

const calendarEvents = computed(() => [
    ...vaccines.value.filter(vaccine => vaccine.dueOn && pets.value.some(pet => pet.id === vaccine.petId))
        .map(vaccine => {
            const pet = pets.value.find(pet => pet.id === vaccine.petId)!;
            return {
                id: vaccine.id,
                title: `${getIcon(pet)} ${showTypes(vaccine.types, pet)}`,
                date: tsToDate(vaccine.dueOn!, "input"),
                event: vaccine,
            };
        }),
    ...vetVisits.value.filter(visit => pets.value.some(pet => pet.id === visit.petId))
        .map(visit => ({
            id: visit.id,
            title: `${getIcon(pets.value.find(pet => pet.id === visit.petId)!)} ${visit.title}`,
            date: tsToDate(visit.date, "input"),
            event: visit,
        })),
    ...logs.value.filter(log => pets.value.some(pet => pet.id === log.petId))
        .map(log => ({
            id: log.id,
            title: `💊 ${log.type}`,
            date: tsToDate(log.givenAt, "input"),
            event: log,
        }))
]);

const eventsThisMonth = computed(() => [
    ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "thatMonth", undefined, currentMonth.value)),
    ...vetVisits.value.filter(visit => tsToDate(visit.date, "thatMonth", undefined, currentMonth.value))
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
const menu = reactive({ visible: false, x: 0, y: 0 });

const handleDateClick = (date: string, x: number, y: number) => {
    const isSameDay = selectedDate.value === date;
    if (isSameDay && menu.visible) {
        menu.visible = false;
        selectedDate.value = null;
        return;
    }
    menu.x = x;
    menu.y = y;
    nextTick(() => { menu.visible = true; });
};

onBeforeRouteLeave(() => {
    selectedDate.value = null;
});
</script>

<template>
    <Header />
    <main class="pb-3 md:pb-0 lg:gap-0 lg:grid lg:grid-cols-[50%_50%] xl:grid-cols-[1fr_35%]">
        <section class="p-0 bg-brand-dark md:bg-bg md:pt-0.5">
            <PetSelector calendar v-model:petId="petId" />
            <Calendar :events="filteredCalendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" @date-click="handleDateClick" />
        </section>
        <section
            class="flex flex-col-reverse p-0 h-full md:flex-col md:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <EventListSkeleton v-if="loading || healthLoading" />
            <EventList v-else :title="getTitle()" :events="filteredMonthEvents" mdLocation="right" />
            <CalendarLegend />
        </section>
    </main>
    <EventMenu v-model:visible="menu.visible" :style="isMd ? { left: menu.x + 'px', top: menu.y + 'px' } : {}" />
</template>