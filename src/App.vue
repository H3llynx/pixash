<script setup lang="ts">
import Dialog from './components/Dialog.vue';
import NavBar from './components/NavBar.vue';
import Toast from './components/Toast.vue';
import VaccineForm from './features/health/components/forms/VaccineForm.vue';
import VetVisitForm from './features/health/components/forms/VetVisitForm.vue';
import PetForm from './features/pets/components/PetForm.vue';
import { useAuth } from './features/user/composables/useAuth';
import LoadingView from './views/LoadingView.vue';

const { loading, user } = useAuth();
</script>

<template>
  <LoadingView v-if="loading" />
  <RouterView v-else />
  <VaccineForm />
  <VetVisitForm />
  <PetForm />
  <NavBar v-if="user" />
  <Toast />
  <Dialog />
</template>
