<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import Header from '../components/header/Header.vue';
import { useMedia } from '../composables/useMedia';
import Calendar from '../features/health/components/events/Calendar.vue';
import CalendarLegend from '../features/health/components/events/CalendarLegend.vue';
import EventList from '../features/health/components/events/EventList.vue';
import EventMenu from '../features/health/components/events/EventMenu.vue';
import { useEvents } from '../features/health/composables/useEvents';
import PetSelector from '../features/pets/components/PetSelector.vue';
import { usePets } from '../features/pets/composables/usePets';
import { resetState } from '../utils';

const { selectVaccine, selectVisit, isAddingHealth, selectedLog } = usePets();
const { selectedDate, currentMonth, currentMonthName, filteredCalendarEvents, filteredMonthEvents, petId } = useEvents();
const { t } = useI18n();
const { isMd } = useMedia();

const getTitle = () => {
    const now = new Date().getMonth();
    return now === currentMonth.value.getMonth() ? t("events.thisMonth") : currentMonthName.value
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
    resetState(isAddingHealth);
    resetState(selectedLog);
    selectVaccine(null);
    selectVisit(null);
});
</script>

<template>
    <Header />
    <main class="lg:gap-0 lg:grid lg:grid-cols-[50%_50%] xl:grid-cols-[1fr_35%]">
        <section class="p-0 bg-brand-dark md:bg-bg md:pt-0.5">
            <PetSelector v-if="!isMd" calendar v-model:petId="petId" />
            <Calendar :events="filteredCalendarEvents" @update-month="currentMonth = $event"
                @update-monthName="currentMonthName = $event" @date-click="handleDateClick" />
        </section>
        <section
            class="flex flex-col-reverse gap-1.5 p-0 h-full md:flex-col md:default-padding lg:px-1.5 lg:bg-bg-rgba lg:pt-1.5 lg:border-l lg:border-border lg:h-full">
            <EventList :title="getTitle()" :events="filteredMonthEvents" class="md:px-0" />
            <CalendarLegend />
        </section>
    </main>
    <EventMenu v-model:visible="menu.visible" :style="isMd ? { left: menu.x + 'px', top: menu.y + 'px' } : {}" />
</template>