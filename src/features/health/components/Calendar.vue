<script setup lang="ts">
import type { DatesSetArg, EventClickArg, EventInput, EventMountArg } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/vue3';
import { computed, nextTick, reactive } from 'vue';
import { usePets } from '../../pets/composables/usePet';
import EventMenu from './EventMenu.vue';

const props = defineProps<{
    events?: EventInput
}>();

const emit = defineEmits<{
    updateMonth: [date: Date]
    updateMonthName: [name: string]
}>();

const { pets, selectPet, selectVaccine, selectVisit, selectedDate } = usePets();

const menu = reactive({
    visible: false,
    x: 0,
    y: 0,
});

const eventColors: Record<string, string> = {
    visit: "var(--color-brand-light)",
    vaccine: "var(--color-gold)"
};

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    events: props.events,
    height: "auto",
    headerToolbar: {
        left: "title",
        right: "today,prev,next"
    },
    eventDidMount(info: EventMountArg) {
        const type = info.event.extendedProps.event.eventType;
        info.el.style.backgroundColor = eventColors[type] || "gray";
        info.el.style.opacity = info.isPast ? "0.5" : "1";
    },
    datesSet(info: DatesSetArg) {
        emit("updateMonth", info.view.currentStart);
        emit("updateMonthName", info.view.title);
    },
    dateClick(info: DateClickArg) {
        const isSameDay = selectedDate.value === info.dateStr;
        if (menu.visible && isSameDay) {
            menu.visible = false;
            selectedDate.value = null;
            return;
        }
        selectedDate.value = info.dateStr;
        const rect = info.dayEl.getBoundingClientRect();
        menu.x = rect.left + window.scrollX - 15;
        menu.y = rect.top + window.scrollY + 25;
        menu.visible = false;
        nextTick(() => {
            menu.visible = true;
        });
    },
    eventClick(info: EventClickArg) {
        const petToSelect = pets.value.find(pet => pet.id === info.event.extendedProps.event.petId);
        if (!petToSelect) return;
        selectPet(petToSelect)
        if (info.event.extendedProps.event.eventType === "vaccine") selectVaccine(info.event.extendedProps.event);
        else if (info.event.extendedProps.event.eventType === "visit") selectVisit(info.event.extendedProps.event)
    }
}));
</script>

<template>
    <FullCalendar :options="calendarOptions" />
    <EventMenu v-model:visible="menu.visible" :style="{ left: menu.x + 'px', top: menu.y + 'px' }" />
</template>

<style scoped>
.fc {
    max-width: 100%;
    background: var(--color-brand-dark);
    color: var(--color-brand-light);
    padding: 1rem 1rem 0rem 1rem;
    position: relative;
    z-index: 0;
}

:deep(.fc-toolbar-title) {
    font-size: x-large;
    color: var(--color-gold);
}

:deep(.fc-button) {
    background: transparent;
    text-transform: capitalize;

    &:disabled {
        background: transparent;
        color: var(--color-text-secondary)
    }
}

:deep(.fc-button:not(:disabled):hover) {
    background-color: var(--color-brand-rgba);
}

:deep(.fc-daygrid-day, .fc-day-today) {
    border-radius: 10px;
    cursor: pointer;

    &:hover {
        background-color: var(--color-brand-rgba);
    }
}

:deep(.fc-daygrid-day.fc-day-today) {
    background: var(--color-bg-rgba);
}

:deep(.fc-event) {
    border: none;
    border-radius: 4px;
    padding: 2px 4px;
    cursor: pointer;
}

:deep(.fc-event-title) {
    color: var(--color-brand-dark);
}

:deep(.fc-scrollgrid-section-header th) {
    background: none;
    font-weight: 200;
    font-size: small;
    color: var(--color-text-secondary);
    height: 50px;
}

:deep(.fc-daygrid-day-frame) {
    aspect-ratio: 1;
}

:deep(.fc-button),
:deep(.fc-scrollgrid),
:deep(.fc-scrollgrid td),
:deep(.fc-scrollgrid-section-header th),
:deep(.fc-scrollgrid-sync-table td) {
    border: none;
}

:deep(.fc-daygrid-day-number) {
    width: 100%;
    text-align: center;
    font-size: smaller;
}

@media (width >=48rem) {
    .fc {
        background: transparent;
        color: var(--color-text-text);
        margin-inline: 2rem;
    }

    :deep(.fc-button) {
        color: var(--color-brand)
    }
}
</style>