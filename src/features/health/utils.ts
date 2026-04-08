import { SPECIES } from "../pets/config";
import type { PetExtended } from "../pets/types";
import { VACCINE_TYPES } from "./config";
import type { VaccineExtended, VaccineTypes } from "./types";

export const getVaccineTypes = (species: typeof SPECIES[number]["id"] | "default") => {
    if (!species) return;
    const specific = VACCINE_TYPES[species as keyof typeof VACCINE_TYPES] ?? [];
    return [...specific, ...VACCINE_TYPES.default];
};

export const getNextVaccine = (vaccines: VaccineExtended[]) => {
    return vaccines
        .filter(vaccine => vaccine.dueOn)
        .sort((a, b) => a.dueOn!.toMillis() - b.dueOn!.toMillis())[0] ?? null;
};

export const showTypes = (vaccineType: VaccineTypes["id"][], pet: PetExtended) => {
    const vaccines = getVaccineTypes(pet.species);
    if (!vaccines) return;
    const labels: string[] = [];
    vaccineType.forEach(type => {
        const vaccine = vaccines.find(t => t.id === type);
        if (vaccine) {
            labels.push(vaccine.label);
        }
    })
    return labels.join(" + ");
}