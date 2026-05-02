import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { shallowEqual, tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { resetForm } from "../utils";
import { useEvents } from "./useEvents";

export const useVetVisitForm = () => {
    const { selectedPet, selectedVisit, selectVisit, isAddingHealth, addNewVetVisit, updateSelectedVisit, deleteSelectedVisit, healthError } = usePets();
    const { selectedDate } = useEvents();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const defaultForm = {
        title: "",
        date: "",
        vet: "",
        notes: "",
    };

    const formData = reactive({ ...defaultForm });

    const handleClose = () => {
        resetForm(formData, defaultForm);
        selectedDate.value = null;
        isAddingHealth.visit = false;
        selectVisit(null);
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        const titleSnapshot = formData.title;
        try {
            if (isAddingHealth.visit) {
                await addNewVetVisit({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.visitAdded", { name: selectedPet.value.name, title: titleSnapshot }),
                });
            }
            else if (selectedVisit.value && !shallowEqual(formData,
                { ...selectedVisit.value, date: tsToDate(selectedVisit.value.date, "input") })) {
                await updateSelectedVisit(selectedVisit.value, selectedPet.value.id, { ...formData });
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.visitUpdated", { name: selectedPet.value.name, title: titleSnapshot }),
                });
            }
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        } finally { resetForm(formData, defaultForm) };
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const visit = selectedVisit.value;
        if (!visit || !pet) return;
        open({
            title: t("dialog.deleteVetVisit.title", { title: visit.title }),
            message: t("dialog.deleteVetVisit.message", { name: pet.name, title: visit.title }),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await deleteSelectedVisit(visit, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.visitDeleted", { name: pet.name, title: visit.title }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                }
            }
        });
    };

    return { defaultForm, formData, handleClose, handleSubmit, handleDelete };
}