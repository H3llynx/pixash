import { addDoc, collection, collectionGroup, getDocs, query, where } from "firebase/firestore";
import { DB } from "../config/config";
import type { VaccineExtended, VaccineRecord } from "../features/health/types";
import { db } from "../firebase";
import { tsFromInput } from "../utils";

export const fetchVaccines = async (userId: string): Promise<VaccineExtended[]> => {
    try {
        const snapshot = await getDocs(query(
            collectionGroup(db, DB.vaccines),
            where("userId", "==", userId)));
        if (snapshot.empty) {
            console.log("No vaccine found");
            return [];
        }
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<VaccineExtended, "id">
        }));
    } catch (error) {
        console.error("Fetch vaccines error:", error);
        return [];
    }
};

export const addVaccine = async (vaccine: VaccineRecord, petId: string, userId: string) => {
    const newVaccine = {
        petId: petId,
        userId: userId,
        types: vaccine.types,
        stage: vaccine.stage,
        givenAt: tsFromInput(vaccine.givenAt),
        dueOn: vaccine.dueOn ? tsFromInput(vaccine.dueOn) : null,
        vet: vaccine.vet,
        notes: vaccine.notes,
    };
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.vaccines), newVaccine);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vaccine: ", error);
    }
};