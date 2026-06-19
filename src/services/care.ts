import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { DB } from "../config/config";
import { db } from "../config/firebase";
import type { AntiparasiteLogExtended, Log, LogExtended, MedicationLogExtended, OtherLogExtended, TreatmentExtended, TreatmentRecord, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord, WeightLogExtended } from "../features/care/types";
import { getTreatmentEndDate } from "../features/care/utils";
import { tsFromInput } from "../utils";

export const fetchPetVaccines = async (userId: string, petId: string): Promise<VaccineExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.vaccines)
        );
        return snapshot.docs.map(doc => ({
            id: doc.id,
            petId,
            ...doc.data() as Omit<VaccineExtended, "id" | "petId">,
            eventType: "vaccine" as const,
        }));
    } catch (error) {
        console.error("Fetch vaccines error:", error);
        throw error;
    }
};
export const fetchPetVisits = async (userId: string, petId: string): Promise<VisitExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.vetVisits)
        );
        return snapshot.docs.map(doc => ({
            id: doc.id,
            petId,
            ...doc.data() as Omit<VisitExtended, "id" | "petId">,
            eventType: "visit" as const,
        }));
    } catch (error) {
        console.error("Fetch visits error:", error);
        throw error;
    }
};
export const fetchPetTreatments = async (userId: string, petId: string): Promise<TreatmentExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.treatments)
        );
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                petId,
                ...data,
                eventType: "treatment" as const,
                endDate: getTreatmentEndDate(data.medication)
            } as TreatmentExtended;
        });
    } catch (error) {
        console.error("Fetch treatments error:", error);
        throw error;
    }
};
export const fetchPetLogs = async (userId: string, petId: string): Promise<LogExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.logs)
        );
        if (snapshot.empty) {
            console.log("No logs found");
            return [];
        }
        const logs: LogExtended[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const base = {
                id: doc.id,
                petId,
                userId,
                eventType: "log",
            }
            if (data.type === "antiparasite") {
                const log = {
                    ...base,
                    type: "antiparasite",
                    treated: data.treated,
                    givenAt: data.givenAt,
                    dueOn: data.dueOn,
                    notes: data.notes,
                } as AntiparasiteLogExtended;
                return log;
            }
            if (data.type === "weight") {
                const log = {
                    ...base,
                    type: "weight",
                    weight: data.weight,
                    measuredAt: data.measuredAt,
                } as WeightLogExtended;
                return log;
            }
            if (data.type === "medication") {
                const log = {
                    ...base,
                    type: "medication",
                    treatmentId: data.treatmentId,
                    medicineId: data.medicineId,
                    givenAt: data.givenAt,
                } as MedicationLogExtended;
                return log;
            }
            if (data.type === "other") {
                const log = {
                    ...base,
                    type: "other",
                    subtype: data.subtype,
                    date: data.date,
                    notes: data.notes,
                } as OtherLogExtended;
                return log;
            }
            throw new Error(`Unknown log type: ${data.type}`);
        });
        return logs;
    } catch (error) {
        console.error("Fetch logs error:", error);
        throw error;
    }
};

const getVaccineDoc = (userId: string, petId: string, vaccineId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.vaccines, vaccineId);

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
        throw error;
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
        throw error;
    }
};

export const deleteVaccine = async (vaccineId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getVaccineDoc(userId, petId, vaccineId));
    } catch (error) {
        console.error("Error deleting vaccine: ", error);
        throw error;
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
        throw error;
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
        throw error;
    }
};

export const deleteVisit = async (visitId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getVisitDoc(userId, petId, visitId));
    } catch (error) {
        console.error("Error deleting vet appointment: ", error);
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
    let newLog;
    if (log.type === "antiparasite")
        newLog = {
            petId: petId,
            userId: userId,
            type: log.type,
            treated: log.treated,
            givenAt: log.givenAt ? tsFromInput(log.givenAt) : null,
            dueOn: log.dueOn ? tsFromInput(log.dueOn) : null,
            notes: log.notes ?? null,
        };
    else if (log.type === "weight")
        newLog = {
            petId: petId,
            userId: userId,
            type: log.type,
            weight: log.weight,
            measuredAt: serverTimestamp()
        };
    else if (log.type === "medication")
        newLog = {
            petId: petId,
            userId: userId,
            treatmentId: log.treatmentId,
            medicineId: log.medicineId,
            type: log.type,
            givenAt: serverTimestamp()
        };
    else if (log.type === "other")
        newLog = {
            petId: petId,
            userId: userId,
            type: log.type,
            subtype: log.subtype,
            notes: log.notes,
            date: tsFromInput(log.date)
        };
    else {
        throw new Error("Unsupported log type");
    }
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.logs), newLog);
        return docRef.id;
    } catch (error) {
        console.error("Error adding log: ", error);
        throw error;
    }
};

export const updateLog = async (
    logId: string,
    petId: string,
    userId: string,
    log: Log
) => {
    let updated;
    if (log.type === "antiparasite")
        updated = {
            petId: petId,
            userId: userId,
            treated: log.treated,
            givenAt: log.givenAt ? tsFromInput(log.givenAt) : null,
            dueOn: log.dueOn ? tsFromInput(log.dueOn) : null,
            notes: log.notes,
        };
    else if (log.type === "weight")
        updated = {
            petId: petId,
            userId: userId,
            type: log.type,
            weight: log.weight
        };
    else if (log.type === "medication")
        updated = {
            petId: petId,
            userId: userId,
            treatmentId: log.treatmentId,
            medicineId: log.medicineId,
            type: log.type,
            givenAt: log.givenAt
        };
    else if (log.type === "other")
        updated = {
            petId: petId,
            userId: userId,
            type: log.type,
            subtype: log.subtype,
            notes: log.notes,
            date: tsFromInput(log.date)
        };
    else {
        throw new Error("Unsupported log type");
    }
    try {
        const docRef = getLogDoc(userId, petId, logId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating log: ", error);
        throw error;
    }
};

export const deleteLog = async (logId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getLogDoc(userId, petId, logId));
    } catch (error) {
        console.error("Error deleting log: ", error);
        throw error;
    }
};

const getTreatmentDoc = (userId: string, petId: string, treatmentId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.treatments, treatmentId);

export const updateTreatment = async (
    treatmentId: string,
    petId: string,
    userId: string,
    data: TreatmentRecord
) => {
    const updated = {
        petId: petId,
        userId: userId,
        name: data.name,
        startDate: tsFromInput(data.startDate),
        vet: data.vet,
        notes: data.notes,
        medication: data.medication.map(med => ({
            ...med,
            endDate: med.endDate && !med.noEnd ? tsFromInput(med.endDate) : null
        }))
    };
    try {
        const docRef = getTreatmentDoc(userId, petId, treatmentId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating treatment: ", error);
        throw error;
    }
};

export const addTreatment = async (treatment: TreatmentRecord, petId: string, userId: string) => {
    const newTreatment = {
        petId: petId,
        userId: userId,
        name: treatment.name,
        startDate: tsFromInput(treatment.startDate),
        vet: treatment.vet,
        notes: treatment.notes,
        medication: treatment.medication.map(med => ({
            ...med,
            endDate: med.endDate && !med.noEnd ? tsFromInput(med.endDate) : null
        }))
    };
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.treatments), newTreatment);
        return docRef.id;
    } catch (error) {
        console.error("Error adding treatment: ", error);
        throw error;
    }
};

export const deleteTreatment = async (treatmentId: string, petId: string, userId: string) => {
    try {
        const treatmentRef = getTreatmentDoc(userId, petId, treatmentId);
        const logsRef = collection(db, DB.users, userId, DB.pets, petId, DB.logs);
        const associatedLogsSnapshot = await getDocs(query(logsRef, where('treatmentId', '==', treatmentId)));
        const logs = associatedLogsSnapshot.docs;
        const batchLimit = 499;
        for (let i = 0; i < logs.length; i += batchLimit) {
            const batch = writeBatch(db);
            logs.slice(i, i + batchLimit).forEach((logDoc) => batch.delete(logDoc.ref));
            await batch.commit();
        }
        await deleteDoc(treatmentRef);
    } catch (error) {
        console.error("Error deleting treatment: ", error);
        throw error;
    }
};
