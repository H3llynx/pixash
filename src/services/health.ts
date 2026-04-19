import { addDoc, collection, collectionGroup, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { DB } from "../config/config";
import type { VaccineExtended, VaccineRecord, VisitExented, VisitRecord } from "../features/health/types";
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
        givenAt: vaccine.givenAt ? tsFromInput(vaccine.givenAt) : null,
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

export const updateVaccine = async (
    vaccineId: string,
    petId: string,
    userId: string,
    data: VaccineRecord
) => {
    const updated = {
        petId: petId,
        userId: userId,
        types: data.types,
        stage: data.stage,
        givenAt: data.givenAt ? tsFromInput(data.givenAt) : null,
        dueOn: data.dueOn ? tsFromInput(data.dueOn) : null,
        vet: data.vet,
        notes: data.notes,
    };
    try {
        const docRef = doc(db, DB.users, userId, DB.pets, petId, DB.vaccines, vaccineId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating vaccine: ", error);
    }
};

export const deleteVaccine = async (vaccineId: string, petId: string, userId: string) => {
    try {
        const docRef = doc(db, DB.users, userId, DB.pets, petId, DB.vaccines, vaccineId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting vaccine: ", error);
    }
};

export const addVetVisit = async (visit: VisitRecord, petId: string, userId: string) => {
    const newVisit = {
        petId: petId,
        userId: userId,
        title: visit.title,
        date: tsFromInput(visit.date),
        vet: visit.vet,
        notes: visit.notes,
    };
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.vetVisit), newVisit);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vaccine: ", error);
    }
};

export const fetchVetVisits = async (userId: string): Promise<VisitExented[]> => {
    try {
        const snapshot = await getDocs(query(
            collectionGroup(db, DB.vetVisit),
            where("userId", "==", userId)));
        if (snapshot.empty) {
            console.log("No visit found");
            return [];
        }
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<VisitExented, "id">
        }));
    } catch (error) {
        console.error("Fetch vet visits error:", error);
        return [];
    }
};