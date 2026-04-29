import { computed, ref } from "vue";

export const useFormMode = () => {
    const mode = ref<"view" | "edit">();
    const isReadonly = computed(() => mode.value === "view");
    return { mode, isReadonly };
} 