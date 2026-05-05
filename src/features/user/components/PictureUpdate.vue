<script setup lang="ts">
import { Camera, X } from '@lucide/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import LoadingPuppy from '../../../components/loading/LoadingPuppy.vue';
import { useToast } from '../../../composables/useToast';
import { hostImg } from '../../../services/img-hosting';
import { useAuth } from '../composables/useAuth';

const { t } = useI18n();
const { error, updateUser } = useAuth();
const { show } = useToast();

const visible = defineModel<boolean>("picVisible");
const fileInputRef = ref<HTMLInputElement>();
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const loading = ref<boolean>(false);

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
}
</script>

<template>
    <Transition name="overlay">
        <div v-if="visible" class="fixed inset-0 w-full h-dvh bg-black/60 flex items-center justify-center">
            <Transition name="toast" appear>
                <div class="dialog-box w-[80%] max-w-sm">
                    <LoadingPuppy v-if="loading" class="max-w-xs" />
                    <template v-else>
                        <div v-if="previewUrl" class="mx-auto relative">
                            <Button variant="ghost" size="xxs" class="absolute right-0 z-1" @click="clearPreview">
                                <X stroke-width="3" color="var(--color-error)" />
                            </Button>
                            <div class="preview">
                                <img :src="previewUrl" alt="Avatar preview"
                                    class="object-cover h-full w-full relative" />
                            </div>
                        </div>
                        <form class="mini-form flex flex-col gap-1" @submit.prevent="handleSubmit">
                            <label for="profile-picture" :aria-label="t('common.fileInputLabel')">
                                <input id="profile-picture" type="file" accept="image/*" class="sr-only"
                                    ref="fileInputRef" @change="onFileChange" />
                                <Camera />
                            </label>
                            <Button v-if="previewUrl">{{ t("common.button.confirm") }}</Button>
                            <Button type="button" variant="ghost" @click="handleCancel">{{
                                t("common.button.cancel")
                                }}</Button>
                        </form>
                    </template>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
label {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 2rem;
    border-radius: 0.75rem;
    background: var(--background-image-card);
    border: 1px solid var(--color-brand);
    cursor: pointer;
}

.preview {
    width: 10rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: 1px solid var(--color-brand-rgba);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        background-image: var(--background-image-card);
        background-size: 150% 100%;
        animation: move-overlay 10s ease-out infinite;
    }
}
</style>