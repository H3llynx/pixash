import { addDoc, collection, collectionGroup, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { DB } from "../config/config";
import { db } from "../config/firebase";
import type { Log, LogExtended, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord } from "../features/health/types";
import { tsFromInput } from "../utils";

const getVaccineDoc = (userId: string, petId: string, vaccineId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.vaccines, vaccineId);

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
        const docRef = getVaccineDoc(userId, petId, vaccineId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating vaccine: ", error);
    }
};

export const deleteVaccine = async (vaccineId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getVaccineDoc(userId, petId, vaccineId));
    } catch (error) {
        console.error("Error deleting vaccine: ", error);
    }
};


const getVisitDoc = (userId: string, petId: string, visitId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.vetVisits, visitId);

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
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.vetVisits), newVisit);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vaccine: ", error);
    }
};

export const fetchVetVisits = async (userId: string): Promise<VisitExtended[]> => {
    try {
        const snapshot = await getDocs(query(
            collectionGroup(db, DB.vetVisits),
            where("userId", "==", userId)));
        if (snapshot.empty) {
            console.log("No visit found");
            return [];
        }
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<VisitExtended, "id">
        }));
    } catch (error) {
        console.error("Fetch vet visits error:", error);
        return [];
    }
};

export const updateVetVisit = async (
    visitId: string,
    petId: string,
    userId: string,
    data: VisitRecord
) => {
    const updated = {
        petId: petId,
        userId: userId,
        title: data.title,
        date: tsFromInput(data.date),
        vet: data.vet,
        notes: data.notes,
    };
    try {
        const docRef = getVisitDoc(userId, petId, visitId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating vet appointment: ", error);
    }
};

export const deleteVisit = async (visitId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getVisitDoc(userId, petId, visitId));
    } catch (error) {
        console.error("Error deleting vet appointment: ", error);
    }
};

const getVetCollection = (userId: string) => collection(db, DB.users, userId, DB.vets);
const getVetDoc = (userId: string, vetId: string) => doc(db, DB.users, userId, DB.vets, vetId);

export const fetchVets = async (userId: string): Promise<VetExtended[]> => {
    try {
        const snapshot = await getDocs(getVetCollection(userId));
        if (snapshot.empty) {
            console.log("No vets found");
            return [];
        }
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<VetExtended, "id">
        }));
    } catch (error) {
        console.error("Fetch vets error:", error);
        return [];
    }
};

export const addVet = async (vet: Vet, userId: string) => {
    const newPet = {
        name: vet.name,
        address1: vet.address1,
        address2: vet.address2,
        city: vet.city,
        postCode: vet.postCode,
        types: vet.types,
        notes: vet.notes,
        assignedPets: vet.assignedPets,
        phone: vet.phone,
        email: vet.email,
        hours: vet.hours,
        ownerUid: userId,
        createdAt: serverTimestamp()
    };
    try {
        const docRef = await addDoc(getVetCollection(userId), newPet);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vet: ", error);
    }
};

export const updateVet = async (
    vetId: string,
    userId: string,
    data: Partial<Vet>
) => {
    try {
        const docRef = getVetDoc(userId, vetId);
        await updateDoc(docRef, data);
    } catch (error) {
        console.error("Error updating vet: ", error);
    }
};

export const deleteVet = async (vetId: string, userId: string) => {
    try {
        await deleteDoc(getVetDoc(userId, vetId));
    } catch (error) {
        console.error("Error deleting vet: ", error);
        throw error;
    }
};

const getLogDoc = (userId: string, petId: string, logId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.logs, logId);
export const addLog = async (log: Log, petId: string, userId: string) => {
    const newLog = {
        petId: petId,
        userId: userId,
        type: log.type,
        treated: log.treated,
        givenAt: log.givenAt ? tsFromInput(log.givenAt) : null,
        dueOn: log.dueOn ? tsFromInput(log.dueOn) : null,
        other: log.other ?? null,
    };
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.logs), newLog);
        return docRef.id;
    } catch (error) {
        console.error("Error adding vaccine: ", error);
    }
};

export const fetchLogs = async (userId: string): Promise<LogExtended[]> => {
    try {
        const snapshot = await getDocs(query(
            collectionGroup(db, DB.logs),
            where("userId", "==", userId)));
        if (snapshot.empty) {
            console.log("No logs found");
            return [];
        }
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as Omit<LogExtended, "id">
        }));
    } catch (error) {
        console.error("Fetch log error:", error);
        return [];
    }
};

export const updateLog = async (
    logId: string,
    petId: string,
    userId: string,
    data: Log
) => {
    const updated = {
        petId: petId,
        userId: userId,
        treated: data.treated,
        givenAt: tsFromInput(data.givenAt),
        dueOn: data.dueOn ? tsFromInput(data.dueOn) : null,
        other: data.other,
    };
    try {
        const docRef = getLogDoc(userId, petId, logId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating log: ", error);
    }
};

export const deleteLog = async (logId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getLogDoc(userId, petId, logId));
    } catch (error) {
        console.error("Error deleting log: ", error);
    }
};