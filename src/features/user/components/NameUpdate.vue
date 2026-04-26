<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import { useToast } from '../../../composables/useToast';
import { useAuth } from '../composables/useAuth';

const { t } = useI18n();
const { error, firebaseUser, updateUser } = useAuth();
const { show } = useToast();

const visible = defineModel<boolean>("nameVisible");
const formData = ref<string>(firebaseUser.value?.displayName ?? "");

const handleSubmit = async () => {
    if (!formData) return;
    try {
        await updateUser("displayName", formData.value);
        show({
            type: "success",
            title: t("toast.success.title.generic"),
            message: t("toast.success.message.usernameUpdated", { name: firebaseUser.value?.displayName }),
        });
    } catch (e) {
        show({ type: "error", title: t("toast.error.genericTitle"), message: error.value || "" });
    } finally {
        visible.value = false;
    }
};
</script>

<template>
    <Transition name="overlay">
        <div v-if="visible" class="fixed inset-0 w-full h-dvh bg-black/60 flex items-center justify-center">
            <Transition name="toast" appear>
                <div class="dialog-box">
                    <form class="flex flex-col gap-1 w-sm " @submit.prevent="handleSubmit">
                        <Input v-model="formData" :label="t('auth.nameLabel')" :placeholder="t('auth.namePlaceholder')"
                            id="user-name" required />
                        <Button type="button" variant="secondary" @click="visible = false">{{ t("dialog.common.cancel")
                        }}</Button>
                        <Button>{{ t("dialog.common.confirm") }}</Button>
                    </form>
                </div>
            </Transition>
        </div>
    </Transition>

</template>