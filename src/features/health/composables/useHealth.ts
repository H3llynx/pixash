import { FirebaseError } from "firebase/app";
import { reactive, ref, type Ref } from "vue";
import { addVaccine, addVet, addVetVisit, deleteVaccine, deleteVet, deleteVisit, fetchVaccines, fetchVets, fetchVetVisits, updateVaccine, updateVet, updateVetVisit } from "../../../services/health";
import { resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord } from "../types";
import { getNextVaccine, getNextVisit } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vaccines = ref<VaccineExtended[]>([]);
    const vetVisits = ref<VisitExtended[]>([]);
    const vets = ref<VetExtended[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const selectedVisit = ref<VisitExtended | null>(null);
    const selectedVet = ref<VetExtended | null>(null);
    const selectedDate = ref<string | null>(null);
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vet: false,
        vaccine: false,
        visit: false,
        treatment: false
    });
    const isUpdatingVet = ref<boolean>(false);

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        selectedVisit.value = null;
        selectedVaccine.value = vaccine;
    };

    const selectVisit = (visit: VisitExtended | null) => {
        resetState(isAddingHealth);
        selectedVaccine.value = null;
        selectedVisit.value = visit;
    };

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

    const fetchUserVets = async () => {
        await handleHealthAction(async () => {
            loading.value = true;
            vets.value = await fetchVets(user.value!.uid);
        },
            () => loading.value = false
        );
    };

    const addNewVet = async (newVet: Vet) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addVet(newVet, user.value!.uid);
            await fetchUserVets();
        }, () => {
            loading.value = false;
            isAddingHealth.vet = false
        });
    };

    const updateSelectedVet = async (vet: VetExtended, data: Partial<Vet>) => {
        await handleHealthAction(async () => {
            await updateVet(vet.id, user.value!.uid, data);
            const index = vets.value.findIndex(v => v.id === vet.id);
            const updatedVet: VetExtended = {
                ...vets.value[index],
                ...data,
            };
            vets.value.splice(index, 1, updatedVet);
        });
    };

    const deleteSelectedVet = async (vet: VetExtended) => {
        await handleHealthAction(async () => {
            loading.value = true;
            if (selectedVet.value === vet) selectedVet.value = null;
            await deleteVet(vet.id, user.value!.uid);
            await fetchUserVets();
        }, () => loading.value = false
        );
    };

    return {
        error,
        loading,
        vaccines,
        vetVisits,
        selectedVaccine,
        selectedVisit,
        selectVaccine,
        selectVisit,
        isAddingHealth,
        fetchUserVaccines,
        addNewVaccine,
        updateSelectedVaccine,
        deleteSelectedVaccine,
        fetchUserVisits,
        addNewVetVisit,
        updateSelectedVisit,
        deleteSelectedVisit,
        selectedDate,
        fetchUserVets,
        addNewVet,
        vets,
        isUpdatingVet,
        selectedVet,
        updateSelectedVet,
        deleteSelectedVet,
    };
};