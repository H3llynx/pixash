<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FreeModal from '../../../components/FreeModal.vue';
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
    <FreeModal v-model="visible">
        <Transition name="toast">
            <div class="dialog-box" v-show="visible">
                <form class="flex flex-col gap-1 mini-form" @submit.prevent="handleSubmit">
                    <Input v-model="formData" :label="t('auth.nameLabel')" :placeholder="t('auth.namePlaceholder')"
                        id="user-name" required />
                    <Button>{{ t("common.button.confirm") }}</Button>
                    <Button type="button" variant="ghost" @click="visible = false">{{ t("common.button.cancel")
                    }}</Button>
                </form>
            </div>
        </Transition>
    </FreeModal>
</template>

<style scoped>
:deep(label) p {
    font-family: var(--font-title);
    font-size: large;
}
</style>