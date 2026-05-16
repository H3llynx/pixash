import { Timestamp } from "firebase/firestore";
import { getTodayDayKey, tsToDayKey } from "../../utils";
import { SPECIES } from "../pets/config";
import type { PetExtended } from "../pets/types";
import { ANTIPARASITE_TYPES, PARASITES, VACCINE_TYPES } from "./config";
import type { AntiparasiteLogExtended, AntiparasiteTypes, LogExtended, MedicineDb, TreatmentExtended, VaccineExtended, VaccineTypes, VisitExtended, WeightLogExtended } from "./types";

export const resetForm = <T extends object>(
    formData: T,
    defaultForm: T,
    options?: { exclude?: (keyof T)[] }
) => {
    const exclude = options?.exclude ?? [];
    const entries = Object.entries(defaultForm) as [keyof T, T[keyof T]][];

    for (const [key, value] of entries) {
        if (!exclude.includes(key)) {
            formData[key] = structuredClone(value);
        }
    }
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
            .sort((a, b) => tsToDayKey(a.dueOn) - tsToDayKey(b.dueOn),)[0] ?? null
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

export const getNextAntiparasitic = (logs: LogExtended[]) => {
    const todayKey = getTodayDayKey();
    const antiparasiticDue = logs.filter(log => log.type === "antiparasite" && log.dueOn) as AntiparasiteLogExtended[];
    return (
        antiparasiticDue
            .filter(log => tsToDayKey(log.dueOn!) >= todayKey)
            .sort((a, b) => tsToDayKey(a.dueOn!) - tsToDayKey(b.dueOn!),)[0] ?? null
    );
};

export const showTypes = (vaccineType: VaccineTypes["id"][], pet?: PetExtended) => {
    if (!pet) return;
    const vaccines = getVaccineTypes(pet.species);
    if (!vaccines) return;
    const labels: string[] = [];
    vaccineType.forEach(type => {
        const vaccine = vaccines.find(t => t.id === type);
        if (vaccine) labels.push(vaccine.label);
    })
    return labels.join(" + ");
}

export const getAntiparasites = (species: typeof SPECIES[number]["id"] | "default") => {
    if (!species) return;
    const specific = ANTIPARASITE_TYPES[species as keyof typeof ANTIPARASITE_TYPES] ?? [];
    return [...specific, ...ANTIPARASITE_TYPES.default];
};

export const showAntiparasites = (treated: AntiparasiteTypes["id"][], locale: string, t: (key: string) => string) => {
    const labels: string[] = [];
    treated.forEach(parasite => {
        const item = Object.values(PARASITES).find(p => p.id === parasite);
        if (item) labels.push(item.label);
    })
    return new Intl.ListFormat(locale).format(labels.map(l => t(l).toLowerCase()));
};

export const getCurrentWeight = (logs: LogExtended[]) => {
    const weightLogs = logs.filter(log => log.type === "weight") as WeightLogExtended[];
    return weightLogs.sort((a, b) => b.measuredAt.seconds - a.measuredAt.seconds).at(0)?.weight ?? undefined;
};

export const getLogTs = (log: LogExtended) => {
    if (log.type === "antiparasite") return log.dueOn ?? log.givenAt!;
    return log.measuredAt;
};

export const getTreatmentEndDate = (medication: MedicineDb[]): Timestamp | null => {
    if (medication.some(med => med.noEnd)) return null;
    const endDates = medication
        .map(med => med.endDate)
        .filter(date => date !== null)
        .map(ts => ts!.seconds);

    if (endDates.length === 0) return null;

    return new Timestamp(Math.max(...endDates), 0);
};

export const getTreatmentProgress = (treatment: TreatmentExtended): number | null => {
    if (!treatment.endDate) return null;

    const now = Date.now();
    const start = treatment.startDate.toMillis()
    const end = treatment.endDate.toMillis()

    if (now >= end) return 100;
    if (now <= start) return 0;

    const progress = ((now - start) / (end - start)) * 100;
    return Math.round(Math.min(Math.max(progress, 0), 100));
};