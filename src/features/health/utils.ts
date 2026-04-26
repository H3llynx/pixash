import { getTodayDayKey, tsToDayKey } from "../../utils";
import { SPECIES } from "../pets/config";
import type { PetExtended } from "../pets/types";
import { VACCINE_TYPES } from "./config";
import type { VaccineExtended, VaccineTypes, VisitExtended } from "./types";

export const resetForm = <T extends object>(formData: T, defaultForm: T) => {
    Object.assign(formData, defaultForm)
};

export const getVaccineTypes = (species: typeof SPECIES[number]["id"] | "default") => {
    if (!species) return;
    const specific = VACCINE_TYPES[species as keyof typeof VACCINE_TYPES] ?? [];
    return [...specific, ...VACCINE_TYPES.default];
};

export const getNextVaccine = (vaccines: VaccineExtended[]) => {
    const todayKey = getTodayDayKey();
    return (
        vaccines
            .filter(vaccine => vaccine.dueOn && tsToDayKey(vaccine.dueOn) >= todayKey)
            .sort((a, b) => tsToDayKey(a.dueOn!) - tsToDayKey(b.dueOn!),)[0] ?? null
    );
};

export const getNextVisit = (visits: VisitExtended[]) => {
    const todayKey = getTodayDayKey();
    return (
        visits
            .filter(visit => visit.date && tsToDayKey(visit.date) >= todayKey)
            .sort((a, b) => tsToDayKey(a.date) - tsToDayKey(b.date),)[0] ?? null
    );
};

export const showTypes = (vaccineType: VaccineTypes["id"][], pet?: PetExtended) => {
    if (!pet) return;
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