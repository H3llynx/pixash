import { FirebaseError } from "firebase/app";
import { computed, ref } from "vue";
import { addPet, fetchPets } from "../../../services/pets";
import { useAuth } from "../../auth/composables/useAuth";
import type { Pet } from "../types";

const { user } = useAuth();

const pets = ref<Pet[]>([]);
const loading = ref(false)
const error = ref<string | null>(null);
const hasPets = computed(() => pets.value.length > 0);

const fetchUserPets = async () => {
  if (!user.value) {
    pets.value = [];
    return;
  }
  loading.value = true
  error.value = null

  try {
    pets.value = await fetchPets(user.value.uid)
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

const addNewPet = async (newPet: Pet) => {
  if (!user.value || !newPet) {
    return;
  }
  loading.value = true
  error.value = null

  try {
    await addPet(newPet, user.value.uid)
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

export const usePets = () => {
  return { pets, loading, error, fetchUserPets, addNewPet, hasPets };
};