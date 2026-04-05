import { SPECIES } from "../pets/config";
import { VACCINE_TYPES } from "./config";
import type { VaccineExtended } from "./types";

export const getVaccineTypes = (species: typeof SPECIES[number]["name"] | "default") => {
    if (!species) return;
    const pet = species === "small mammal" ? "smallMammal" : species;
    const specific = VACCINE_TYPES[pet as keyof typeof VACCINE_TYPES] ?? [];
    return [...specific, ...VACCINE_TYPES.default];
};

export const getNextVaccine = (vaccines: VaccineExtended[]) => {
    return vaccines
        .filter(vaccine => vaccine.dueOn)
        .sort((a, b) => a.dueOn!.toMillis() - b.dueOn!.toMillis())[0] ?? null;
};