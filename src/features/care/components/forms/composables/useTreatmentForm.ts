import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { shallowEqual, tsToDate } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { useEvents } from "../../../composables/useEvents";
import { MED_FREQUENCY } from "../../../config";
import type { TreatmentRecord } from "../../../types";
import { resetForm } from "../../../utils";

export const useTreatmentForm = () => {
    const { isAddingCare, selectedTreatment, selectTreatment, selectedPet, addNewTreatment, updateSelectedTreatment, healthError, deleteSelectedTreatment } = usePets();
    const { selectedDate } = useEvents();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const addMedicine = () => ({
        id: crypto.randomUUID(),
        name: "",
        instructions: "",
        frequency: MED_FREQUENCY[0].id,
        noEnd: false,
        endDate: ""
    });

    const defaultForm = {
        name: "",
        startDate: "",
        vet: "",
        notes: "",
        medication: [],
    };

    const formData = reactive<TreatmentRecord>({ ...defaultForm });
    const loading = ref<boolean>(false);

    const handleClose = () => {
        resetForm(formData, defaultForm);
        selectedDate.value = null;
        isAddingCare.treatment = false;
        selectTreatment(null);
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        const nameSnapshot = formData.name;
        loading.value = true;
        try {
            if (isAddingCare.treatment) {
                await addNewTreatment({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.treatmentAdded", { name: selectedPet.value.name, title: nameSnapshot }),
                });
            }
            else if (selectedTreatment.value) {
                const originalData = {
                    ...selectedTreatment.value,
                    startDate: tsToDate(selectedTreatment.value.startDate, "input"),
                    medication: selectedTreatment.value.medication.map(med => ({
                        ...med,
                        endDate: med.endDate ? tsToDate(med.endDate, "input") : ""
                    }))
                };
                if (!shallowEqual(formData, originalData)) {
                    await updateSelectedTreatment(selectedTreatment.value, selectedPet.value.id, { ...formData });
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.treatmentUpdated", { name: selectedPet.value.name, title: nameSnapshot }),
                    });
                }
            };
            resetForm(formData, defaultForm);
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
        }
        finally {
            loading.value = false;
        };
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
                loading.value = true;
                try {
                    loading.value = true;
                    await deleteSelectedTreatment(treatment, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.eventDeleted", { name: pet.name, title: treatment.name }),
                    });
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: healthError.value || "" });
                } finally { loading.value = false; }
            }
        });
        resetForm(formData, defaultForm);
    };

    return { formData, defaultForm, addMedicine, handleClose, handleSubmit, handleDelete, loading }
}