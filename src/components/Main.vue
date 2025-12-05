<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-pink-50">
    <div class="bg-white shadow-md rounded-xl p-6 text-center">
      <h1 class="text-4xl font-bold text-pink-600 mb-2">Привет, дружочек! 🎀</h1>
      <p class="text-pink-500 text-lg">
        Добро пожаловать в наш милый мир Hello Kitty 💕
      </p>
      <!-- Кнопка перехода на Search.vue -->
      <button
        @click="goToSearch"
        class="mt-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
      >
        🔍 Перейти к поиску заметок
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Greeting",
  methods: {
    goToSearch() {
      this.$router.push({ name: "Search" }); // имя маршрута Search.vue
    },
  },
};
</script>

<style>
/* Дополнительно можно добавить кастомные стили, если нужно */
</style>
