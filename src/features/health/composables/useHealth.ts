import { reactive } from "vue";

const isAddingHealth = reactive({
    vaccine: false,
    treatment: false
});
const isUpdatingHealth = reactive({
    vaccine: false,
    treatment: false
});

export const useHealth = () => {
    return { isAddingHealth, isUpdatingHealth };
}