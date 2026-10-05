import { Timestamp } from "firebase/firestore";
import { reactive, ref } from "vue";
import { useAddPictures, type Picture } from "../../../composables/useAddPictures";
import { resetForm } from "../../../utils";
import { lumpFields } from "../config";
import type { LumpCheck, LumpCheckRecord, LumpExtended } from "../types";
import { isLumpRemoved, toMm } from "../utils";

const isEditModalOpen = ref<boolean>(false);
const isViewModalOpen = ref<boolean>(false);
const checkedLump = ref<LumpExtended | null>(null);

export const useLumpCheck = () => {
    const pictures = ref<Picture[]>([]);
    const loadedPictures = reactive(new Set<string>());

    const { resetFormPictureState } = useAddPictures(pictures);
    const { status } = lumpFields;

    const defaultCheck: LumpCheckRecord = {
        size: {
            value: "",
            displayUnit: "cm" as "cm" | "mm"
        },
        pictures: [] as string[],
        notes: "",
        status: status.options[0].id,
    };

    const checkData = reactive(structuredClone(defaultCheck));

    const resetCheckData = () => resetForm(checkData, defaultCheck);

    const isCheckEmpty = (checkData: LumpCheckRecord, lastStatus: string | undefined) => {
        return (
            !checkData.size.value &&
            checkData.pictures.length === 0 &&
            !checkData.notes &&
            checkData.status === lastStatus
        );
    };

    const logCheck = (checkRecord: LumpCheckRecord): LumpCheck => {
        const check: LumpCheck = { date: Timestamp.now() };

        if (checkRecord.size?.value) {
            check.size = {
                displayUnit: checkRecord.size.displayUnit,
                valueMm: String(toMm(Number(checkRecord.size.value), checkRecord.size.displayUnit)),
            };
        }
        if (checkRecord.pictures?.length) check.pictures = [...checkRecord.pictures];
        if (checkRecord.notes) check.notes = checkRecord.notes;
        if (checkRecord.status) check.status = checkRecord.status;

        return check;
    };

    const openModal = (lump: LumpExtended, mode: "edit" | "view") => {
        checkedLump.value = lump;
        if (mode === 'edit') isEditModalOpen.value = true;
        else if (mode === 'view') isViewModalOpen.value = true;
    };

    const closeModal = (mode: "edit" | "view", checkData?: LumpCheckRecord) => {
        if (mode === 'edit') {
            isEditModalOpen.value = false;
            if (checkData) resetForm(checkData, defaultCheck);
            resetFormPictureState(loadedPictures);
        } else if (mode === 'view') {
            isViewModalOpen.value = false;
            checkedLump.value = null;
        }
    };

    const getSizeHistory = (checks: LumpCheck[]): { date: Timestamp; valueMm: number }[] => {
        return checks
            .filter((c): c is LumpCheck & { size: NonNullable<LumpCheck["size"]> } => !!c.size)
            .map(c => ({ date: c.date, valueMm: Number(c.size.valueMm) }))
            .sort((a, b) => a.date.toMillis() - b.date.toMillis());
    };

    const NOISE_THRESHOLD_MM = 1;

    const getSizeTrend = (lump: LumpExtended): "up" | "down" | "stable" | null => {
        const history = getSizeHistory(lump.checks);
        if (history.length < 2 || isLumpRemoved(lump)) return null;
        const last = history[history.length - 1];
        const prev = history[history.length - 2];
        const deltaMm = last.valueMm - prev.valueMm;
        const direction =
            Math.abs(deltaMm) < NOISE_THRESHOLD_MM ? "stable" : deltaMm > 0 ? "up" : "down";
        return direction;
    };

    const getSizeProgression = (lump: LumpExtended): number | null => {
        const history = getSizeHistory(lump.checks);
        if (history.length < 2) return null;
        return history[history.length - 1].valueMm - history[0].valueMm;
    };

    return { checkedLump, pictures, loadedPictures, resetFormPictureState, defaultCheck, checkData, resetCheckData, isCheckEmpty, logCheck, isEditModalOpen, isViewModalOpen, openModal, closeModal, getSizeTrend, getSizeProgression };
}