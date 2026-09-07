import { computed, ref } from "vue";
import { usePets } from "../../pets/composables/usePets";
import type { PetExtended } from "../../pets/types";
import type { MedicationLogExtended, MedicineDb, TreatmentExtended } from "../types";
import { checkOverlapsMonth, getDailyDose, getIntervalHours, getTreatmentColor } from "../utils";
import { useEvents } from "./useEvents";

const loading = ref<boolean>(false);
const isEditing = ref<boolean>(false);

export const useTreatments = () => {
    const { treatments, selectedPet } = usePets();
    const { currentMonth } = useEvents()

    const DOSE_WINDOW = { startHour: 8, endHour: 21 };

    const byStartThenEndDesc = (a: TreatmentExtended, b: TreatmentExtended) => {
        const startDiff = b.startDate!.seconds - a.startDate!.seconds;
        if (startDiff !== 0) return startDiff;
        return b.endDate!.seconds - a.endDate!.seconds;
    }

    const treatmentsThisMonth = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => {
                const overlapsMonth = checkOverlapsMonth(
                    t.startDate,
                    t.endDate!,
                    currentMonth.value
                );
                const isNotExpired = !t.endDate || t.endDate.toDate() >= now;
                return overlapsMonth && isNotExpired;
            })
            .sort(byStartThenEndDesc)
            .map((t, index) => ({ ...t, color: getTreatmentColor(index) }))
    });

    const activeTreatments = computed(() => {
        const now = new Date();
        return treatments.value
            .filter(t => t.startDate.toDate() <= now && (!t.endDate || t.endDate.toDate() >= now))
            .filter(t => t.petId === selectedPet.value?.id)
            .sort(byStartThenEndDesc)
    });

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
        byStartThenEndDesc,
        treatmentsThisMonth,
        activeTreatments,
        getTodayLoggedList,
        getDosesToLog,
        getMissedDoses
    };

}