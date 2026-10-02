import { Timestamp } from "firebase/firestore";
import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAddPictures, type Picture } from "../../../../../composables/useAddPictures";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { resetForm, shallowEqual } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { lumpFields } from "../../../config";
import type { LumpCheck, LumpCheckRecord, LumpExtended } from "../../../types";
import { fromMm, toMm } from "../../../utils";


export const useLumpForm = () => {
    const { selectedPet, isAddingCare, selectLump, selectedLump, addNewLump, updateSelectedLump, deleteSelectedLump, careError } = usePets();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const loading = ref<boolean>(false);
    const pictures = ref<Picture[]>([]);
    const loadedPictures = reactive(new Set<string>());

    const { hostFormPictures, resetFormPictureState } = useAddPictures(pictures);
    const { location, status } = lumpFields;

    const defaultLump = {
        title: "",
        location: { side: location.options[0].id, x: 0, y: 0 },
    };

    const defaultCheck = {
        size: {
            value: "",
            displayUnit: "cm" as "cm" | "mm"
        },
        pictures: [] as string[],
        notes: "",
        status: status.options[0].id,
    };

    const lumpData = reactive(structuredClone(defaultLump));
    const checkData = reactive(structuredClone(defaultCheck));
    const resetCheckData = () => resetForm(checkData, defaultCheck);

    const reset = () => {
        resetForm(lumpData, defaultLump);
        resetCheckData();
        resetFormPictureState(loadedPictures);
    };

    const fillLumpData = (lump: LumpExtended) => {
        Object.assign(lumpData, {
            title: lump.title,
            location: { ...lump.location },
        });
    };

    const setUnit = (newUnit: "cm" | "mm") => {
        if (checkData.size.displayUnit === newUnit) return;
        if (checkData.size.value) {
            const mm = toMm(Number(checkData.size.value), checkData.size.displayUnit);
            checkData.size.value = String(fromMm(mm, newUnit));
        }
        checkData.size.displayUnit = newUnit;
    };

    const handleClose = () => {
        selectLump(null);
        reset();
    };

    const addCheck = (checkRecord: LumpCheckRecord): LumpCheck => {
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

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        loading.value = true;
        try {
            if (pictures.value.length) await hostFormPictures(checkData);
            if (isAddingCare.lump) {
                const lump = {
                    ...lumpData,
                    checks: [addCheck(checkData)]
                };
                await addNewLump(lump, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.lumpAdded"),
                });
                reset();
                isAddingCare.lump = false;
            }
            else if (selectedLump.value) {
                const originalData = {
                    title: selectedLump.value.title,
                    location: selectedLump.value.location
                };
                if (!shallowEqual(lumpData, originalData)) {
                    await updateSelectedLump(selectedLump.value, lumpData);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.lumpUpdated", { title: lumpData.title }),
                    });
                };
            };
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        }
        finally { loading.value = false; }
    };

    const handleDelete = () => {
        const pet = selectedPet.value;
        const lump = selectedLump.value;
        if (!lump || !pet) return;
        open({
            title: t("dialog.deleteLump.title", { title: lump.title }),
            message: t("dialog.deleteGenericMsg"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    loading.value = true;
                    await deleteSelectedLump(lump);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.lumpDeleted", { title: lump.title }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
                } finally { loading.value = false; }
            }
        });
    };

    return {
        loading, lumpData, checkData, resetCheckData, reset, fillLumpData, setUnit, pictures, loadedPictures, handleClose, handleDelete, handleSubmit
    }
}