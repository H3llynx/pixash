import { ref } from "vue";

type Picture = {
    file: File;
    preview: string;
}

const pictures = ref<Picture[]>([]);

export const useAddPictures = () => {
    const onFileChange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = target.files ? Array.from(target.files) : [];
        if (!files.length) return;
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