import { ref } from "vue";
import type { PetExtended } from "../../pets/types";
import type { MedicationLogExtended, MedicineDb, TreatmentExtended } from "../types";
import { getDailyDose, getIntervalHours } from "../utils";

const loading = ref<boolean>(false);
const isEditing = ref<boolean>(false);

export const useTreatmentTracking = () => {
    const DOSE_WINDOW = { startHour: 8, endHour: 21 };

    const getTodayLoggedList = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended[] => {
        const today = new Date().toLocaleDateString();
        return pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id &&
            log.givenAt &&
            log.givenAt.toDate().toLocaleDateString() === today
        ) as MedicationLogExtended[];
    };

    const getLatestLog = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): MedicationLogExtended | undefined => {
        const logs = pet.logs.filter(log =>
            log.type === "medication" &&
            log.treatmentId === treatment.id &&
            log.medicineId === medication.id &&
            log.givenAt
        ) as MedicationLogExtended[];
        return logs.sort((a, b) => b.givenAt.toDate().getTime() - a.givenAt.toDate().getTime())[0];
    };

    const getDosesToLog = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): number => {
        const loggedList = getTodayLoggedList(pet, treatment, medication) || [];
        const dailyDose = getDailyDose(medication.frequency);
        return dailyDose !== undefined ? dailyDose - loggedList.length : 1;
    };

    const getMissedDoses = (
        pet: PetExtended,
        treatment: TreatmentExtended,
        medication: MedicineDb
    ): number => {
        const latestLog = getLatestLog(pet, treatment, medication);
        const intervalHours = getIntervalHours(medication.frequency);
        const dailyDose = getDailyDose(medication.frequency);
        if (intervalHours === undefined) return 0;
        const intervalMs = intervalHours * 3600000

        if (!latestLog && (dailyDose === undefined || dailyDose === 1)) {
            const firstDayThreshold = treatment.startDate.toDate();
            firstDayThreshold.setHours(DOSE_WINDOW.endHour, 0, 0, 0);
            return Date.now() >= firstDayThreshold.getTime() ? 1 : 0;
        };

        if (dailyDose === undefined || dailyDose === 1) {
            return Date.now() >= latestLog!.givenAt.toMillis() + intervalMs ? 1 : 0;
        };

        const loggedToday = getTodayLoggedList(pet, treatment, medication);
        if (loggedToday.length >= dailyDose) return 0;
        const referenceTimestamp = loggedToday.length === 0
            ? new Date().setHours(DOSE_WINDOW.startHour, 0, 0, 0)
            : latestLog!.givenAt.toMillis() + intervalMs;
        return Date.now() >= referenceTimestamp ? 1 : 0;
    };

    return {
        loading,
        isEditing,
        getTodayLoggedList,
        getDosesToLog,
        getMissedDoses
    };

}