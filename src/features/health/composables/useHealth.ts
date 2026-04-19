import { FirebaseError } from "firebase/app";
import { reactive, ref, type Ref } from "vue";
import { addVaccine, addVetVisit, deleteVaccine, fetchVaccines, fetchVetVisits, updateVaccine } from "../../../services/health";
import { resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { VaccineExtended, VaccineRecord, VisitExented, VisitRecord } from "../types";
import { getNextVaccine } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vaccines = ref<VaccineExtended[]>([]);
    const vetVisits = ref<VisitExented[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vaccine: false,
        visit: false,
        treatment: false
    });

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        selectedVaccine.value = vaccine;
    }

    const assignHealth = () => {
        pets.value = pets.value.map(pet => {
            const petVaccines = vaccines.value.filter(vaccine => vaccine.petId === pet.id);
            const petVisits = vetVisits.value.filter(visit => visit.petId === pet.id);
            return {
                ...pet,
                vaccines: petVaccines,
                nextVaccine: getNextVaccine(petVaccines),
                vetVisits: petVisits,
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
            vaccines.value = await fetchVaccines(user.value!.uid);
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
            selectVaccine(null);
            await fetchUserVaccines();
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
            vetVisits.value = await fetchVetVisits(user.value!.uid);
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

    return { error, loading, vaccines, vetVisits, selectedVaccine, selectVaccine, isAddingHealth, fetchUserVaccines, addNewVaccine, updateSelectedVaccine, deleteSelectedVaccine, fetchUserVisits, addNewVetVisit };
};