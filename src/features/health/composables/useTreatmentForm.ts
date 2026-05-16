import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { shallowEqual, tsToDate } from "../../../utils";
import { usePets } from "../../pets/composables/usePets";
import { MED_FREQUENCY } from "../config";
import { resetForm } from "../utils";
import { useEvents } from "./useEvents";

const defaultMedData = {
    name: "",
    instructions: "",
    frequency: MED_FREQUENCY[0].id,
    endDate: ""
};

const defaultForm = {
    name: "",
    startDate: "",
    vet: "",
    notes: "",
    medication: [defaultMedData],
};

const formData = reactive({ ...defaultForm });

export const useTreatmentForm = () => {
    const { isAddingHealth, selectedTreatment, selectedPet, addNewTreatment, updateSelectedTreatment, healthError, deleteSelectedTreatment } = usePets();
    const { selectedDate } = useEvents();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const handleClose = () => {
        resetForm(formData, defaultForm);
        selectedDate.value = null;
        isAddingHealth.treatment = false;
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        const nameSnapshot = formData.name;
        try {
            if (isAddingHealth.treatment) {
                await addNewTreatment({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.treatmentAdded", { name: selectedPet.value.name, title: nameSnapshot }),
                });
            }
            else if (selectedTreatment.value && !shallowEqual(formData,
                { ...selectedTreatment.value, startDate: tsToDate(selectedTreatment.value.startDate, "input") })) {
                await updateSelectedTreatment(selectedTreatment.value, selectedPet.value.id, { ...formData });
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.treatmentUpdated", { name: selectedPet.value.name, title: nameSnapshot }),
                });
            }
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        } finally { resetForm(formData, defaultForm) };
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const treatment = selectedTreatment.value;
        if (!treatment || !pet) return;
        open({
            title: t("dialog.deleteEvent.title", { title: treatment.name }),
            message: t("dialog.deleteEvent.message", { name: pet.name, title: treatment.name }),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await deleteSelectedTreatment(treatment, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.eventDeleted", { name: pet.name, title: treatment.name }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                }
            }
        });
    };

    return { formData, defaultForm, defaultMedData, handleClose, handleSubmit, handleDelete }
}