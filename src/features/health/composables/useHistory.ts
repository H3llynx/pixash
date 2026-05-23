import { computed, ref } from "vue";
import { usePets } from "../../pets/composables/usePets";
import type { PetEvent } from "../types";
import { useEvents } from "./useEvents";

const eventType = ref<string | null>(null);

export const useHistory = () => {
    const { history } = useEvents();
    const { selectedPet, treatments } = usePets();

    const petHistory = computed(() => history.value.filter(h => h.petId === selectedPet.value?.id) as PetEvent[]);
    const finishedTreatments = computed(() => treatments.value.filter(t => t.endDate && t.endDate.toDate() < new Date()));

    const filteredPetHistory = computed(() => eventType.value
        ? petHistory.value.filter(e => {
            if (e.eventType !== "log") return e.eventType === eventType.value;
            else return e.type === eventType.value
        })
        : petHistory.value
    );

    return { eventType, filteredPetHistory, finishedTreatments }
};