import { SPECIES } from "./config";
import type { Pet } from "./types";

export const getIcon = (pet: Pet) => {
    if (!pet) return;
    return SPECIES.find(s => s.name === pet.species)?.icon;
}

export const getAge = (pet: Pet) => {
    if (!pet) return;
    const today = new Date();
    const birthDate = new Date(pet.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    return age;
};