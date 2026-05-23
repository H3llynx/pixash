<script setup lang="ts">
import { Camera, X } from '@lucide/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FreeModal from '../../../components/FreeModal.vue';
import LoadingPuppy from '../../../components/loading/LoadingPuppy.vue';
import { useDialog } from '../../../composables/useDialog';
import { usePictureUpdate } from '../../../composables/usePictureUpdate';
import { useToast } from '../../../composables/useToast';
import { hostImg } from '../../../services/img-hosting';
import { usePets } from '../composables/usePets';
import PetIcon from './PetIcon.vue';

const { t } = useI18n();
const { open } = useDialog();
const { show } = useToast();
const { selectedPet, error, updateSelectedPet } = usePets();
const { onFileChange, previewUrl, clearPreview, selectedFile } = usePictureUpdate();

const visible = defineModel<boolean>("petPicVisible");
const loading = ref<boolean>(false);

const handleX = () => {
    if (previewUrl.value) {
        clearPreview();
    } else if (selectedPet.value?.photo) {
        open({
            title: t("dialog.deletePicture.title"),
            message: t("dialog.deletePicture.message"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await updateSelectedPet(selectedPet.value!, { photo: "" });
                } catch (error) { console.log(error) }
            }
        })
    };
};

const handleSubmit = async () => {
    if (!selectedFile.value || !selectedPet.value) return;
    loading.value = true;
    const url = await hostImg(selectedFile.value);
    if (!url) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: t("toast.error.errorPicture") });
        return;
    }
    try {
        await updateSelectedPet(selectedPet.value, { photo: url });
        show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.petPictureUpdated", { name: selectedPet.value.name }),
        });
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        clearPreview();
        loading.value = false;
        visible.value = false;
    }
};

const handleCancel = () => {
    clearPreview();
    visible.value = false;
};
</script>

<template>
    <FreeModal v-model="visible" v-if="selectedPet">
        <LoadingPuppy v-if="loading" class="max-w-xs" />
        <template v-else>
            <div class="mx-auto relative" v-if="selectedPet?.photo || previewUrl">
                <Button variant="ghost" size="xxs" class="absolute right-0 z-1" @click="handleX">
                    <X stroke-width="3" color="var(--color-error)" />
                </Button>
                <div class="preview">
                    <img v-if="previewUrl" :src="previewUrl" alt="Avatar preview"
                        class="object-cover h-full w-full relative" />
                    <PetIcon v-else :pet="selectedPet" />
                </div>
            </div>
            <h2 v-else>{{ t("common.text.addPicture") }}</h2>
            <form class="mini-form flex flex-col gap-1" @submit.prevent="handleSubmit">
                <label for="profile-picture" :aria-label="t('common.fileInputLabel')">
                    <input id="profile-picture" type="file" accept="image/*" class="sr-only" ref="fileInputRef"
                        tabindex="0" @change="onFileChange" @click="(e) => (e.target as HTMLInputElement).value = ''" />
                    <Camera />
                </label>
                <Button v-if="previewUrl">{{ t("common.button.confirm") }}</Button>
                <Button type="button" variant="ghost" @click="handleCancel">{{
                    t("common.button.cancel")
                }}</Button>
            </form>
        </template>
    </FreeModal>
</template>