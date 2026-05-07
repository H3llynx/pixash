import { Timestamp } from "firebase/firestore";
import type { ANTIPARASITE_TYPES, STAGE, VACCINE_TYPES } from "./config";

export type VaccineTypes = (typeof VACCINE_TYPES)[keyof typeof VACCINE_TYPES][number];
export type AntiparasiteTypes = (typeof ANTIPARASITE_TYPES)[keyof typeof ANTIPARASITE_TYPES][number];

export type VaccineRecord = {
    types: VaccineTypes["id"][];
    stage: typeof STAGE[number]["id"];
    given?: boolean;
    givenAt?: string;
    nextDose?: boolean;
    dueOn?: string;
    vet?: string;
    notes?: string;
}

export type VaccineExtended = Omit<VaccineRecord, "givenAt" | "dueOn"> & {
    id: string;
    petId: string;
    userId: string;
    givenAt?: Timestamp;
    dueOn: Timestamp;
    eventType: string;
    ts: Timestamp;
}

export type VisitRecord = {
    title: string;
    date: string;
    vet: string;
    notes?: string;
}

export type VisitExtended = Omit<VisitRecord, "date"> & {
    id: string;
    petId: string;
    userId: string;
    date: Timestamp;
    eventType: string;
    ts: Timestamp;
}

export type PetEvent = {
    id: string;
    petId: string;
    userId: string;
    eventType: string;
    ts: Timestamp;
    title?: string;
    weight?: number;
    vet?: string;
    notes?: string;
    types?: VaccineTypes["id"][];
    treated?: AntiparasiteTypes["id"][];
    type?: LogTypes;
    stage?: typeof STAGE[number]["id"];
    date?: Timestamp;
    measuredAt?: Timestamp;
    givenAt?: Timestamp;
    dueOn?: Timestamp;
};

export type TimelineEvent = PetEvent & { ts: Timestamp };

export type Vet = {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    postCode: string;
    types?: string[];
    notes?: string;
    assignedPets?: string[];
    phone?: string;
    email?: string;
    hours?: string;
}

export type VetExtended = Vet & {
    id: string;
}

export type LogTypes = "antiparasite" | "weight";

export type AntiparasiteRecord = {
    treated: AntiparasiteTypes["id"][];
    givenAt: string;
    dueOn?: string;
    notes?: string;
};

export type WeightRecord = {
    weight: number;
};

export type Log =
    | (AntiparasiteRecord & { type: "antiparasite" })
    | (WeightRecord & { type: "weight" });

export type AntiparasiteLogExtended = {
    id: string;
    petId: string;
    userId: string;
    eventType: string;
    ts: Timestamp;
    type: "antiparasite";
    treated: AntiparasiteTypes["id"][];
    givenAt: Timestamp;
    dueOn?: Timestamp;
    notes?: string;
};

export type WeightLogExtended = {
    id: string;
    petId: string;
    userId: string;
    eventType: string;
    ts: Timestamp;
    type: "weight";
    weight: number;
    measuredAt: Timestamp;
};

export type LogExtended = AntiparasiteLogExtended | WeightLogExtended;