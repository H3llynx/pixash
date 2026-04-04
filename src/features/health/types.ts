import type { Timestamp } from "firebase/firestore";
import type { SPECIES } from "../pets/config";

type VaccineStage = "puppy" | "adult"

export type VaccineRecord = {
    type: string;
    label: string;
    species: typeof SPECIES[number]["name"];
    givenAt: Timestamp;
    repeatEveryMonths: number;
    stage: VaccineStage;
    notes?: string;
}