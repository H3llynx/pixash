import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useDialog } from "../../../composables/useDialog";
import { useToast } from "../../../composables/useToast";
import { usePets } from "../../pets/composables/usePets";
import { resetForm } from "../utils";
import { useEvents } from "./useEvents";

export const useTreatmentForm = () => {
    const { isAddingHealth, selectedTreatment } = usePets();
    const { selectedDate } = useEvents();
    const { show } = useToast();
    const { open } = useDialog();
    const { t } = useI18n();

    const defaultForm = {
        name: "",
        startDate: "",
        vet: "",
        notes: "",
    };

    const formData = reactive({ ...defaultForm });

    const handleClose = () => {
        resetForm(formData, defaultForm);
        selectedDate.value = null;
        isAddingHealth.treatment = false;
    };

    const handleSubmit = async () => { console.log("submit") };
    const handleDelete = async () => { console.log("delete") };

    return { isAddingHealth, selectedTreatment, formData, defaultForm, handleClose, handleSubmit, handleDelete }
}