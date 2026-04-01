<script setup lang="ts">
import { Eye, EyeOff } from '@lucide/vue';
import { ref, watch } from 'vue';
import Button from '../../../components/Button.vue';
import Input from '../../../components/Input.vue';
import { useToast } from '../../../composables/useToast';
import { ROUTES } from '../../../router/config';
import router from '../../../router/router';
import { useAuth } from '../composables/useAuth';

const { error, user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
const { show } = useToast();

const isLogin = ref(true);
const isShowing = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");

watch(error, (newError) => {
    if (newError) {
        show("error", newError, isLogin.value ? "Login error" : "Registration error");
    }
});

watch(user, (newUser) => {
    if (!newUser) return;
    const firstName = newUser.firstName;
    if (firstName) {
        show("success", "You have been successfully logged in.", isLogin.value ? "Welcome back!" : `Hi ${newUser.firstName}!`,)
        router.push(ROUTES.dashboard)
    }
});

const handleAuth = async () => {
    if (isLogin.value) await loginWithEmail(email.value, password.value);
    else await registerWithEmail(name.value, email.value, password.value);
};

</script>

<template>
    <form class="flex flex-col gap-1 w-full max-w-md" @submit.prevent="handleAuth">
        <Input v-if="!isLogin" v-model="name" label="What's your name?" id="name" placeholder="Sasha's owner"
            required />
        <Input v-model="email" label="Email address" id="email" type="email" placeholder="ilovemypet@mail.com"
            required />
        <Input v-model="password" label="Password" id="password" :type="isShowing ? 'text' : 'password'" required>
            <template #addon>
                <Button type="button" :aria-label="isShowing ? 'Hide password' : 'View password'"
                    @click="isShowing = !isShowing" variant="addon" size="xs">
                    <EyeOff v-if="isShowing" :size="20" />
                    <Eye v-else :size="20" />
                </Button>
            </template>
        </Input>
        <Button>{{ isLogin ? " Sign in" : "Register" }} </Button>
        <Button type="button" variant="secondary" @click="loginWithGoogle">Login with Google</Button>
        <Button type="button" variant="ghost" @click="isLogin = !isLogin">
            {{ isLogin ? "Register" : "I already have an account" }}
        </Button>
    </form>
</template>