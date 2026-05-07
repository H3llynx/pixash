import { computed, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { getIcon } from "../../pets/utils";
import { type PetEvent } from "../types";
import { getLogTs, showTypes } from "../utils";

const selectedDate = ref<string | null>(null);
const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const petId = ref<string>("");

export const useEvents = () => {
    const { vaccines, pets, vetVisits, logs, vets, selectedPet } = usePets();
    const { t } = useI18n();

    const isForSpecificPet = (petId: string) => pets.value.some(pet => pet.id === petId)

    const history = computed<PetEvent[]>(() => [
        ...vaccines.value
            .filter(vaccine => isForSpecificPet(vaccine.petId))
            .filter(vaccine => vaccine.givenAt && vaccine.givenAt.toDate() <= new Date())
            .map(vaccine => ({ ...vaccine, ts: vaccine.givenAt! })),
        ...vetVisits.value
            .filter(visit => isForSpecificPet(visit.petId))
            .filter(visit => visit.date?.toDate() <= new Date())
            .map(visit => ({ ...visit, ts: visit.date })),
        ...logs.value
            .filter(log => isForSpecificPet(log.petId))
            .filter(log => {
                if (log.type === "antiparasite") return log.givenAt && log.givenAt.toDate() <= new Date();
                return log.measuredAt && log.measuredAt.toDate() <= new Date();
            })
            .map(log => ({ ...log, ts: getLogTs(log) })),
    ].sort((a, b) => b.ts.seconds - a.ts.seconds));

    const calendarEvents = computed(() => [
        ...vaccines.value
            .filter(vaccine => isForSpecificPet(vaccine.petId))
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
        ...vetVisits.value.filter(visit => isForSpecificPet(visit.petId))
            .map(visit => ({
                title: `${getIcon(pets.value.find(pet => pet.id === visit.petId)!)} ${visit.title}`,
                date: tsToDate(visit.date, "input"),
                event: visit,
            })),
        ...logs.value
            .filter(log => isForSpecificPet(log.petId))
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

    const filteredCalendarEvents = computed(() => petId.value
        ? calendarEvents.value.filter(e => e.event.petId === petId.value)
        : calendarEvents.value
    );

    const filteredMonthEvents = computed(() => petId.value
        ? eventsThisMonth.value.filter(e => e.petId === petId.value)
        : eventsThisMonth.value
    );

    const eventsInTs = computed<PetEvent[]>(() => [
        ...vaccines.value.filter(v => v.dueOn).map(v => ({ ...v, ts: v.dueOn! })),
        ...vetVisits.value.filter(visit => visit.date).map(visit => ({ ...visit, ts: visit.date! })),
        ...logs.value.filter(log => log.type === "antiparasite").filter(log => log.dueOn).map(log => ({ ...log, ts: log.dueOn! })),
    ].sort((a, b) => a.ts!.seconds - b.ts!.seconds));

    const eventsThisMonth = computed(() => eventsInTs.value.filter(event => tsToDate(event.ts, "thatMonth", undefined, currentMonth.value)));
    const petUpcomingEvents = computed(() => {
        if (!selectedPet.value) return [];
        return eventsInTs.value.filter(event => tsToDate(event.ts, "upcoming"))
            .filter(e => e.petId === selectedPet.value!.id)
    });

    const useEventData = (event: Ref<PetEvent>) => {
        const pet = computed(() => pets.value.find(p => p.id === event.value.petId));
        const vet = computed(() => {
            if (!vets.value?.length) return null;
            return vets.value?.find(vet => vet.id === event.value.vet)?.name ?? event.value.vet
        });
        const title = computed(() => {
            const e = event.value;
            if (e.eventType === "vaccine" && e.types && pet.value) return showTypes(e.types, pet.value);
            if (e.eventType === "visit") return e.title;
            if (e.type === "weight") return t("events.weightLog");
            return t("events.antiparasitics");
        });
        return { pet, vet, title };
    };

    return {
        selectedDate,
        currentMonth,
        currentMonthName,
        calendarEvents,
        eventsThisMonth,
        filteredCalendarEvents,
        filteredMonthEvents,
        petId,
        petUpcomingEvents,
        useEventData,
        history
    }
}