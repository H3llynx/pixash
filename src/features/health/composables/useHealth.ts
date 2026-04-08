import { FirebaseError } from "firebase/app";
import { reactive, ref, type Ref } from "vue";
import { addVaccine, deleteVaccine, fetchVaccines, updateVaccine } from "../../../services/health";
import { resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { VaccineExtended, VaccineRecord } from "../types";
import { getNextVaccine } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vaccines = ref<VaccineExtended[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vaccine: false,
        treatment: false
    });

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        selectedVaccine.value = vaccine;
    }

    const assignVaccines = () => {
        pets.value = pets.value.map(pet => {
            const petVaccines = vaccines.value.filter(vaccine => vaccine.petId === pet.id);
            return {
                ...pet,
                vaccines: petVaccines,
                nextVaccine: getNextVaccine(petVaccines)
            }
        });
    };

    const fetchUserVaccines = async () => {
        if (!user.value) {
            return;
        }
        error.value = null;
        try {
            vaccines.value = await fetchVaccines(user.value.uid);
            assignVaccines();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
        }
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        if (!user.value || !newVaccine) {
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            await addVaccine(newVaccine, petId, user.value.uid);
            await fetchUserVaccines();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
        } finally {
            loading.value = false;
            isAddingHealth.vaccine = false;
        }
    };

    const updateSelectedVaccine = async (vaccine: VaccineExtended, petId: string, data: VaccineRecord) => {
        error.value = null;
        loading.value = true;
        try {
            await updateVaccine(vaccine.id, petId, user.value!.uid, data);
            selectVaccine(null);
            await fetchUserVaccines();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
        } finally {
            loading.value = false;
        }
    };

    const deleteSelectedVaccine = async (vaccine: VaccineExtended, petId: string,) => {
        error.value = null;
        loading.value = true;
        try {
            selectVaccine(null);
            await deleteVaccine(vaccine.id, petId, user.value!.uid);
            await fetchUserVaccines();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
        } finally {
            loading.value = false;
        }
    };

    return { error, loading, vaccines, selectedVaccine, selectVaccine, isAddingHealth, fetchUserVaccines, addNewVaccine, updateSelectedVaccine, deleteSelectedVaccine };
};