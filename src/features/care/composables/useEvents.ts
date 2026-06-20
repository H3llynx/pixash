import { computed, ref, type Ref } from "vue";
import { useI18n } from "vue-i18n";
import { tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { getIcon } from "../../pets/utils";
import { type PetEvent } from "../types";
import { checkOverlapsMonth, getTreatmentBackground, getTreatmentColor, showVaccines } from "../utils";

const selectedDate = ref<string | null>(null);
const currentMonth = ref<Date>(new Date());
const currentMonthName = ref<string>("");
const petId = ref<string>("");

export const useEvents = () => {
    const { vaccines, pets, vetVisits, treatments, logs, vets, selectedPet, isForSpecificPet } = usePets();
    const { t } = useI18n();

    const calendarEvents = computed(() => [
        ...vaccines.value
            .filter(vaccine => isForSpecificPet(vaccine.petId))
            .flatMap(vaccine => {
                const pet = pets.value.find(pet => pet.id === vaccine.petId)!;
                const events = [];
                if (vaccine.givenAt) events.push({
                    title: `${getIcon(pet)} ${showVaccines(vaccine.types, pet, t)}`,
                    date: tsToDate(vaccine.givenAt, "input"),
                    event: vaccine,
                });
                if (vaccine.dueOn) events.push({
                    title: `${getIcon(pet)} ${showVaccines(vaccine.types, pet, t)}`,
                    date: tsToDate(vaccine.dueOn, "input"),
                    event: vaccine,
                });
                return events;
            }),
        ...vetVisits.value.filter(visit => isForSpecificPet(visit.petId))
            .map(visit => ({
                title: `${getIcon(pets.value.find(pet => pet.id === visit.petId)!)} ${visit.title}`,
                date: tsToDate(visit.date, "datetime"),
                event: visit,
            })),
        ...logs.value
            .filter(log => isForSpecificPet(log.petId))
            .filter(log => log.type === "antiparasite")
            .flatMap(log => {
                const events = [];
                if (log.givenAt) events.push({
                    title: `🐛 ${t("events.antiparasitics")}`,
                    date: tsToDate(log.givenAt, "input"),
                    event: log,
                });
                if (log.dueOn) events.push({
                    title: `🐛 ${t("events.antiparasitics")}`,
                    date: tsToDate(log.dueOn, "input"),
                    event: log,
                });
                return events;
            }),
        ...logs.value
            .filter(log => isForSpecificPet(log.petId))
            .filter(log => log.type === "other")
            .map(log => ({
                title: `📝 ${t(`pet.logs.${log.subtype}`)}`,
                date: tsToDate(log.date, "input"),
                event: log
            })),
        ...treatments.value
            .filter(treatment => isForSpecificPet(treatment.petId))
            .map((treatment, index) => {
                let endDate;
                if (!treatment.endDate) {
                    endDate = new Date(2099, 11, 31).toISOString().split('T')[0];
                } else {
                    const end = treatment.endDate.toDate();
                    end.setDate(end.getDate() + 1);
                    const pad = (n: number) => String(n).padStart(2, "0");
                    endDate = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`;
                }
                return {
                    title: "💊",
                    start: tsToDate(treatment.startDate, "input"),
                    end: endDate,
                    event: treatment,
                    index: index,
                    allDay: true,
                    display: "background",
                    backgroundColor: getTreatmentBackground(index),
                }
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
            if (e.eventType === "vaccine" && e.types && pet.value) return showVaccines(e.types, pet.value, t);
            if (e.eventType === "visit") return e.title;
            if (e.type === "weight") return t("events.weightLog");
            if (e.type === "antiparasite") return t("events.antiparasitics")
            return t(`pet.logs.${e.subtype}`);
        });
        return { pet, vet, title };
    };

    const treatmentsThisMonth = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => {
                const isActive = t.startDate.toDate() <= now &&
                    (!t.endDate || t.endDate.toDate() >= now);
                const overlapsMonth = checkOverlapsMonth(
                    t.startDate,
                    t.endDate!,
                    currentMonth.value
                );
                return isActive && overlapsMonth;
            })
            .map((t, index) => ({ ...t, color: getTreatmentColor(index) }))
    });

    const filteredMonthTreatments = computed(() => petId.value
        ? treatmentsThisMonth.value.filter(e => e.petId === petId.value)
        : treatmentsThisMonth.value
    );

    const activeTreatments = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => t.startDate.toDate() <= now && (!t.endDate || t.endDate.toDate() >= now))
            .filter(t => t.petId === selectedPet.value?.id)
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
        petUpcomingEvents,
        useEventData,
        filteredMonthTreatments,
        activeTreatments
    }
}