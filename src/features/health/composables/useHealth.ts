import { FirebaseError } from "firebase/app";
import { computed, reactive, ref, type Ref } from "vue";
import { addLog, addTreatment, addVaccine, addVet, addVetVisit, deleteLog, deleteTreatment, deleteVaccine, deleteVet, deleteVisit, fetchPetLogs, fetchPetTreatments, fetchPetVaccines, fetchPetVisits, fetchVets, updateLog, updateTreatment, updateVaccine, updateVet, updateVetVisit } from "../../../services/health";
import { resetLogs, resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { AntiparasiteLogExtended, Log, LogExtended, TreatmentExtended, TreatmentRecord, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord } from "../types";
import { getCurrentWeight, getNextAntiparasitic, getNextVaccine, getNextVisit } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vets = ref<VetExtended[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const selectedVisit = ref<VisitExtended | null>(null);
    const selectedVet = ref<VetExtended | null>(null);
    const selectedTreatment = ref<TreatmentExtended | null>(null)
    const selectedLog = reactive<{
        antiparasitic: AntiparasiteLogExtended | null;
    }>({
        antiparasitic: null,
    })
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingHealth = reactive({
        vet: false,
        vaccine: false,
        visit: false,
        antiparasitic: false,
        treatment: false,
        weight: false,
    });
    const isUpdatingVet = ref<boolean>(false);

    const vaccines = computed(() => pets.value.flatMap(pet => pet.vaccines || []));
    const vetVisits = computed(() => pets.value.flatMap(pet => pet.vetVisits || []));
    const logs = computed(() => pets.value.flatMap(pet => pet.logs || []));
    const treatments = computed(() => pets.value.flatMap(pet => pet.treatments || []));

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        resetLogs(selectedLog);
        selectedVisit.value = null;
        selectedTreatment.value = null;
        selectedVaccine.value = vaccine;
    };

    const selectVisit = (visit: VisitExtended | null) => {
        resetState(isAddingHealth);
        resetLogs(selectedLog);
        selectedVaccine.value = null;
        selectedTreatment.value = null;
        selectedVisit.value = visit;
    };

    const selectTreatment = (treatment: TreatmentExtended | null) => {
        resetState(isAddingHealth);
        resetLogs(selectedLog);
        selectedVaccine.value = null;
        selectedVisit.value = null;
        selectedTreatment.value = treatment;
    };

    type SelectedLogValues = typeof selectedLog[keyof typeof selectedLog];

    const selectLog = (log: SelectedLogValues, logType: keyof typeof selectedLog) => {
        resetState(isAddingHealth);
        selectedVaccine.value = null;
        selectedVisit.value = null;
        selectedLog[logType] = log;
    }

    const handleHealthAction = async <T>(
        action: () => Promise<T>,
        onFinal?: () => void
    ) => {
        if (!user.value) return;
        error.value = null;
        try {
            return await action();
        } catch (e) {
            if (e instanceof FirebaseError) {
                error.value = e.message;
            } else {
                error.value = "An unexpected error occurred";
            }
            throw e;
        } finally {
            if (onFinal) onFinal();
        }
    };

    const refreshPetHealth = async (petId: string) => {
        const petIndex = pets.value.findIndex(p => p.id === petId);
        if (petIndex === -1) return;

        const [vaccines, vetVisits, treatments, logs] = await Promise.all([
            fetchPetVaccines(user.value!.uid, petId),
            fetchPetVisits(user.value!.uid, petId),
            fetchPetTreatments(user.value!.uid, petId),
            fetchPetLogs(user.value!.uid, petId),
        ]);

        pets.value[petIndex] = {
            ...pets.value[petIndex],
            vaccines,
            vetVisits,
            treatments,
            logs,
            nextVaccine: getNextVaccine(vaccines),
            nextVetVisit: getNextVisit(vetVisits),
            nextAntiparasitic: getNextAntiparasitic(logs),
            weight: getCurrentWeight(logs)
        };
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addVaccine(newVaccine, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            loading.value = false;
            isAddingHealth.vaccine = false;
        })
    };

    const updateSelectedVaccine = async (vaccine: VaccineExtended, petId: string, data: VaccineRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateVaccine(vaccine.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            selectVaccine(null);
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedVaccine = async (vaccine: VaccineExtended, petId: string,) => {
        await handleHealthAction(async () => {
            await deleteVaccine(vaccine.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
            selectVaccine(null);
        });
    };

    const addNewVetVisit = async (newVisit: VisitRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addVetVisit(newVisit, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            loading.value = false;
            isAddingHealth.visit = false;
        })
    };

    const updateSelectedVisit = async (visit: VisitExtended, petId: string, data: VisitRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateVetVisit(visit.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
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
            await refreshPetHealth(petId);
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

    const addNewLog = async (newLog: Log, petId: string) => {
        return await handleHealthAction(async () => {
            loading.value = true;
            const logId = await addLog(newLog, petId, user.value!.uid);
            await refreshPetHealth(petId);
            return logId;
        }, () => {
            loading.value = false;
        })
    };

    const updateSelectedLog = async (log: LogExtended, petId: string, data: Log) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateLog(log.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            const updatedLog = logs.value.find(l => l.id === log.id);
            if (updatedLog) {
                selectedLog.antiparasitic = updatedLog as AntiparasiteLogExtended;
            }
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedLog = async (log: LogExtended, petId: string,) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await deleteLog(log.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            loading.value = false;
            resetLogs(selectedLog);
        })
    };

    const addNewTreatment = async (newTreatment: TreatmentRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addTreatment(newTreatment, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            loading.value = false;
            isAddingHealth.treatment = false;
        })
    };

    const updateSelectedTreatment = async (treatment: TreatmentExtended, petId: string, data: TreatmentRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateTreatment(treatment.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            selectTreatment(null);
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedTreatment = async (treatment: TreatmentExtended, petId: string,) => {
        await handleHealthAction(async () => {
            loading.value = true;
            selectTreatment(null);
            await deleteTreatment(treatment.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            loading.value = false;
        })
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
        selectLog,
        isAddingHealth,
        addNewVaccine,
        updateSelectedVaccine,
        deleteSelectedVaccine,
        addNewVetVisit,
        updateSelectedVisit,
        deleteSelectedVisit,
        fetchUserVets,
        addNewVet,
        vets,
        isUpdatingVet,
        selectedVet,
        updateSelectedVet,
        deleteSelectedVet,
        selectedLog,
        logs,
        addNewLog,
        updateSelectedLog,
        deleteSelectedLog,
        treatments,
        selectedTreatment,
        addNewTreatment,
        updateSelectedTreatment,
        deleteSelectedTreatment,
        selectTreatment
    };
};