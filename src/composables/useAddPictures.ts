import type { Ref } from "vue";

export type Picture = {
    file: File;
    preview: string;
}

export const useAddPictures = (pictures: Ref<Picture[]>) => {
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

    return { pictures, onFileChange, deletePicture }
};