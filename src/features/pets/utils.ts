import { SPECIES } from "./config";
import type { Pet } from "./types";

export const getIcon = (pet: Pet) => {
    if (!pet) return;
    return SPECIES.find(s => s.name === pet.species)?.icon;
}