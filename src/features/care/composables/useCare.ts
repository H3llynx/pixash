import { FirebaseError } from "firebase/app";
import { computed, reactive, ref, type Ref } from "vue";
import { addLog, addTreatment, addVaccine, addVet, addVetVisit, deleteLog, deleteTreatment, deleteVaccine, deleteVet, deleteVisit, fetchPetLogs, fetchPetTreatments, fetchPetVaccines, fetchPetVisits, fetchVets, updateLog, updateTreatment, updateVaccine, updateVet, updateVetVisit } from "../../../services/care";
import { resetLogs, resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { AntiparasiteLogExtended, Log, LogExtended, MedicationLogExtended, OtherLogExtended, TreatmentExtended, TreatmentRecord, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord } from "../types";
import { getCurrentWeight, getNextAntiparasitic, getNextVaccine, getNextVisit } from "../utils";

export const useCare = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vets = ref<VetExtended[]>([]);
    const selectedVaccine = ref<VaccineExtended | null>(null);
    const selectedVisit = ref<VisitExtended | null>(null);
    const selectedVet = ref<VetExtended | null>(null);
    const selectedTreatment = ref<TreatmentExtended | null>(null)
    const selectedLog = reactive<{
        antiparasitic: AntiparasiteLogExtended | null;
        medication: MedicationLogExtended | null
        other: OtherLogExtended | null;
    }>({
        antiparasitic: null,
        medication: null,
        other: null
    })
    const loading = ref<boolean>(false);
    const vetLoading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const isAddingCare = reactive({
        vet: false,
        vaccine: false,
        visit: false,
        antiparasitic: false,
        treatment: false,
        weight: false,
        other: false,
    });
    const isUpdatingVet = ref<boolean>(false);

    const vaccines = computed(() => pets.value.flatMap(pet => pet.vaccines || []));
    const vetVisits = computed(() => pets.value.flatMap(pet => pet.vetVisits || []));
    const logs = computed(() => pets.value.flatMap(pet => pet.logs || []));
    const treatments = computed(() => pets.value.flatMap(pet => pet.treatments || []));

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingCare);
        resetLogs(selectedLog);
        selectedVisit.value = null;
        selectedTreatment.value = null;
        selectedVaccine.value = vaccine;
    };

    const selectVisit = (visit: VisitExtended | null) => {
        resetState(isAddingCare);
        resetLogs(selectedLog);
        selectedVaccine.value = null;
        selectedTreatment.value = null;
        selectedVisit.value = visit;
    };

    const selectTreatment = (treatment: TreatmentExtended | null) => {
        resetState(isAddingCare);
        resetLogs(selectedLog);
        selectedVaccine.value = null;
        selectedVisit.value = null;
        selectedTreatment.value = treatment;
    };

    const selectLog = <K extends keyof typeof selectedLog>(log: typeof selectedLog[K], logType: K) => {
        resetState(isAddingCare);
        selectedVaccine.value = null;
        selectedVisit.value = null;
        selectedLog[logType] = log;
    };

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
        loading.value = true;
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
        loading.value = false;
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        await handleHealthAction(async () => {
            await addVaccine(newVaccine, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            isAddingCare.vaccine = false;
        })
    };

    const updateSelectedVaccine = async (vaccine: VaccineExtended, petId: string, data: VaccineRecord) => {
        await handleHealthAction(async () => {
            await updateVaccine(vaccine.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            selectVaccine(null);
        });
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
            await addVetVisit(newVisit, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            isAddingCare.visit = false;
        });
    };

    const updateSelectedVisit = async (visit: VisitExtended, petId: string, data: VisitRecord) => {
        await handleHealthAction(async () => {
            await updateVetVisit(visit.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            selectVisit(null);
        });
    };

    const deleteSelectedVisit = async (visit: VisitExtended, petId: string,) => {
        await handleHealthAction(async () => {
            selectVisit(null);
            await deleteVisit(visit.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
        });
    };

    const fetchUserVets = async () => {
        await handleHealthAction(async () => {
            vetLoading.value = true;
            vets.value = await fetchVets(user.value!.uid);
        },
            () => vetLoading.value = false
        );
    };

    const addNewVet = async (newVet: Vet) => {
        await handleHealthAction(async () => {
            vetLoading.value = true;
            await addVet(newVet, user.value!.uid);
            await fetchUserVets();
        }, () => {
            vetLoading.value = false;
            isAddingCare.vet = false
        });
    };

    const updateSelectedVet = async (vet: VetExtended, data: Partial<Vet>) => {
        await handleHealthAction(async () => {
            vetLoading.value = true;
            await updateVet(vet.id, user.value!.uid, data);
            const index = vets.value.findIndex(v => v.id === vet.id);
            const updatedVet: VetExtended = {
                ...vets.value[index],
                ...data,
            };
            vets.value.splice(index, 1, updatedVet);
        }, () => vetLoading.value = false
        );
    };

    const deleteSelectedVet = async (vet: VetExtended) => {
        await handleHealthAction(async () => {
            vetLoading.value = true;
            if (selectedVet.value === vet) selectedVet.value = null;
            await deleteVet(vet.id, user.value!.uid);
            await fetchUserVets();
        }, () => vetLoading.value = false
        );
    };

    const addNewLog = async (newLog: Log, petId: string) => {
        return await handleHealthAction(async () => {
            const logId = await addLog(newLog, petId, user.value!.uid);
            await refreshPetHealth(petId);
            return logId;
        });
    };

    const updateSelectedLog = async (log: LogExtended, petId: string, data: Log) => {
        await handleHealthAction(async () => {
            await updateLog(log.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            const updatedLog = logs.value.find(l => l.id === log.id);
            if (updatedLog?.type === "antiparasite") selectedLog.antiparasitic = updatedLog as AntiparasiteLogExtended;
            else if (updatedLog?.type === "medication") selectLog(null, updatedLog?.type);
        });
    };

    const deleteSelectedLog = async (log: LogExtended, petId: string,) => {
        await handleHealthAction(async () => {
            await deleteLog(log.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            resetLogs(selectedLog);
        })
    };

    const addNewTreatment = async (newTreatment: TreatmentRecord, petId: string) => {
        await handleHealthAction(async () => {
            await addTreatment(newTreatment, petId, user.value!.uid);
            await refreshPetHealth(petId);
        }, () => {
            isAddingCare.treatment = false;
        })
    };

    const updateSelectedTreatment = async (treatment: TreatmentExtended, petId: string, data: TreatmentRecord) => {
        await handleHealthAction(async () => {
            await updateTreatment(treatment.id, petId, user.value!.uid, data);
            await refreshPetHealth(petId);
            selectTreatment(null);
        });
    };

    const deleteSelectedTreatment = async (treatment: TreatmentExtended, petId: string,) => {
        await handleHealthAction(async () => {
            selectTreatment(null);
            await deleteTreatment(treatment.id, petId, user.value!.uid);
            await refreshPetHealth(petId);
        });
    };

    return {
        error,
        loading,
        vetLoading,
        vaccines,
        vetVisits,
        selectedVaccine,
        selectedVisit,
        selectVaccine,
        selectVisit,
        selectLog,
        isAddingCare,
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