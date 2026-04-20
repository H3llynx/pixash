import { FirebaseError } from "firebase/app";
import { reactive, ref, type Ref } from "vue";
import { addVaccine, addVetVisit, deleteVaccine, deleteVisit, fetchVaccines, fetchVetVisits, updateVaccine, updateVetVisit } from "../../../services/health";
import { resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { VaccineExtended, VaccineRecord, VisitExtended, VisitRecord } from "../types";
import { getNextVaccine, getNextVisit } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vaccines = ref<VaccineExtended[]>([]);
    const vetVisits = ref<VisitExtended[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const selectedVisit = ref<VisitExtended | null>(null);
    const selectedDate = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vaccine: false,
        visit: false,
        treatment: false
    });

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        selectedVisit.value = null;
        selectedVaccine.value = vaccine;
    }

    const selectVisit = (visit: VisitExtended | null) => {
        resetState(isAddingHealth);
        selectedVaccine.value = null;
        selectedVisit.value = visit;
    }

    const assignHealth = () => {
        pets.value = pets.value.map(pet => {
            const petVaccines = vaccines.value.filter(vaccine => vaccine.petId === pet.id);
            const petVisits = vetVisits.value.filter(visit => visit.petId === pet.id);
            return {
                ...pet,
                vaccines: petVaccines,
                vetVisits: petVisits,
                nextVaccine: getNextVaccine(petVaccines),
                nextVetVisit: getNextVisit(petVisits),
            }
        });
    };

    const handleHealthAction = async (
        action: () => Promise<void> | void,
        onFinal?: () => void
    ) => {
        if (!user.value) return;
        error.value = null;
        try {
            await action();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
        } finally {
            if (onFinal) onFinal();
        }
    };

    const fetchUserVaccines = async () => {
        await handleHealthAction(async () => {
            const v = await fetchVaccines(user.value!.uid);
            vaccines.value = v.map(v => ({ ...v, ts: v.dueOn ?? null, eventType: "vaccine" }));
            assignHealth();
        });
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addVaccine(newVaccine, petId, user.value!.uid);
            await fetchUserVaccines();
        }, () => {
            loading.value = false;
            isAddingHealth.vaccine = false;
        })
    };

    const updateSelectedVaccine = async (vaccine: VaccineExtended, petId: string, data: VaccineRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateVaccine(vaccine.id, petId, user.value!.uid, data);
            await fetchUserVaccines();
            selectVaccine(null);
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedVaccine = async (vaccine: VaccineExtended, petId: string,) => {
        await handleHealthAction(async () => {
            loading.value = true;
            selectVaccine(null);
            await deleteVaccine(vaccine.id, petId, user.value!.uid);
            await fetchUserVaccines();
        }, () => {
            loading.value = false;
        })
    };

    const fetchUserVisits = async () => {
        await handleHealthAction(async () => {
            const v = await fetchVetVisits(user.value!.uid);
            vetVisits.value = v.map(v => ({ ...v, ts: v.date, eventType: "visit" }));
            assignHealth();
        });
    };

    const addNewVetVisit = async (newVisit: VisitRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addVetVisit(newVisit, petId, user.value!.uid);
            await fetchUserVisits();
        }, () => {
            loading.value = false;
            isAddingHealth.visit = false;
        })
    };

    const updateSelectedVisit = async (visit: VisitExtended, petId: string, data: VisitRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateVetVisit(visit.id, petId, user.value!.uid, data);
            await fetchUserVisits();
            selectVisit(null);
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedVisit = async (visit: VisitExtended, petId: string,) => {
        await handleHealthAction(async () => {
            loading.value = true;
            selectVisit(null);
            await deleteVisit(visit.id, petId, user.value!.uid);
            await fetchUserVisits();
        }, () => {
            loading.value = false;
        })
    };

    return { error, loading, vaccines, vetVisits, selectedVaccine, selectedVisit, selectVaccine, selectVisit, isAddingHealth, fetchUserVaccines, addNewVaccine, updateSelectedVaccine, deleteSelectedVaccine, fetchUserVisits, addNewVetVisit, updateSelectedVisit, deleteSelectedVisit, selectedDate };
};