import type { SEX, SPECIES } from "./config";

export type Pet = {
    name: string;
    species: typeof SPECIES[number]["name"];
    breed?: string;
    birthDate: string;
    sex: typeof SEX[number];
    sterilized: boolean;
}

export type PetExtended = Pet & {
    id: string;
    ownerUid: string;
    createdAt: Date;
}