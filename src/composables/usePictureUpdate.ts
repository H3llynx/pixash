import { ref } from "vue";

const fileInputRef = ref<HTMLInputElement>();
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

export const usePictureUpdate = () => {
    const isEditingPicture = ref<boolean>(false);
    const onFileChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
        }
        selectedFile.value = file;
        previewUrl.value = URL.createObjectURL(file);
    };

    const clearPreview = () => {
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value);
        }
        previewUrl.value = null;
        selectedFile.value = null;
        if (fileInputRef.value) fileInputRef.value.value = "";
    };

    return { isEditingPicture, onFileChange, previewUrl, clearPreview, selectedFile }
}