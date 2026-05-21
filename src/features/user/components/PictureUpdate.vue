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
import { useAuth } from '../composables/useAuth';
import Avatar from './Avatar.vue';

const { t } = useI18n();
const { error, updateUser } = useAuth();
const { open } = useDialog();
const { show } = useToast();
const { user } = useAuth();
const { onFileChange, previewUrl, clearPreview, selectedFile } = usePictureUpdate();

const visible = defineModel<boolean>("picVisible");
const loading = ref<boolean>(false);

const handleX = () => {
    if (previewUrl.value) {
        clearPreview();
    } else if (user.value?.photoURL) {
        open({
            title: t("dialog.deletePicture.title"),
            message: t("dialog.deletePicture.message"),
            isDelete: true,
            onConfirm: async () => {
                try {
                    await updateUser("photoURL", "");
                } catch (error) { console.log(error) }
            }
        })
    };
};

const handleSubmit = async () => {
    if (!selectedFile.value) return;
    loading.value = true;
    const url = await hostImg(selectedFile.value);
    if (!url) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: t("toast.error.userPicture") });
        return;
    }
    try {
        await updateUser("photoURL", url);
        show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.userPictureUpdated"),
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
    <FreeModal v-model="visible">
        <LoadingPuppy v-if="loading" class="max-w-xs" />
        <template v-else>
            <div class="mx-auto relative" v-if="user?.photo || previewUrl">
                <Button variant="ghost" size="xxs" class="absolute right-0 z-1" @click="handleX">
                    <X stroke-width="3" color="var(--color-error)" />
                </Button>
                <div class="preview">
                    <img v-if="previewUrl" :src="previewUrl" alt="Avatar preview"
                        class="object-cover h-full w-full relative" />
                    <Avatar v-else-if="user?.photo" :user="user" />
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