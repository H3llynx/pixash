import type { SPECIES } from "./config";

export type Pet = {
    name: string,
    species: typeof SPECIES[number]["name"];
    breed?: string;
    birthDate: string,
    ownerUid?: string,
    createdAt?: Date;
}