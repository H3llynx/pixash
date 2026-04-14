import { STAGE } from "../health/config";
import { SPECIES } from "./config";
import type { Pet } from "./types";

export const getIcon = (pet: Pet) => {
    if (!pet) return;
    return SPECIES.find(s => s.id === pet.species)?.icon;
}

export const getUnit = (pet: Pet) => {
    if (!pet) return;
    return SPECIES.find(s => s.id === pet.species)?.prefersKg;
}

export const getAge = (pet: Pet) => {
    if (!pet?.birthDate) return;
    const today = new Date();
    const birthDate = new Date(pet.birthDate);
    let years = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        years--;
    }
    if (years >= 1) {
        return {
            stage: STAGE[1].id,
            text: years === 1 ? "1 year old" : `${years} years old`
        };
    }
    let months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    if (months <= 0) {
        return {
            stage: STAGE[0].id,
            text: "Less than a month old"
        }
    };
    return {
        stage: STAGE[0].id,
        text: months === 1 ? "1 month old" : `${months} months old`
    };
};

export const kgToGrams = (kg: number) => Math.round(kg * 1000);
export const gramsToKg = (g: number) => g / 1000;

export const getWeight = (pet: Pet) => {
    if (!pet?.weight) return;
    if (pet.species === "dog" || pet.species === "cat") return `${gramsToKg(pet.weight)} kg`;
    else return `${pet.weight} g`;
};