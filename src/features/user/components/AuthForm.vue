<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import { useToast } from '../../../composables/useToast';
import { ROUTES } from '../../../router/config';
import router from '../../../router/router';
import { useAuth } from '../composables/useAuth';

const { error, user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
const { show } = useToast();
const { t } = useI18n();

const isLogin = ref<boolean>(true);
const isShowing = ref<boolean>(false);
const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");

watch(error, (newError) => {
    if (newError) show({ type: "error", title: isLogin.value ? "Login error" : "Registration error", message: newError });
});

watch(user, (newUser) => {
    if (!newUser) return;
    const firstName = newUser.firstName;
    if (firstName) {
        show({
            type: "success",
            title: isLogin.value
                ? t("toast.success.title.loggedUser")
                : t("toast.success.title.newUser", { name: newUser.firstName }),
            message: t("toast.success.message.userAuthenticated"),
        });
        router.push(ROUTES.dashboard);
    }
});

const handleAuth = async () => {
    if (isLogin.value) await loginWithEmail(email.value, password.value);
    else await registerWithEmail(name.value, email.value, password.value);
};

</script>

<template>
    <form class="flex flex-col gap-1 w-sm" @submit.prevent="handleAuth">
        <Input v-if="!isLogin" v-model="name" id="name" :label="t('auth.nameLabel')"
            :placeholder="t('auth.namePlaceholder')" required />
        <Input v-model="email" :label="t('auth.emailLabel')" id="email" type="email"
            :placeholder="t('auth.emailPlaceholder')" required />
        <Input v-model="password" :label="t('auth.passwordLabel')" id="password" :type="isShowing ? 'text' : 'password'"
            required>
            <template #addon>
                <Button type="button" :aria-label="isShowing ? t('auth.password.hide') : t('auth.password.show')"
                    @click="isShowing = !isShowing" variant="addon" size="xs">
                    <EyeOff v-if="isShowing" :size="20" />
                    <Eye v-else :size="20" />
                </Button>
            </template>
        </Input>
        <Button>{{ isLogin ? t("auth.login") : t("auth.register") }} </Button>
        <Button type="button" variant="secondary" @click="loginWithGoogle">{{ t("auth.loginWithGoogle") }}</Button>
        <Button type="button" variant="ghost" @click="isLogin = !isLogin">
            {{ isLogin ? t("auth.register") : t("auth.switchToLogin") }}
        </Button>
    </form>
</template>