import { FirebaseError } from "firebase/app";
import { reactive, ref, watch, type Ref } from "vue";
import { useToast } from "../../../composables/useToast";
import { addVaccine, fetchVaccines } from "../../../services/health";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { VaccineExtended, VaccineRecord } from "../types";
import { getNextVaccine } from "../utils";

const { user } = useAuth();
const { show } = useToast();

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const vaccines = ref<VaccineExtended[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vaccine: false,
        treatment: false
    });
    const isUpdatingHealth = reactive({
        vaccine: false,
        treatment: false
    });

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
        loading.value = true;
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
        } finally {
            loading.value = false;
        }
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        if (!user.value || !newVaccine) {
            return;
        }
        loading.value = true;
        error.value = null;

        try {
            const newVaccineId = await addVaccine(newVaccine, petId, user.value.uid);
            await fetchUserVaccines();
            const addedVaccine = vaccines.value.find(vaccine => vaccine.id === newVaccineId)
            if (addedVaccine) {
                show({ type: "success", title: "Success", message: `${addedVaccine.type}! vaccine has been successfully added` });
            };
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

    watch(error, (newError) => {
        if (newError) show({ type: "error", title: "Error", message: newError });
    });

    return { vaccines, isAddingHealth, isUpdatingHealth, fetchUserVaccines, addNewVaccine };
};