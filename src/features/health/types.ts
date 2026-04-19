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
    dueOn?: Timestamp;
}

export type VisitRecord = {
    title: string;
    date: string;
    vet: string;
    notes?: string;
}

export type VisitExented = Omit<VisitRecord, "date"> & {
    id: string;
    petId: string;
    userId: string;
    date: Timestamp;
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