import { Timestamp } from "firebase/firestore";
import { tsToDay } from "../../utils";
import { SPECIES } from "../pets/config";
import type { LogExtended, PetExtended } from "../pets/types";
import { ANTIPARASITE_TYPES, MED_FREQUENCY, PARASITES, TREATMENTCOLORS, VACCINE_TYPES } from "./config";
import type { AntiparasiteLogExtended, AntiparasiteTypes, MedicineDb, TreatmentExtended, VaccineExtended, VaccineTypes, VisitExtended, WeightLogExtended } from "./types";

export const resetForm = <T extends object>(
    formData: T,
    defaultForm: T
) => {
    const entries = Object.entries(defaultForm) as [keyof T, T[keyof T]][];
    for (const [key, value] of entries) {
        formData[key] = structuredClone(value);
    }
};

export const getVaccineTypes = (species: typeof SPECIES[number]["id"] | "default") => {
    if (!species) return;
    const specific = VACCINE_TYPES[species as keyof typeof VACCINE_TYPES] ?? [];
    return [...specific, ...VACCINE_TYPES.default];
};

export const getNextVaccine = (vaccines: VaccineExtended[]) => vaccines
    .filter(vaccine => vaccine.dueOn)
    .sort((a, b) => tsToDay(a.dueOn) - tsToDay(b.dueOn))[0] ?? null;

export const getNextVisit = (visits: VisitExtended[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visits
        .filter(visit => tsToDay(visit.date) >= today.getTime())
        .sort((a, b) => tsToDay(a.date) - tsToDay(b.date))[0] ?? null
};

export const getNextAntiparasitic = (logs: LogExtended[]) => {
    const antiparasiticDue = logs.filter(log => log.type === "antiparasite" && log.dueOn) as AntiparasiteLogExtended[];
    return (
        antiparasiticDue.sort((a, b) => tsToDay(a.dueOn!) - tsToDay(b.dueOn!),)[0] ?? null
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
    else if (log.type === "weight") return log.measuredAt;
    return;
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

export const getMedicationProgress = (treatment: TreatmentExtended, medication: MedicineDb): number | null => {
    if (!medication.endDate) return null;

    const now = Date.now();
    const start = treatment.startDate.toMillis()
    const end = medication.endDate.toMillis()

    if (now >= end) return 100;
    if (now <= start) return 0;

    const progress = ((now - start) / (end - start)) * 100;
    return Math.round(Math.min(Math.max(progress, 0), 100));
};

export const getDailyDose = (frequency: string): number | undefined => {
    const count = MED_FREQUENCY.find(f => f.id === frequency)?.dailyDose;
    return count ?? undefined;
};

export const getTreatmentColor = (index: number) => TREATMENTCOLORS[index] ? TREATMENTCOLORS[index % TREATMENTCOLORS.length].rgb : "var(--color-brand)";

export const getTreatmentBackground = (index: number) => TREATMENTCOLORS[index] ? TREATMENTCOLORS[index % TREATMENTCOLORS.length].rgba : "var(--color-separator)";

export const checkOverlapsMonth = (startDate: Timestamp, endDate: Timestamp | undefined, month: Date
): boolean => {
    const monthStart = new Date(month);
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(month);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    monthEnd.setDate(0);
    monthEnd.setHours(23, 59, 59, 999);
    const treatmentStart = startDate.toDate();
    const treatmentEnd = endDate ? endDate.toDate() : new Date(2099, 11, 31);
    return treatmentStart <= monthEnd && treatmentEnd >= monthStart;
};