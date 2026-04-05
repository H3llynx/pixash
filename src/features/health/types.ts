import type { Timestamp } from "firebase/firestore";
import type { STAGE, VACCINE_TYPES } from "./config";

export type VaccineTypes = (typeof VACCINE_TYPES)[keyof typeof VACCINE_TYPES][number]

export type VaccineRecord = {
    type: string[];
    stage: typeof STAGE[number];
    givenAt: string;
    dueOn?: string;
    vet?: string;
    notes?: string;
}

export type VaccineExtended = VaccineRecord & {
    id: string;
    petId: string;
    userId: string;
    givenAt: Timestamp;
    dueOn?: Timestamp;
}