import { Timestamp } from "firebase/firestore";
import { computed, reactive, ref } from "vue";
import { useAddPictures, type Picture } from "../../../composables/useAddPictures";
import { resetForm } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { LUMP_STATUS, lumpFields } from "../config";
import type { LumpCheckRecord, LumpExtended } from "../types";
import { fromMm, toMm } from "../utils";

const isEditModalOpen = ref<boolean>(false);
const isViewModalOpen = ref<boolean>(false);
const checkedLump = ref<LumpExtended | null>(null);

export const useLumpCheck = () => {
    const { logs } = usePets();
    const pictures = ref<Picture[]>([]);
    const loadedPictures = reactive(new Set<string>());

    const { resetFormPictureState } = useAddPictures(pictures);
    const { status } = lumpFields;

    const lumpChecks = computed(() => logs.value.filter(logs => logs.type === "lump"));
    const selectedLumpChecks = computed(() => lumpChecks.value.filter(check => check.lumpId === checkedLump.value?.id));

    const defaultCheck = {
        size: {
            value: "",
            displayUnit: "cm" as "cm" | "mm"
        },
        pictures: [] as string[],
        notes: "",
        status: status.options[0].id as typeof LUMP_STATUS[number]["id"]
    };

    const checkData = reactive(structuredClone(defaultCheck));

    const resetCheckData = () => resetForm(checkData, defaultCheck);

    const setUnit = (checkData: typeof defaultCheck, newUnit: "cm" | "mm") => {
        if (!checkData.size) return;
        if (checkData.size.displayUnit === newUnit) return;
        if (checkData.size.value) {
            const mm = toMm(Number(checkData.size.value), checkData.size.displayUnit);
            checkData.size.value = String(fromMm(mm, newUnit));
        }
        checkData.size.displayUnit = newUnit;
    };

    const isCheckEmpty = (checkData: typeof defaultCheck, lastStatus: string | undefined) => {
        return (
            !checkData.size?.value &&
            checkData.pictures?.length === 0 &&
            !checkData.notes &&
            checkData.status === lastStatus
        );
    };

    const logCheck = (checkRecord: typeof defaultCheck, lumpId: string): LumpCheckRecord => {
        const check: LumpCheckRecord = {
            lumpId,
            date: Timestamp.now(),
            type: "lump",
            status: checkRecord.status
        };
        if (checkRecord.size && checkRecord.size.value) {
            check.size = {
                displayUnit: checkRecord.size.displayUnit,
                valueMm: String(toMm(Number(checkRecord.size.value), checkRecord.size.displayUnit)),
            };
        }
        if (checkRecord.pictures && checkRecord.pictures.length > 0) check.pictures = [...checkRecord.pictures];
        if (checkRecord.notes) check.notes = checkRecord.notes;

        return check;
    };

    const openModal = (lump: LumpExtended, mode: "edit" | "view") => {
        checkedLump.value = lump;
        if (mode === 'edit') isEditModalOpen.value = true;
        else if (mode === 'view') isViewModalOpen.value = true;
    };

    const closeModal = (mode: "edit" | "view", checkData?: typeof defaultCheck) => {
        if (mode === 'edit') {
            isEditModalOpen.value = false;
            if (checkData) resetForm(checkData, defaultCheck);
            resetFormPictureState(loadedPictures);
        } else if (mode === 'view') {
            isViewModalOpen.value = false;
            checkedLump.value = null;
        }
    };

    const getSizeHistory = (lumpId: string): { date: Timestamp; valueMm: number }[] => {
        return [...lumpChecks.value]
            .filter(check => check.lumpId === lumpId)
            .map(check => {
                if (!check.size) return null;
                return {
                    date: check.date,
                    valueMm: Number(check.size.valueMm),
                };
            })
            .filter((item): item is { date: Timestamp; valueMm: number } => item !== null)
            .sort((a, b) => a.date.toMillis() - b.date.toMillis());
    };

    const isLumpRemoved = (lumpId: string) => lumpChecks.value.find(c => c.lumpId === lumpId && c.status === "removed");

    const NOISE_THRESHOLD_MM = 1;

    const getSizeTrend = (lumpId: string): "up" | "down" | "stable" | null => {
        const history = getSizeHistory(lumpId);
        if (history.length < 2 || isLumpRemoved(lumpId)) return null;
        const last = history[history.length - 1];
        const prev = history[history.length - 2];
        const deltaMm = last.valueMm - prev.valueMm;
        const direction =
            Math.abs(deltaMm) < NOISE_THRESHOLD_MM ? "stable" : deltaMm > 0 ? "up" : "down";
        return direction;
    };

    const getSizeProgression = (lumpId: string): number | null => {
        const history = getSizeHistory(lumpId);
        if (history.length < 2) return null;
        return history[history.length - 1].valueMm - history[0].valueMm;
    };

    return { checkedLump, selectedLumpChecks, lumpChecks, pictures, loadedPictures, resetFormPictureState, defaultCheck, checkData, resetCheckData, setUnit, isCheckEmpty, logCheck, isEditModalOpen, isViewModalOpen, openModal, closeModal, isLumpRemoved, getSizeTrend, getSizeProgression };
}