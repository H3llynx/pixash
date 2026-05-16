import { FirebaseError } from "firebase/app";
import { reactive, ref, type Ref } from "vue";
import { addLog, addTreatment, addVaccine, addVet, addVetVisit, deleteLog, deleteTreatment, deleteVaccine, deleteVet, deleteVisit, fetchLogs, fetchTreatments, fetchVaccines, fetchVets, fetchVetVisits, updateLog, updateTreatment, updateVaccine, updateVet, updateVetVisit } from "../../../services/health";
import { resetState } from "../../../utils";
import type { PetExtended } from "../../pets/types";
import { useAuth } from "../../user/composables/useAuth";
import type { AntiparasiteLogExtended, Log, LogExtended, TreatmentExtended, TreatmentRecord, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord } from "../types";
import { getCurrentWeight, getNextAntiparasitic, getNextVaccine, getNextVisit } from "../utils";

export const useHealth = (pets: Ref<PetExtended[]>) => {
    const { user } = useAuth();
    const vaccines = ref<VaccineExtended[]>([]);
    const vetVisits = ref<VisitExtended[]>([]);
    const treatments = ref<TreatmentExtended[]>([]);
    const vets = ref<VetExtended[]>([]);
    const logs = ref<LogExtended[]>([]);
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

    const selectVaccine = (vaccine: VaccineExtended | null) => {
        resetState(isAddingHealth);
        resetState(selectedLog);
        selectedVisit.value = null;
        selectedTreatment.value = null;
        selectedVaccine.value = vaccine;
    };

    const selectVisit = (visit: VisitExtended | null) => {
        resetState(isAddingHealth);
        resetState(selectedLog);
        selectedVaccine.value = null;
        selectedTreatment.value = null;
        selectedVisit.value = visit;
    };

    const selectTreatment = (treatment: TreatmentExtended | null) => {
        resetState(isAddingHealth);
        resetState(selectedLog);
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

    const assignHealth = () => {
        pets.value = pets.value.map(pet => {
            const petVaccines = vaccines.value.filter(vaccine => vaccine.petId === pet.id);
            const petVisits = vetVisits.value.filter(visit => visit.petId === pet.id);
            const petLogs = logs.value.filter(log => log.petId === pet.id);
            const petTreatments = treatments.value.filter(treatment => treatment.petId === pet.id);
            return {
                ...pet,
                vaccines: petVaccines,
                vetVisits: petVisits,
                treatments: petTreatments,
                logs: petLogs,
                nextVaccine: getNextVaccine(petVaccines),
                nextVetVisit: getNextVisit(petVisits),
                nextAntiparasitic: getNextAntiparasitic(petLogs),
                weight: getCurrentWeight(petLogs)
            }
        });
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
        } finally {
            if (onFinal) onFinal();
        }
    };

    const fetchUserVaccines = async () => {
        await handleHealthAction(async () => {
            const v = await fetchVaccines(user.value!.uid);
            vaccines.value = v.map(v => ({ ...v, eventType: "vaccine" }));
            assignHealth();
        });
    };

    const addNewVaccine = async (newVaccine: VaccineRecord, petId: string) => {
        await handleHealthAction(async () => {
            await addVaccine(newVaccine, petId, user.value!.uid);
            await fetchUserVaccines();
            isAddingHealth.vaccine = false;
        });
    };

    const updateSelectedVaccine = async (vaccine: VaccineExtended, petId: string, data: VaccineRecord) => {
        await handleHealthAction(async () => {
            await updateVaccine(vaccine.id, petId, user.value!.uid, data);
            await fetchUserVaccines();
            selectVaccine(null);
        });
    };

    const deleteSelectedVaccine = async (vaccine: VaccineExtended, petId: string,) => {
        await handleHealthAction(async () => {
            await deleteVaccine(vaccine.id, petId, user.value!.uid);
            await fetchUserVaccines();
            selectVaccine(null);
        });
    };

    const fetchUserVisits = async () => {
        await handleHealthAction(async () => {
            const v = await fetchVetVisits(user.value!.uid);
            vetVisits.value = v.map(v => ({ ...v, eventType: "visit" }));
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

    const fetchUserLogs = async () => {
        await handleHealthAction(async () => {
            const l = await fetchLogs(user.value!.uid);
            logs.value = l.map((log): LogExtended => ({ ...log, eventType: "log" }));
            assignHealth();
        });
    };

    const addNewLog = async (newLog: Log, petId: string) => {
        return await handleHealthAction(async () => {
            loading.value = true;
            const logId = await addLog(newLog, petId, user.value!.uid);
            await fetchUserLogs();
            return logId;
        }, () => {
            loading.value = false;
        })
    };

    const updateSelectedLog = async (log: LogExtended, petId: string, data: Log) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateLog(log.id, petId, user.value!.uid, data);
            await fetchUserLogs();
        }, () => {
            loading.value = false;
        })
    };

    const deleteSelectedLog = async (log: LogExtended, petId: string,) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await deleteLog(log.id, petId, user.value!.uid);
            await fetchUserLogs();
        }, () => {
            loading.value = false;
            resetState(selectedLog);
        })
    };

    const fetchUserTreatments = async () => {
        await handleHealthAction(async () => {
            const v = await fetchTreatments(user.value!.uid);
            treatments.value = v.map(v => ({ ...v, eventType: "treatment" }));
            assignHealth();
        });
    };

    const addNewTreatment = async (newTreatment: TreatmentRecord, petId: string) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await addTreatment(newTreatment, petId, user.value!.uid);
            await fetchUserTreatments();
        }, () => {
            loading.value = false;
            isAddingHealth.treatment = false;
        })
    };

    const updateSelectedTreatment = async (treatment: TreatmentExtended, petId: string, data: TreatmentRecord) => {
        await handleHealthAction(async () => {
            loading.value = true;
            await updateTreatment(treatment.id, petId, user.value!.uid, data);
            await fetchUserTreatments();
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
            await fetchUserTreatments();
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
        fetchUserVaccines,
        addNewVaccine,
        updateSelectedVaccine,
        deleteSelectedVaccine,
        fetchUserVisits,
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
        fetchUserLogs,
        addNewLog,
        updateSelectedLog,
        deleteSelectedLog,
        treatments,
        selectedTreatment,
        fetchUserTreatments,
        addNewTreatment,
        updateSelectedTreatment,
        deleteSelectedTreatment,
        selectTreatment
    };
};