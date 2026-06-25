import { reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../../../composables/useDialog";
import { useToast } from "../../../../../composables/useToast";
import { shallowEqual, tsToDate } from "../../../../../utils";
import { usePets } from "../../../../pets/composables/usePets";
import { useEvents } from "../../../composables/useEvents";
import { resetForm } from "../../../utils";

export const useVetVisitForm = () => {
    const { selectedPet, selectedVisit, selectVisit, isAddingCare, addNewVetVisit, updateSelectedVisit, deleteSelectedVisit, careError } = usePets();
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
    const loading = ref<boolean>(false);

    const handleClose = () => {
        resetForm(formData, defaultForm);
        selectedDate.value = null;
        isAddingCare.visit = false;
        selectVisit(null);
    };

    const handleSubmit = async () => {
        if (!selectedPet.value) return;
        const titleSnapshot = formData.title;
        loading.value = true;
        try {
            if (isAddingCare.visit) {
                await addNewVetVisit({ ...formData }, selectedPet.value.id);
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.visitAdded", { name: selectedPet.value.name, title: titleSnapshot }),
                });
                resetForm(formData, defaultForm);
            }
            else if (selectedVisit.value && !shallowEqual(formData,
                { ...selectedVisit.value, date: tsToDate(selectedVisit.value.date, "datetime") })) {
                await updateSelectedVisit(selectedVisit.value, selectedPet.value.id, { ...formData });
                show({
                    type: "success",
                    title: t("toast.success.title.generic"),
                    message: t("toast.success.message.visitUpdated", { name: selectedPet.value.name, title: titleSnapshot }),
                });
                resetForm(formData, defaultForm);
            };
        }
        catch (e) {
            show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
        }
        finally {
            loading.value = false;
        };
    };

    const handleDelete = async () => {
        const pet = selectedPet.value;
        const visit = selectedVisit.value;
        if (!visit || !pet) return;
        open({
            title: t("dialog.deleteRecord.title", { title: visit.title }),
            message: t("dialog.deleteRecord.message", { name: pet.name, title: visit.title }),
            isDelete: true,
            onConfirm: async () => {
                loading.value = true;
                try {
                    await deleteSelectedVisit(visit, pet.id);
                    show({
                        type: "success",
                        title: t("toast.success.title.generic"),
                        message: t("toast.success.message.eventDeleted", { name: pet.name, title: visit.title }),
                    });
                    resetForm(formData, defaultForm);
                } catch (error) {
                    show({ type: "error", title: t("toast.error.genericTitle"), message: careError.value || "" });
                } finally { loading.value = false; }
            }
        });
    };

    return { loading, defaultForm, formData, handleClose, handleSubmit, handleDelete };
}