<script setup lang="ts">
import Dialog from './components/Dialog.vue';
import Toast from './components/Toast.vue';
import { useAuth } from './features/user/composables/useAuth';
import LoadingView from './views/LoadingView.vue';
const { loading } = useAuth();
</script>

<template>
  <LoadingView v-if="loading" />
  <RouterView v-else />
  <Toast />
  <Dialog />
</template>
