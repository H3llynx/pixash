import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch } from "firebase/firestore";
import { DB } from "../config/config";
import { db } from "../config/firebase";
import type { AntiparasiteLogExtended, Log, LogExtended, LumpCheckExtended, LumpExtended, LumpRecord, MedicationLogExtended, OtherLogExtended, TreatmentExtended, TreatmentRecord, VaccineExtended, VaccineRecord, Vet, VetExtended, VisitExtended, VisitRecord, WeightLogExtended } from "../features/care/types";
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
export const fetchPetLumps = async (userId: string, petId: string): Promise<LumpExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.lumps)
        );
        return snapshot.docs.map(doc => ({
            id: doc.id,
            petId,
            ...doc.data() as Omit<LumpExtended, "id" | "petId">,
        }));
    } catch (error) {
        console.error("Fetch lumps error:", error);
        throw error;
    }
};
export const fetchPetLogs = async (userId: string, petId: string): Promise<LogExtended[]> => {
    try {
        const snapshot = await getDocs(
            collection(db, DB.users, userId, DB.pets, petId, DB.logs)
        );
        if (snapshot.empty) {
            return [];
        }
        const logs: LogExtended[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            const base = {
                id: doc.id,
                petId,
                userId,
                eventType: "log",
            };
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
            };
            if (data.type === "weight") {
                const log = {
                    ...base,
                    type: "weight",
                    weight: data.weight,
                    measuredAt: data.measuredAt,
                } as WeightLogExtended;
                return log;
            };
            if (data.type === "medication") {
                const log = {
                    ...base,
                    type: "medication",
                    treatmentId: data.treatmentId,
                    medicineId: data.medicineId,
                    givenAt: data.givenAt,
                } as MedicationLogExtended;
                return log;
            };
            if (data.type === "lump") {
                const log = {
                    ...base,
                    type: "lump",
                    lumpId: data.lumpId,
                    date: data.date,
                    size: data.size,
                    pictures: data.pictures,
                    notes: data.notes,
                    status: data.status
                } as LumpCheckExtended;
                return log;
            };
            if (data.type === "other") {
                const log = {
                    ...base,
                    type: "other",
                    subtype: data.subtype,
                    date: data.date,
                    pictures: data.pictures,
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

const getVaccineDoc = (vaccine: VaccineExtended, userId: string) => doc(db, DB.users, userId, DB.pets, vaccine.petId, DB.vaccines, vaccine.id);

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
    vaccine: VaccineExtended,
    userId: string,
    data: VaccineRecord
) => {
    const updated = {
        petId: vaccine.petId,
        userId: userId,
        types: data.types,
        stage: data.stage,
        givenAt: data.givenAt ? tsFromInput(data.givenAt) : null,
        dueOn: data.dueOn ? tsFromInput(data.dueOn) : null,
        vet: data.vet,
        notes: data.notes,
    };
    try {
        const docRef = getVaccineDoc(vaccine, userId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating vaccine: ", error);
        throw error;
    }
};

export const deleteVaccine = async (vaccine: VaccineExtended, userId: string) => {
    try {
        await deleteDoc(getVaccineDoc(vaccine, userId));
    } catch (error) {
        console.error("Error deleting vaccine: ", error);
        throw error;
    }
};

const getVisitDoc = (visit: VisitExtended, userId: string) => doc(db, DB.users, userId, DB.pets, visit.petId, DB.vetVisits, visit.id);

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
    visit: VisitExtended,
    userId: string,
    data: VisitRecord
) => {
    const updated = {
        petId: visit.petId,
        userId: userId,
        title: data.title,
        date: tsFromInput(data.date),
        vet: data.vet,
        notes: data.notes,
    };
    try {
        const docRef = getVisitDoc(visit, userId);
        await updateDoc(docRef, updated);
    } catch (error) {
        console.error("Error updating vet appointment: ", error);
        throw error;
    }
};

export const deleteVisit = async (visit: VisitExtended, userId: string) => {
    try {
        await deleteDoc(getVisitDoc(visit, userId));
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
    const newVet = {
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
        const docRef = await addDoc(getVetCollection(userId), newVet);
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
            ...log,
            givenAt: log.givenAt ? tsFromInput(log.givenAt) : null,
            dueOn: log.dueOn ? tsFromInput(log.dueOn) : null,
            notes: log.notes ?? null,
        };
    else if (log.type === "weight")
        newLog = {
            petId: petId,
            userId: userId,
            ...log,
            measuredAt: serverTimestamp()
        };
    else if (log.type === "medication")
        newLog = {
            petId: petId,
            userId: userId,
            ...log,
            givenAt: log.givenAt ?? serverTimestamp()
        };
    else if (log.type === "lump")
        newLog = {
            petId: petId,
            userId: userId,
            ...log,
            date: serverTimestamp()
        }
    else if (log.type === "other")
        newLog = {
            petId: petId,
            userId: userId,
            type: log.type,
            subtype: log.subtype,
            pictures: log.pictures,
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
    else if (log.type === "lump")
        updated = {
            petId: petId,
            userId: userId,
            lumpId: log.lumpId,
            date: log.date,
            size: log.size,
            pictures: log.pictures,
            notes: log.notes,
            status: log.status,
        };
    else if (log.type === "other")
        updated = {
            petId: petId,
            userId: userId,
            type: log.type,
            subtype: log.subtype,
            pictures: log.pictures,
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

export const deleteLog = async (log: Pick<LogExtended, "id" | "petId">, userId: string) => {
    try {
        await deleteDoc(getLogDoc(userId, log.petId, log.id));
    } catch (error) {
        console.error("Error deleting log: ", error);
        throw error;
    }
};

const getTreatmentDoc = (treatment: TreatmentExtended, userId: string) => doc(db, DB.users, userId, DB.pets, treatment.petId, DB.treatments, treatment.id);

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

export const updateTreatment = async (
    treatment: TreatmentExtended,
    userId: string,
    data: TreatmentRecord
) => {
    const updated = {
        petId: treatment.petId,
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
    const initialMedicationIds = new Set(treatment.medication.map(med => med.id))
    const updatedMedicationIds = new Set(updated.medication.map(med => med.id))
    const removedMedicationIds: string[] = [];
    for (const id of initialMedicationIds) {
        if (!updatedMedicationIds.has(id)) removedMedicationIds.push(id);
    }
    try {
        const docRef = getTreatmentDoc(treatment, userId);
        await updateDoc(docRef, updated);

        if (removedMedicationIds.length) {
            const batch = writeBatch(db);
            for (const medId of removedMedicationIds) {
                const q = query(
                    collection(db, DB.users, userId, DB.pets, treatment.petId, DB.logs),
                    where("type", "==", "medication"),
                    where("medicineId", "==", medId),
                    where("treatmentId", "==", treatment.id)
                );
                const snap = await getDocs(q);
                snap.docs.forEach(d => batch.delete(d.ref));
            }
            await batch.commit();
        }
    } catch (error) {
        console.error("Error updating treatment: ", error);
        throw error;
    }
};

export const deleteTreatment = async (treatment: TreatmentExtended, userId: string) => {
    try {
        const treatmentRef = getTreatmentDoc(treatment, userId);
        const logsRef = collection(db, DB.users, userId, DB.pets, treatment.petId, DB.logs);
        const associatedLogsSnapshot = await getDocs(query(logsRef, where('treatmentId', '==', treatment.id)));
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

const getLumpDoc = (userId: string, petId: string, lumpId: string) => doc(db, DB.users, userId, DB.pets, petId, DB.lumps, lumpId);

export const addLump = async (lump: LumpRecord, petId: string, userId: string) => {
    const newLump = {
        petId: petId,
        userId: userId,
        createdAt: serverTimestamp(),
        ...lump
    };
    try {
        const docRef = await addDoc(collection(db, DB.users, userId, DB.pets, petId, DB.lumps), newLump);
        return docRef.id;
    } catch (error) {
        console.error("Error adding lump: ", error);
        throw error;
    }
};

export const deleteLump = async (lumpId: string, petId: string, userId: string) => {
    try {
        await deleteDoc(getLumpDoc(userId, petId, lumpId));
    } catch (error) {
        console.error("Error deleting lump: ", error);
        throw error;
    }
};

export const updateLump = async (
    lump: Pick<LumpExtended, "id" | "petId">,
    userId: string,
    data: Pick<LumpRecord, "title" | "location">
) => {
    const docRef = getLumpDoc(userId, lump.petId, lump.id);
    try {
        await updateDoc(docRef, {
            title: data.title,
            location: data.location,
        });
    } catch (error) {
        console.error("Error updating lump: ", error);
        throw error;
    }
};