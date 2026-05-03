import { computed, ref } from "vue";
import { tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { getIcon } from "../../pets/utils";
import { showTypes } from "../utils";

const selectedDate = ref<string | null>(null);
const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const petId = ref<string>("");

export const useEvents = () => {
    const { vaccines, pets, vetVisits, logs, selectedPet } = usePets();

    const calendarEvents = computed(() => [
        ...vaccines.value
            .filter(vaccine => pets.value.some(pet => pet.id === vaccine.petId))
            .flatMap(vaccine => {
                const pet = pets.value.find(pet => pet.id === vaccine.petId)!;
                const events = [];
                if (vaccine.givenAt) events.push({
                    title: `${getIcon(pet)} ${showTypes(vaccine.types, pet)}`,
                    date: tsToDate(vaccine.givenAt, "input"),
                    event: vaccine,
                });
                if (vaccine.dueOn) events.push({
                    title: `${getIcon(pet)} ${showTypes(vaccine.types, pet)}`,
                    date: tsToDate(vaccine.dueOn, "input"),
                    event: vaccine,
                });
                return events;
            }),
        ...vetVisits.value.filter(visit => pets.value.some(pet => pet.id === visit.petId))
            .map(visit => ({
                title: `${getIcon(pets.value.find(pet => pet.id === visit.petId)!)} ${visit.title}`,
                date: tsToDate(visit.date, "input"),
                event: visit,
            })),
        ...logs.value
            .filter(log => pets.value.some(pet => pet.id === log.petId))
            .filter(log => log.type === "antiparasite")
            .flatMap(log => {
                const events = [];
                if (log.givenAt) events.push({
                    title: `🐛 ${log.type}`,
                    date: tsToDate(log.givenAt, "input"),
                    event: log,
                });
                if (log.dueOn) events.push({
                    title: `🐛 ${log.type}`,
                    date: tsToDate(log.dueOn, "input"),
                    event: log,
                });
                return events;
            })
    ]);

    const eventsThisMonth = computed(() => [
        ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "thatMonth", undefined, currentMonth.value)),
        ...vetVisits.value.filter(visit => tsToDate(visit.date, "thatMonth", undefined, currentMonth.value))
    ].sort((a, b) => a.ts.seconds - b.ts.seconds));

    const filteredCalendarEvents = computed(() => petId.value
        ? calendarEvents.value.filter(e => e.event.petId === petId.value)
        : calendarEvents.value
    );

    const filteredMonthEvents = computed(() => petId.value
        ? eventsThisMonth.value.filter(e => e.petId === petId.value)
        : eventsThisMonth.value
    );

    const upcomingEvents = computed(() => [
        ...vaccines.value.filter(vaccine => tsToDate(vaccine.dueOn, "upcoming")),
        ...vetVisits.value.filter(visit => tsToDate(visit.date, "upcoming"))
    ].sort((a, b) => a.ts.seconds - b.ts.seconds));

    const petUpcomingEvents = computed(() => {
        if (!selectedPet.value) return [];
        return upcomingEvents.value.filter(e => e.petId === selectedPet.value!.id);
    });

    return {
        selectedDate,
        currentMonth,
        currentMonthName,
        calendarEvents,
        eventsThisMonth,
        filteredCalendarEvents,
        filteredMonthEvents,
        petId,
        upcomingEvents,
        petUpcomingEvents
    }
}