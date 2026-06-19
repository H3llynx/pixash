import type { Timestamp } from "firebase/firestore";
import type { LogExtended, TreatmentExtended, VaccineExtended, VisitExtended } from "../care/types";
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