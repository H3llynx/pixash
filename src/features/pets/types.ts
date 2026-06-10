import type { Timestamp } from "firebase/firestore";
import type { AntiparasiteLogExtended, AntiparasiteRecord, MedicationLogExtended, MedicationRecord, TreatmentExtended, VaccineExtended, VisitExtended, WeightLogExtended, WeightRecord } from "../health/types";
import type { SPECIES } from "./config";

export type Pet = {
    name: string;
    species: typeof SPECIES[number]["id"];
    breed?: string | null;
    birthDate: string;
    sex: string;
    sterilized: boolean;
    microchipped: boolean;
    weight?: number;
    microchip?: string;
    photo?: string;
    insured?: boolean;
    insurance?: Insurance | null;
}

export type PetExtended = Pet & {
    id: string;
    ownerUid: string;
    createdAt: Timestamp;
    vaccines: VaccineExtended[];
    vetVisits: VisitExtended[];
    treatments: TreatmentExtended[];
    logs: LogExtended[];
    nextVaccine?: VaccineExtended;
    nextVetVisit?: VisitExtended;
    nextAntiparasitic?: LogExtended;
}

export type Insurance = {
    company: string;
    policy: string;
    contact: string;
    web?: string;
}

export type Log =
    | (AntiparasiteRecord & { type: "antiparasite" })
    | (WeightRecord & { type: "weight" })
    | (MedicationRecord & { type: "medication" })
    | {
        type: "other";
        subtype: string;
        date: string;
        notes?: string;
    };

export type OtherLogExtended = {
    id: string;
    petId: string;
    userId: string;
    eventType: "log";
    ts: Timestamp;
    type: "other";
    subtype: string;
    date: Timestamp;
    notes?: string;
};
export type LogExtended = AntiparasiteLogExtended | WeightLogExtended | MedicationLogExtended | OtherLogExtended;