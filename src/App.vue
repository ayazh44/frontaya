<template>
  <!-- <div class="min-h-screen bg-gray-100 p-4"> -->
    <default-layout>
      <router-view />
    </default-layout>
  <!-- </div> -->
</template>

<script>
import DefaultLayout from './components/layouts/DefaultLayout.vue';

export default {
  name: "App",
  components: {
    DefaultLayout,
  },
};
</script>
