import { addDoc, collection, getDocs, getFirestore, query, serverTimestamp, where } from 'firebase/firestore';
import { DB } from '../config';
import type { Pet } from '../features/pets/types';

const db = getFirestore();

export const addPet = async (pet: Pet, userId: string) => {
  const { name, species, breed, birthDate } = pet
  const newPet = {
    name: name,
    species: species,
    breed: breed ?? null,
    birthDate: birthDate,
    ownerUid: userId,
    createdAt: serverTimestamp()
  };
  try {
    const docRef = await addDoc(collection(db, DB.pets), newPet);
    console.log("Document written with ID: ", docRef.id);
    console.log(docRef)
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const fetchPets = async (userId: string): Promise<Pet[]> => {
  try {
    const snapshot = await getDocs(query(
      collection(db, DB.pets),
      where("ownerUid", "==", userId)
    ));

    if (snapshot.empty) {
      console.log("No pets found");
      return [];
    }

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Pet, "id">
    }));
  } catch (error) {
    console.error("Fetch pets error:", error);
    return [];
  }
};