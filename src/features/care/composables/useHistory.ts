import { computed, ref } from "vue";
import { usePets } from "../../pets/composables/usePets";
import type { PetEvent } from "../types";
import { getLogTs } from "../utils";

const eventType = ref<string | null>(null);

export const useHistory = () => {
    const { selectedPet, treatments, vaccines, vetVisits, logs, isForSpecificPet } = usePets();

    const history = computed(() => [
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
                else if (log.type === "weight") return log.measuredAt && log.measuredAt.toDate() <= new Date();
                else if (log.type === "other") return log.date.toDate() <= new Date();
                else return;
            })
            .map(log => ({ ...log, ts: getLogTs(log) })),
    ].sort((a, b) => b.ts!.seconds - a.ts!.seconds));

    const petHistory = computed(() => history.value.filter(h => h.petId === selectedPet.value?.id) as PetEvent[]);
    const finishedTreatments = computed(() => treatments.value
        .filter(t => t.endDate && t.endDate.toDate() < new Date())
        .filter(t => t.petId === selectedPet.value?.id)
    );

    const filteredPetHistory = computed(() => eventType.value
        ? petHistory.value.filter(e => {
            if (e.eventType !== "log") return e.eventType === eventType.value;
            else return e.type === eventType.value
        })
        : petHistory.value
    );

    return { eventType, filteredPetHistory, finishedTreatments }
};