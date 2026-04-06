import type { VaccineExtended } from "../health/types";
import type { SEX, SPECIES } from "./config";

export type Pet = {
    name: string;
    species: typeof SPECIES[number]["id"];
    breed?: string | undefined;
    birthDate: string;
    sex: typeof SEX[number];
    sterilized: boolean;
    microchipped: boolean;
    weight?: number;
    microchip?: string;
}

export type PetExtended = Pet & {
    id: string;
    ownerUid: string;
    createdAt: Date;
    vaccines: VaccineExtended[];
    nextVaccine?: VaccineExtended;
}