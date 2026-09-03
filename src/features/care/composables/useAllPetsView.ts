import { computed, ref } from "vue";
import { usePets } from "../../pets/composables/usePets";
import { useEvents } from "./useEvents";

const petViewed = ref<string>("");

export const useAllPetsView = () => {
    const { calendarEvents, eventsThisMonth, treatmentsThisMonth } = useEvents();
    const { vets } = usePets();

    const filteredCalendarEvents = computed(() => petViewed.value
        ? calendarEvents.value.filter(e => e.event.petId === petViewed.value)
        : calendarEvents.value
    );

    const filteredMonthEvents = computed(() => petViewed.value
        ? eventsThisMonth.value.filter(e => e.petId === petViewed.value)
        : eventsThisMonth.value
    );

    const filteredMonthTreatments = computed(() => petViewed.value
        ? treatmentsThisMonth.value.filter(e => e.petId === petViewed.value)
        : treatmentsThisMonth.value
    );

    const filteredVets = computed(() => petViewed.value
        ? vets.value.filter(vet => vet.assignedPets?.includes(petViewed.value))
        : vets.value
    );

    return { petViewed, filteredCalendarEvents, filteredMonthEvents, filteredMonthTreatments, filteredVets };
};