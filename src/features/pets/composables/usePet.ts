import { FirebaseError } from "firebase/app";
import { computed, reactive, ref, watch } from "vue";
import { useToast } from "../../../composables/useToast";
import { addPet, deletePet, fetchPets, updatePet } from "../../../services/pets";
import { resetState } from "../../../utils";
import { useHealth } from "../../health/composables/useHealth";
import { useAuth } from "../../user/composables/useAuth";
import type { Pet, PetExtended } from "../types";

const { user } = useAuth();
const { show } = useToast();

const pets = ref<PetExtended[]>([]);
const selectedPet = ref<PetExtended | null>(null);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const hasPets = computed(() => pets.value.length > 0);
const isAddingPet = ref<boolean>(false);
const isUpdating = reactive({
  generalInfo: false,
  weight: false,
  microchip: false,
  nextVaccine: false,
});

const selectPet = (pet: PetExtended | null) => {
  isAddingPet.value = false;
  resetState(isUpdating);
  resetState(isUpdatingHealth);
  resetState(isAddingHealth);
  selectedPet.value = pet;
}

const {
  isAddingHealth,
  isUpdatingHealth,
  vaccines,
  fetchUserVaccines,
  addNewVaccine,
} = useHealth(pets);

const fetchUserPets = async () => {
  if (!user.value) {
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    pets.value = await fetchPets(user.value.uid);
    if (!selectedPet.value && pets.value.length) {
      selectPet(pets.value[0]);
    } else if (!pets.value.length) isAddingPet.value = true;
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

const addNewPet = async (newPet: Pet) => {
  if (!user.value || !newPet) {
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    const newPetId = await addPet(newPet, user.value.uid);
    await fetchUserPets();
    const addedPet = pets.value.find(pet => pet.id === newPetId)
    if (addedPet) {
      selectPet(addedPet);
      show({ type: "success", title: "Success", message: `${addedPet.name}! has been successfully added` });
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      error.value = e.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false;
    isAddingPet.value = false;
  }
};

const updateSelectedPet = async (pet: PetExtended, data: Partial<Pick<Pet, "weight" | "microchip" | "microchipped">>) => {
  if (!user.value || !pet) {
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    await updatePet(pet.id, user.value.uid, data);
    await fetchUserPets();
    const updatedPet = pets.value.find(p => p.id === pet.id)
    if (updatedPet) {
      selectPet(updatedPet);
      show({ type: "success", title: "Success", message: `${updatedPet.name}! has been successfully updated` });
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      error.value = e.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false;
    isAddingPet.value = false;
  }
};

const deleteSelectedPet = async (pet: PetExtended) => {
  if (!user.value || !pet) {
    return;
  }
  loading.value = true;
  error.value = null;
  const petName = pet.name;
  selectPet(null);
  try {
    await deletePet(pet.id, user.value.uid);
    await fetchUserPets();
    const deletedPet = pets.value.find(p => p.id === pet.id)
    if (!deletedPet) {
      show({ type: "success", title: "Success", message: `${petName}! has been successfully deleted` });
    };
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

watch(user, async (newUser) => {
  if (!newUser) {
    pets.value = [];
    vaccines.value = [];
    selectPet(null);
  } else {
    await fetchUserPets();
    await fetchUserVaccines();
    if (pets.value.length) {
      selectPet(pets.value[0]);
    }
  }
}, { immediate: true });

watch(error, (newError) => {
  if (newError) show({ type: "error", title: "Error", message: newError });
});

watch(vaccines, (newVaccines) => {
  if (newVaccines && selectedPet.value) {
    const updated = pets.value.find(pet => pet.id === selectedPet.value!.id);
    if (updated) selectPet(updated);
  };
});

watch(() => [isAddingPet.value, { ...isUpdating }],
  ([adding, editing], [prevAdding, prevEditing]) => {
    if (!prevAdding && adding) {
      resetState(isUpdating);
      resetState(isUpdatingHealth);
      resetState(isAddingHealth);
    };
    const wasUpdating = Object.values(prevEditing).some(Boolean);
    const isUpdatingNow = Object.values(editing).some(Boolean);
    if (!wasUpdating && isUpdatingNow) {
      isAddingPet.value = false;
    }
  });

watch(() => [{ ...isAddingHealth }, { ...isUpdatingHealth }],
  ([adding, editing], [prevAdding, prevEditing]) => {
    const wasAdding = Object.values(prevAdding).some(Boolean);
    const isAddingNow = Object.values(adding).some(Boolean);
    const wasUpdating = Object.values(prevEditing).some(Boolean);
    const isUpdatingNow = Object.values(editing).some(Boolean);
    if (!wasAdding && isAddingNow) {
      resetState(isUpdating);
      resetState(isUpdatingHealth);
      isAddingPet.value = false;
    };

    if (!wasUpdating && isUpdatingNow) {
      resetState(isUpdating);
      resetState(isAddingHealth);
      isAddingPet.value = false;
    }
  });

export const usePets = () => {
  return {
    pets,
    selectedPet,
    selectPet,
    loading,
    error,
    isAddingPet,
    isUpdating,
    fetchUserPets,
    addNewPet,
    updateSelectedPet,
    deleteSelectedPet,
    hasPets,
    isAddingHealth,
    isUpdatingHealth,
    fetchUserVaccines,
    addNewVaccine,
  };
};