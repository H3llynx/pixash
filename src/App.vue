<script setup lang="ts">
import Toast from './components/Toast.vue';
import { useAuth } from './features/auth/composables/useAuth';
import LoadingView from './views/LoadingView.vue';
const { loading } = useAuth();
</script>

<template>
  <LoadingView v-if="loading" />
  <RouterView v-else />
  <Toast />
</template>
