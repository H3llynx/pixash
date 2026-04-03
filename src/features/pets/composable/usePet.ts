import { FirebaseError } from "firebase/app";
import { computed, reactive, ref, watch } from "vue";
import { useToast } from "../../../composables/useToast";
import { addPet, fetchPets, updatePet } from "../../../services/pets";
import { useAuth } from "../../user/composables/useAuth";
import type { Pet, PetExtended } from "../types";

const { user } = useAuth();
const { show } = useToast();

const pets = ref<PetExtended[]>([]);
const selectedPet = ref<PetExtended | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const hasPets = computed(() => pets.value.length > 0);
const isAdding = ref(false);
const isUpdating = reactive({
  weight: false,
  microchip: false,
});

const resetIsUpdating = () => {
  Object.keys(isUpdating).forEach((key) => {
    (isUpdating as Record<string, boolean>)[key] = false;
  });
};

const fetchUserPets = async () => {
  if (!user.value) {
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    pets.value = await fetchPets(user.value.uid);
    if (!selectedPet.value && pets.value.length > 0) {
      selectedPet.value = pets.value[0];
    }
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
      show("success", `${addedPet.name}! has been successfully added`, "Success")
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      error.value = e.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false;
    isAdding.value = false;
  }
};

const updateSelectedPet = async (pet: PetExtended, data: Partial<Pick<Pet, "weight" | "microchip" | "microchipped">>) => {
  if (!user.value || !pet) {
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    await updatePet(pet.id, data);
    await fetchUserPets();
    const updatedPet = pets.value.find(p => p.id === pet.id)
    if (updatedPet) {
      selectPet(updatedPet);
      show("success", `${updatedPet.name}! has been successfully updated`, "Success")
    };
  } catch (e) {
    if (e instanceof FirebaseError) {
      error.value = e.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false;
    isAdding.value = false;
  }
};

const selectPet = (pet: PetExtended) => {
  isAdding.value = false;
  resetIsUpdating();
  selectedPet.value = pet;
}

watch(user, (newUser) => {
  if (!newUser) {
    pets.value = [];
    selectedPet.value = null;
    isAdding.value = false;
  };
});

export const usePets = () => {
  return { pets, selectedPet, selectPet, loading, error, isAdding, isUpdating, fetchUserPets, addNewPet, updateSelectedPet, hasPets };
};