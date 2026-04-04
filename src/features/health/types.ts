import type { Timestamp } from "firebase/firestore";
import type { STAGE } from "./config";

export type VaccineRecord = {
    type: string;
    stage: typeof STAGE[number];
    givenAt: Timestamp;
    dueAt?: Timestamp;
    repeatEveryMonths?: number;
    vet?: string;
    notes?: string;
}