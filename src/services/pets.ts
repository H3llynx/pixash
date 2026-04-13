import { addDoc, collection, deleteDoc, deleteField, doc, getDocs, getFirestore, serverTimestamp, updateDoc } from 'firebase/firestore';
import { DB } from '../config/config';
import type { Pet, PetExtended } from '../features/pets/types';

const db = getFirestore();

export const fetchPets = async (userId: string): Promise<PetExtended[]> => {
  try {
    const snapshot = await getDocs(collection(db, DB.users, userId, DB.pets));
    if (snapshot.empty) {
      console.log("No pets found");
      return [];
    }
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<PetExtended, "id">
    }));
  } catch (error) {
    console.error("Fetch pets error:", error);
    return [];
  }
};

export const addPet = async (pet: Pet, userId: string) => {
  const newPet = {
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? null,
    birthDate: pet.birthDate,
    sex: pet.sex,
    sterilized: pet.sterilized,
    microchipped: pet.microchipped,
    ownerUid: userId,
    createdAt: serverTimestamp()
  };
  try {
    const docRef = await addDoc(collection(db, DB.users, userId, DB.pets), newPet);
    return docRef.id;
  } catch (error) {
    console.error("Error adding pet: ", error);
  }
};

export const updatePet = async (
  petId: string,
  userId: string,
  data: Partial<Pet>
) => {
  try {
    const docRef = doc(db, DB.users, userId, DB.pets, petId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating pet: ", error);
  }
};

export const deletePet = async (petId: string, userId: string) => {
  try {
    const docRef = doc(db, DB.users, userId, DB.pets, petId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting pet: ", error);
  }
};

export const deletePetField = async (
  petId: string,
  userId: string,
  field: keyof Pet
) => {
  try {
    const docRef = doc(db, DB.users, userId, DB.pets, petId);
    await updateDoc(docRef, {
      [field]: deleteField()
    });
  } catch (error) {
    console.error(`Error deleting ${field}: `, error);
  }
};