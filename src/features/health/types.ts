import { Timestamp } from "firebase/firestore";
import type { STAGE, VACCINE_TYPES } from "./config";

export type VaccineTypes = (typeof VACCINE_TYPES)[keyof typeof VACCINE_TYPES][number];

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
    vet?: string;
    notes?: string;
    types?: VaccineTypes["id"][];
    stage?: typeof STAGE[number]["id"];
    date?: Timestamp;
    givenAt?: Timestamp;
    dueOn?: Timestamp;
}

export type Vet = {
    name: string;
    address1: string;
    address2: string;
    city: string;
    postCode: string;
    types: string[];
    notes?: string;
    assignedPets?: string[];
    phone?: string;
    email?: string;
    hours?: string;
}

export type VetExtended = Vet & {
    id: string;
}