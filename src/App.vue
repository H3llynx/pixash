<script setup lang="ts">
import Dialog from './components/Dialog.vue';
import NavBar from './components/NavBar.vue';
import Toast from './components/Toast.vue';
import { useAuth } from './features/user/composables/useAuth';
import LoadingView from './views/LoadingView.vue';
const { loading, user } = useAuth();
</script>

<template>
  <LoadingView v-if="loading" />
  <RouterView v-else />
  <NavBar v-if="user" />
  <Toast />
  <Dialog />
</template>
