<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import Header from '../components/Header.vue';
import { useMedia } from '../composables/useMedia';
import Calendar from '../features/care/components/events/Calendar.vue';
import CalendarLegend from '../features/care/components/events/CalendarLegend.vue';
import CalendarMenu from '../features/care/components/events/CalendarMenu.vue';
import EventList from '../features/care/components/events/EventList.vue';
import TreatmentsThisMonth from '../features/care/components/treatments/TreatmentsThisMonth.vue';
import { useAllPetsView } from '../features/care/composables/useAllPetsView.js';
import { useEvents } from '../features/care/composables/useEvents.ts';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';

const { resetPetActions } = usePets();
const { selectedDate, currentMonth, currentMonthName } = useEvents();
const { filteredCalendarEvents, filteredMonthEvents } = useAllPetsView();
const { t } = useI18n();
const { isMd, is2xl } = useMedia();

const getTitle = () => {
    const now = new Date().getMonth();
    return now === currentMonth.value.getMonth() ? t("events.thisMonth") : currentMonthName.value as string;
};

const menu = reactive({ visible: false, x: 0, y: 0 });

const handleDateClick = (date: string, x: number, y: number) => {
    if (selectedDate.value === date) {
        menu.visible = false;
        selectedDate.value = null;
        return;
    }
    selectedDate.value = date;
    menu.x = x;
    menu.y = y;
    menu.visible = true;
};

onBeforeRouteLeave(() => {
    selectedDate.value = null;
    resetPetActions();
});
</script>

<template>
    <Header />
    <main class="lg-grid xl:grid-cols-[1fr_35%] md:pb-1.5">
        <section class="p-0 md:pb-1">
            <PetSelector viewAll stacked />
            <Calendar :events="filteredCalendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" @date-click="handleDateClick" />
        </section>
        <section
            class="flex flex-col-reverse gap-2.5 h-full lg:flex-col lg:px-1.5 lg:bg-bg-rgba md:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <div class="flex flex-col gap-2.5">
                <EventList :title="getTitle()" :events="filteredMonthEvents" :itemsPerPage="is2xl ? 6 : 4" />
                <TreatmentsThisMonth />
            </div>
            <CalendarLegend />
        </section>
    </main>
    <CalendarMenu v-model:visible="menu.visible" :style="isMd ? { left: menu.x + 'px', top: menu.y + 'px' } : {}" />
</template>