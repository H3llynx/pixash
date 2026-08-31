import { FirebaseError } from "firebase/app";
import { computed, ref, watch } from "vue";
import { fetchPetLogs, fetchPetTreatments, fetchPetVaccines, fetchPetVisits } from "../../../services/care";
import { addPet, deletePet, deletePetField, fetchPets, updatePet } from "../../../services/pets";
import { resetState } from "../../../utils";
import { useCare } from "../../care/composables/useCare";
import { getCurrentWeight, getNextAntiparasitic, getNextVaccine, getNextVisit } from "../../care/utils";
import { useAuth } from "../../user/composables/useAuth";
import type { Pet, PetExtended } from "../types";

const { user } = useAuth();

const pets = ref<PetExtended[]>([]);
const selectedPet = ref<PetExtended | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const hasPets = computed(() => pets.value.length > 0);
const isAddingPet = ref<boolean>(false);
const isUpdatingPet = ref<boolean>(false);

const {
  error: careError,
  loading: careLoading,
  vetLoading,
  treatmentLoading,
  isAddingCare,
  vaccines,
  vetVisits,
  selectedVaccine,
  selectVaccine,
  selectVisit,
  selectLog,
  selectedAntiparasiticLog,
  selectedMedicationLog,
  selectedOtherLog,
  selectedVisit,
  addNewVaccine,
  updateSelectedVaccine,
  deleteSelectedVaccine,
  addNewVetVisit,
  updateSelectedVisit,
  deleteSelectedVisit,
  vets,
  selectedVet,
  isUpdatingVet,
  fetchUserVets,
  addNewVet,
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
} = useCare(pets);

const hasVets = computed(() => vets.value.length > 0);

const handleAdd = (action: string) => {
  resetPetActions();
  if (action === "vaccine") isAddingCare.vaccine = true;
  else if (action === "pet") isAddingPet.value = true;
  else if (action === "visit") isAddingCare.visit = true;
  else if (action === "vet") isAddingCare.vet = true;
  else if (action === "antiparasitic") isAddingCare.antiparasitic = true;
  else if (action === "treatment") isAddingCare.treatment = true;
  else if (action === "log") isAddingCare.other = true;
  else if (action === "weight") isAddingCare.weight = true;
  else return;
}

const selectPet = (pet: PetExtended | null) => {
  isAddingPet.value = false;
  isUpdatingPet.value = false;
  if (selectedVaccine.value) selectVaccine(null);
  if (selectedVisit.value) selectVisit(null);
  if (selectedTreatment.value) selectTreatment(null);
  if (selectedLog.value) selectLog(null)
  selectedPet.value = pet;
}

const resetPetActions = () => {
  isAddingPet.value = false;
  isUpdatingPet.value = false;
  resetState(isAddingCare);
  selectLog(null);
  selectVaccine(null);
  selectVisit(null);
};

const handlePetAction = async (
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
    throw e;
  } finally {
    if (onFinal) onFinal();
  }
};

const fetchUserPets = async () => {
  await handlePetAction(async () => {
    loading.value = true;
    const fetchedPets = await fetchPets(user.value!.uid);

    pets.value = await Promise.all(
      fetchedPets.map(async (pet) => {
        const [vaccines, vetVisits, treatments, logs] = await Promise.all([
          fetchPetVaccines(user.value!.uid, pet.id),
          fetchPetVisits(user.value!.uid, pet.id),
          fetchPetTreatments(user.value!.uid, pet.id),
          fetchPetLogs(user.value!.uid, pet.id),
        ]);

        return {
          ...pet,
          vaccines,
          vetVisits,
          treatments,
          logs,
          nextVaccine: getNextVaccine(vaccines),
          nextVetVisit: getNextVisit(vetVisits),
          nextAntiparasitic: getNextAntiparasitic(logs),
          weight: getCurrentWeight(logs)
        };
      })
    );

    if (!selectedPet.value && pets.value.length) {
      selectPet(pets.value[0]);
    } else if (!pets.value.length) {
      isAddingPet.value = true;
    }
  }, () => loading.value = false);
};

const addNewPet = async (newPet: Pet) => {
  await handlePetAction(async () => {
    loading.value = true;
    const newPetId = await addPet(newPet, user.value!.uid);
    await fetchUserPets();
    const addedPet = pets.value.find(pet => pet.id === newPetId)
    if (addedPet) selectPet(addedPet);
  }, () => {
    loading.value = false;
    isAddingPet.value = false
  });
};

const updateSelectedPet = async (pet: PetExtended, data: Partial<Pet>) => {
  await handlePetAction(async () => {
    loading.value = true;
    await updatePet(pet.id, user.value!.uid, data);
    const index = pets.value.findIndex(p => p.id === pet.id);
    const updatedPet: PetExtended = {
      ...pets.value[index],
      ...data,
    };
    pets.value.splice(index, 1, updatedPet);
    selectPet(updatedPet);
  }, () => loading.value = false);
};

const deleteSelectedPet = async (pet: PetExtended) => {
  await handlePetAction(async () => {
    loading.value = true;
    selectPet(null);
    await deletePet(pet.id, user.value!.uid);
    await fetchUserPets();
  }, () => loading.value = false
  );
};

const deleteSelectedPetField = async (pet: PetExtended, data: keyof Pet) => {
  await handlePetAction(async () => {
    await deletePetField(pet.id, user.value!.uid, data);
    const index = pets.value.findIndex(p => p.id === pet.id);
    const updatedPet: PetExtended = { ...pets.value[index] };
    delete updatedPet[data]
    pets.value.splice(index, 1, updatedPet);
    selectPet(updatedPet);
  });
};

const isForSpecificPet = (petId: string) => pets.value.some(pet => pet.id === petId)

watch(user, async (newUser) => {
  if (!newUser) {
    pets.value = [];
    vets.value = [];
    selectPet(null);
  } else {
    await fetchUserPets();
    await fetchUserVets();
  }
}, { immediate: true });

watch(
  [selectedVaccine, selectedVisit, selectedTreatment, selectedLog],
  ([vaccine, visit, treatment, log]) => {
    if (vaccine || visit || treatment || log) {
      isAddingPet.value = false;
      isUpdatingPet.value = false;
    }
  }
);

watch(isAddingPet, (adding) => {
  if (adding) {
    resetState(isAddingCare);
    isUpdatingPet.value = false;
    selectVaccine(null);
    selectVisit(null);
    selectLog(null);
  }
});

watch(isUpdatingPet, (editing) => {
  if (editing) {
    resetState(isAddingCare);
    isAddingPet.value = false;
    selectVaccine(null);
    selectVisit(null);
    selectLog(null);
  }
});

const resyncSelectedPet = () => {
  if (selectedPet.value) {
    const updated = pets.value.find(pet => pet.id === selectedPet.value!.id);
    if (updated) selectPet(updated);
  }
};

const syncPetFromEvent = (petId: string | undefined) => {
  if (!petId) return;
  const pet = pets.value.find(p => p.id === petId);
  if (pet) selectedPet.value = pet;
};

watch(vaccines, resyncSelectedPet);
watch(vetVisits, resyncSelectedPet);
watch(treatments, resyncSelectedPet);
watch(logs, resyncSelectedPet);

watch(selectedVaccine, (vaccine) => syncPetFromEvent(vaccine?.petId));
watch(selectedVisit, (visit) => syncPetFromEvent(visit?.petId));
watch(selectedTreatment, (treatment) => syncPetFromEvent(treatment?.petId));
watch(selectedLog, (log) => syncPetFromEvent(log?.petId));

export const usePets = () => {
  return {
    pets,
    selectedPet,
    selectPet,
    loading,
    vetLoading,
    careLoading,
    treatmentLoading,
    error,
    careError,
    isAddingPet,
    isUpdatingPet,
    fetchUserPets,
    addNewPet,
    updateSelectedPet,
    deleteSelectedPet,
    deleteSelectedPetField,
    hasPets,
    vaccines,
    vetVisits,
    selectedVaccine,
    selectVaccine,
    selectedAntiparasiticLog,
    selectedMedicationLog,
    selectedOtherLog,
    isAddingCare,
    addNewVaccine,
    updateSelectedVaccine,
    deleteSelectedVaccine,
    addNewVetVisit,
    selectVisit,
    selectedVisit,
    updateSelectedVisit,
    deleteSelectedVisit,
    vets,
    selectedVet,
    addNewVet,
    updateSelectedVet,
    hasVets,
    deleteSelectedVet,
    isUpdatingVet,
    selectedLog,
    selectLog,
    logs,
    addNewLog,
    updateSelectedLog,
    deleteSelectedLog,
    resetPetActions,
    treatments,
    selectedTreatment,
    addNewTreatment,
    updateSelectedTreatment,
    deleteSelectedTreatment,
    selectTreatment,
    handleAdd,
    isForSpecificPet
  };
};