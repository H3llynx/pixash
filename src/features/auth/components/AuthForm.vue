<script setup lang="ts">
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
const name = ref("");
const email = ref("");
const password = ref("");

watch(error, (newError) => {
    if (newError) {
        show("error", newError, isLogin.value ? "Login error" : "Registration error")
    }
})

watch(user, (newUser) => {
    if (newUser) {
        show("success", "You have been successfully logged in.", isLogin.value ? "Welcome back!" : `${newUser.displayName}`,)
        router.push(ROUTES.dashboard)
    }
})

const toggleForm = () => { isLogin.value = !isLogin.value }

const handleLogin = async () => {
    if (isLogin) await loginWithEmail(email.value, password.value);
    else await registerWithEmail(name.value, email.value, password.value);
};

</script>

<template>
    <form class="flex flex-col gap-1 w-full max-w-2xs" @submit.prevent="handleLogin">
        <Input v-if="!isLogin" v-model="name" label="What's your name?" id="name" placeholder="Sasha's owner"
            required />
        <Input v-model="email" label="Email address" id="email" type="email" placeholder="ilovemypet@mail.com"
            required />
        <Input v-model="password" label="Password" id="password" type="password" required />
        <Button>{{ isLogin ? " Sign in" : "Register" }} </Button>
        <Button type="button" variant="secondary" @click="loginWithGoogle">Login with Google</Button>
        <Button type="button" variant="ghost" @click="toggleForm">
            {{ isLogin ? "Register" : "I already have an account" }}
        </Button>
    </form>
</template>