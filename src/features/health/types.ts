import type { Timestamp } from "firebase/firestore";
import type { STAGE, VACCINE_TYPES } from "./config";

export type VaccineTypes = (typeof VACCINE_TYPES)[keyof typeof VACCINE_TYPES][number];

export type VaccineRecord = {
    types: string[];
    stage: typeof STAGE[number];
    givenAt: string;
    nextDose?: boolean;
    dueOn?: string;
    vet?: string;
    notes?: string;
}

export type VaccineExtended = VaccineRecord & {
    types: VaccineTypes["id"];
    id: string;
    petId: string;
    userId: string;
    givenAt: Timestamp;
    dueOn?: Timestamp;
}