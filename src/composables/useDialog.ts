import { ref } from 'vue';

type Dialog = {
    title: string;
    message: string;
    isDelete?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
}

const dialog = ref<Dialog | null>(null)

export const useDialog = () => {
    const open = (newDialog: Dialog) => {
        dialog.value = newDialog;
    }

    return { dialog, open }
};