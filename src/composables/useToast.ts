import { ref } from 'vue'

type ToastType = "error" | "success"

type Toast = {
    type: ToastType
    title?: string
    message: string
}

const toast = ref<Toast | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
    function show(type: ToastType, message: string, title?: string) {
        if (timer) clearTimeout(timer)
        toast.value = { type, title, message };
        timer = setTimeout(() => { toast.value = null }, 4000);
    }

    function dismiss() {
        toast.value = null
        if (timer) clearTimeout(timer)
    }

    return { toast, show, dismiss }
};