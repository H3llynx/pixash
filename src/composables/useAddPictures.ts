import type { Ref } from "vue";
import { useI18n } from "vue-i18n";
import { hostImg } from "../services/img-hosting";
import { useToast } from "./useToast";

export type Picture = {
    file: File;
    preview: string;
}

export const useAddPictures = (pictures: Ref<Picture[]>) => {
    const { t } = useI18n();
    const { show } = useToast();

    const onFileChange = async (e: Event, max?: number, initialImages: number = 0) => {
        const target = e.target as HTMLInputElement;
        let files = target.files ? Array.from(target.files) : [];
        if (!files.length) return;
        if (max !== undefined) {
            const remaining = max - initialImages - pictures.value.length;
            if (remaining <= 0) return;
            files = files.slice(0, remaining);
        };
        files.forEach(file => {
            pictures.value.push({
                file,
                preview: URL.createObjectURL(file),
            });
        });
    };

    const deletePicture = (picture: Picture) => {
        URL.revokeObjectURL(picture.preview);
        pictures.value = pictures.value.filter(p => p !== picture);
    };

    const hostFormPictures = async (formData: { pictures: string[] }) => {
        for (const picture of pictures.value) {
            try {
                const url = await hostImg(picture.file);
                formData.pictures = [...formData.pictures, url];
                pictures.value = pictures.value.filter(p => p !== picture);
            } catch (error) {
                console.error(error);
                show({ type: "error", title: t("toast.error.genericTitle"), message: t("toast.error.errorPicture") });
            }
        }
    };

    const deleteFormPicture = async (formData: { pictures: string[] }, picture: string) => {
        formData.pictures = formData.pictures.filter(p => p !== picture);
    };

    return { pictures, onFileChange, deletePicture, hostFormPictures, deleteFormPicture };
};