<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import FreeModal from '../../../components/FreeModal.vue';
import Input from '../../../components/Input.vue';
import { deleteAccount, reauthenticate } from '../../../services/auth.ts';
import { useAuth } from '../composables/useAuth.ts';

const { user } = useAuth();
const { t } = useI18n();

const providerId = user.value?.providerData[0]?.providerId;
const visible = defineModel<boolean>("deleteVisible");
const password = ref("");
const isShowing = ref<boolean>(false);
const isDeleting = ref(false);
const error = ref("");

const isPasswordProvider = computed(() => providerId === "password");

const handleConfirmDelete = async () => {
    if (!user.value) return;
    error.value = "";
    isDeleting.value = true;

    try {
        await reauthenticate(isPasswordProvider.value ? password.value : undefined);
        await deleteAccount(user.value.uid);
        window.location.href = '/';
    } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            error.value = "auth.deleteAccount.wrongPassword";
        } else if (error.code === 'auth/popup-closed-by-user') {
            error.value = "auth.deleteAccount.popupClosed";
        } else {
            error.value = "common.text.genericError";
        }
    } finally {
        isDeleting.value = false;
        visible.value = false;
    }
};

const handleCancel = () => {
    password.value = "";
    visible.value = false;
}
</script>

<template>
    <FreeModal v-model="visible">
        <h2>{{ t("auth.deleteAccount.title") }}</h2>
        <p>{{ t("auth.deleteAccount.warning") }}</p>
        <div v-if="isPasswordProvider" class="flex flex-col gap-1 mt-2">
            <Input v-model="password" :label="t('auth.deleteAccount.passwordLabel')" id="password"
                :type="isShowing ? 'text' : 'password'" required>
                <template #addon>
                    <Button type="button" :aria-label="isShowing ? t('auth.password.hide') : t('auth.password.show')"
                        @click="isShowing = !isShowing" variant="addon" size="xs">
                        <EyeOff v-if="isShowing" :size="20" />
                        <Eye v-else :size="20" />
                    </Button>
                </template>
            </Input>
        </div>
        <p v-if="error" class="text-sm w-full text-error pb-0.5">
            {{ error }}
        </p>
        <div class="flex flex-col-reverse gap-0.5 mt-0.5 shrink-0 w-full md:flex-row md:ml-auto md:w-max">
            <Button variant="secondary" size="sm" @click="handleCancel" :disabled="isDeleting">
                {{ t("common.button.cancel") }}
            </Button>
            <Button @click="handleConfirmDelete" size="sm" :disabled="isDeleting || (isPasswordProvider && !password)">
                {{ isDeleting ? t("auth.deleteAccount.deleting") : t("auth.deleteAccount.cta") }}
            </Button>
        </div>
    </FreeModal>
</template>