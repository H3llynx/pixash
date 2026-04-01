import type { SPECIES } from "./config";

export type Pet = {
    name: string;
    species: typeof SPECIES[number]["name"];
    breed?: string;
    birthDate: string;
}

export type PetExtended = Pet & {
    id: string;
    ownerUid: string;
    createdAt: Date;
}