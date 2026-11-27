import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAddPictures, type Picture } from "../../../../../composables/useAddPictures";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { resetForm, shallowEqual } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { useLumpCheck } from "../../../composables/useLumpCheck";
import { LUMP_STATE, lumpFields } from "../../../config";
import type { LumpExtended } from "../../../types";


export const useLumpForm = () => {
    const { selectedPet, isAddingCare, selectLump, selectedLump, addNewLump, updateSelectedLump, deleteSelectedLump, careError } = usePets();
    const { buildCheck } = useLumpCheck();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();
    const { checkData, defaultCheck } = useLumpCheck();

    const loading = ref<boolean>(false);
    const pictures = ref<Picture[]>([]);
    const loadedPictures = reactive(new Set<string>());

    const { hostFormPictures, resetFormPictureState } = useAddPictures(pictures);
    const { location, state } = lumpFields;

    const defaultLump = {
        title: "",
        location: { side: location.options[0].id, x: 0, y: 0 },
        state: state.options[0].id as typeof LUMP_STATE[number]["id"]
    };

    const lumpData = reactive(structuredClone(defaultLump));

    const reset = () => {
        resetForm(lumpData, defaultLump);
        resetForm(checkData, defaultCheck);
        resetFormPictureState(loadedPictures);
    };

    const fillLumpData = (lump: LumpExtended) => {
        Object.assign(lumpData, {
            title: lump.title,
            location: { ...lump.location },
            state: lump.state
        });
    };

    const handleClose = () => {
        selectLump(null);
        reset();
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        loading.value = true;
        try {
            if (pictures.value.length) await hostFormPictures(checkData);
            if (isAddingCare.lump) {
                await addNewLump(lumpData, (lumpId) => buildCheck(checkData, lumpId), selectedPet.value.id);
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
                    location: selectedLump.value.location,
                    state: selectedLump.value.state
                };
                if (!shallowEqual(lumpData, originalData)) {
                    const title = lumpData.title;
                    await updateSelectedLump(selectedLump.value, lumpData);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.lumpUpdated", { title: title }),
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
        loading, lumpData, checkData, reset, fillLumpData, pictures, loadedPictures, handleClose, handleDelete, handleSubmit
    }
}