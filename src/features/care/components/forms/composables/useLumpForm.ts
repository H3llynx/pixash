import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Picture } from "../../../../../composables/useAddPictures";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { hostImg } from "../../../../../services/img-hosting";
import { resetForm, shallowEqual } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { lumpFields } from "../../../config";
import type { LumpExtended } from "../../../types";
import { fromMm, toMm } from "../../../utils";


export const useLumpForm = () => {
    const { selectedPet, isAddingCare, selectLump, selectedLump, careError } = usePets();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const loading = ref<boolean>(false);
    const pictures = ref<Picture[]>([]);

    const { location, status } = lumpFields;

    const defaultForm = {
        title: "",
        location: {
            side: location.options[0].id,
            x: 0,
            y: 0,
        },
        size: {
            data: "",
            unit: "cm" as ("cm" | "mm")
        },
        pictures: [] as string[],
        notes: "",
        status: status.options[0].id
    };

    const formData = reactive({ ...defaultForm });
    const fillLumpData = (lump: LumpExtended) => {
        Object.assign(formData, {
            title: lump.title,
            location: {
                side: lump.location.side,
                x: lump.location.x,
                y: lump.location.y,
            },
            size: {
                data: String(fromMm(lump.size.valueMm, lump.size.displayUnit)),
                unit: lump.size.displayUnit
            },
            pictures: lump.pictures,
            notes: lump.notes ?? "",
            status: lump.status
        })
    };

    const setUnit = (newUnit: "cm" | "mm") => {
        if (formData.size.unit === newUnit) return;
        if (formData.size.data) {
            const mm = toMm(Number(formData.size.data), formData.size.unit);
            formData.size.data = String(fromMm(mm, newUnit));
        }
        formData.size.unit = newUnit;
    };

    const loadedPictures = reactive(new Set<string>());
    const deletePicture = async (picture: string) => {
        formData.pictures = formData.pictures.filter(p => p !== picture);
    };

    const handleClose = () => {
        selectLump(null);
        pictures.value = [];
        loadedPictures.clear();
        resetForm(formData, defaultForm);
    };

    const hostPictures = async () => {
        for (const picture of pictures.value) {
            try {
                const url = await hostImg(picture.file);
                formData.pictures.push(url);
                pictures.value = pictures.value.filter(p => p !== picture);

            } catch (error) {
                console.error(error);
                show({ type: "error", title: t("toast.error.genericTitle"), message: t("toast.error.errorPicture") });
            }
        };
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        loading.value = true;
        try {
            if (pictures.value.length) await hostPictures();
            if (isAddingCare.lump) {
                //  await add function - pending to create
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: "pending translation", // --->
                });
                resetForm(formData, defaultForm);
                isAddingCare.lump = false;
                pictures.value = [];
            }
            else if (selectedLump.value) {
                const originalData = {
                    ...selectedLump.value,
                    notes: selectedLump.value.notes ?? "",
                };
                if (!shallowEqual(formData, originalData)) {
                    //  await update function - pending to create
                    pictures.value = [];
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
            title: t("dialog.deleteRecord.title", { name: pet.name, title: lump.title }),
            message: t("dialog.deleteGenericMsg"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    loading.value = true;
                    //delete function here - pending to create
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: "pending translation" // --->
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
                } finally { loading.value = false; }
            }
        });
    };

    return {
        loading, defaultForm, formData, fillLumpData, setUnit, deletePicture, pictures, loadedPictures, handleClose, handleDelete, handleSubmit
    }
}