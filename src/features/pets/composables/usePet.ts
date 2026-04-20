import { FirebaseError } from "firebase/app";
import { computed, ref, watch } from "vue";
import { addPet, deletePet, deletePetField, fetchPets, updatePet } from "../../../services/pets";
import { useHealth } from "../../health/composables/useHealth";
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
  error: healthError,
  loading: healthLoading,
  isAddingHealth,
  vaccines,
  vetVisits,
  selectedVaccine,
  selectVaccine,
  selectVisit,
  selectedVisit,
  fetchUserVaccines,
  addNewVaccine,
  updateSelectedVaccine,
  deleteSelectedVaccine,
  addNewVetVisit,
  fetchUserVisits,
  updateSelectedVisit,
  deleteSelectedVisit,
  selectedDate,
} = useHealth(pets);

const selectPet = (pet: PetExtended | null) => {
  isAddingPet.value = false;
  isUpdatingPet.value = false;
  if (selectedVaccine.value) selectVaccine(null);
  if (selectedVisit.value) selectVisit(null);
  selectedPet.value = pet;
}

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
  } finally {
    if (onFinal) onFinal();
  }
};

const fetchUserPets = async () => {
  await handlePetAction(async () => {
    loading.value = true;
    pets.value = await fetchPets(user.value!.uid);
    await fetchUserVaccines();
    await fetchUserVisits();
    if (!selectedPet.value && pets.value.length) {
      selectPet(pets.value[0]);
    } else if (!pets.value.length) isAddingPet.value = true;
  },
    () => loading.value = false
  );
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

const updateSelectedPet = async (pet: PetExtended, data: Partial<Pick<Pet, "weight" | "microchip" | "microchipped">>) => {
  await handlePetAction(async () => {
    await updatePet(pet.id, user.value!.uid, data);
    const index = pets.value.findIndex(p => p.id === pet.id);
    const updatedPet: PetExtended = {
      ...pets.value[index],
      ...data,
    };
    pets.value.splice(index, 1, updatedPet);
    selectPet(updatedPet);
  }
  );
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

watch(user, async (newUser) => {
  if (!newUser) {
    pets.value = [];
    vaccines.value = [];
    selectPet(null);
  } else {
    await fetchUserPets();
  }
}, { immediate: true });

watch(vaccines, (_newVaccines) => {
  if (selectedPet.value) {
    const updated = pets.value.find(pet => pet.id === selectedPet.value!.id);
    if (updated) selectPet(updated);
  }
});

export const usePets = () => {
  return {
    pets,
    selectedPet,
    selectPet,
    loading,
    healthLoading,
    error,
    healthError,
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
    isAddingHealth,
    fetchUserVaccines,
    addNewVaccine,
    updateSelectedVaccine,
    deleteSelectedVaccine,
    addNewVetVisit,
    selectVisit,
    selectedVisit,
    updateSelectedVisit,
    deleteSelectedVisit,
    selectedDate
  };
};