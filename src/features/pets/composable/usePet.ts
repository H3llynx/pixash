import { FirebaseError } from "firebase/app";
import { computed, ref } from "vue";
import { addPet, fetchPets } from "../../../services/pets";
import { useAuth } from "../../auth/composables/useAuth";
import type { Pet, PetExtended } from "../types";

const { user } = useAuth();

const pets = ref<PetExtended[]>([]);
const selectedPet = ref<PetExtended | null>(null);
const loading = ref(false)
const error = ref<string | null>(null);
const hasPets = computed(() => pets.value.length > 0);

const fetchUserPets = async () => {
  if (!user.value) {
    pets.value = [];
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
  loading.value = true
  error.value = null

  try {
    await addPet(newPet, user.value.uid);
    await fetchUserPets();
  } catch (e) {
    if (e instanceof FirebaseError) {
      error.value = e.message;
    } else {
      error.value = "An unexpected error occurred";
    }
  } finally {
    loading.value = false
  }
};

const selectPet = (pet: PetExtended) => {
  selectedPet.value = pet;
}

export const usePets = () => {
  return { pets, selectedPet, selectPet, loading, error, fetchUserPets, addNewPet, hasPets };
};