<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#F5F3FA] to-[#F8F5FF]">
    <div class="bg-purple-200 backdrop-blur-xl shadow-md rounded-3xl p-8 w-full max-w-sm border border-purple-100">

      <!-- Header -->
      <div class="flex flex-col items-center mb-6">
        <div class="text-5xl text-purple-300">✧</div>
        <h1 class="text-3xl font-semibold text-purple-600 mt-2">
          Вход
        </h1>
      </div>

      <p class="text-center text-purple-500 mb-6">
        Рады видеть вас снова
      </p>

      <!-- Username -->
      <input
        v-model="username"
        type="text"
        placeholder="Ваш логин"
        class="border border-purple-100 focus:border-purple-300 transition-all duration-200 rounded-xl w-full p-3 mb-3
               bg-white/60 placeholder-purple-200 text-purple-700 outline-none shadow-sm"
      />

      <!-- Password -->
      <input
        v-model="password"
        type="password"
        placeholder="Ваш пароль"
        class="border border-purple-100 focus:border-purple-300 transition-all duration-200 rounded-xl w-full p-3 mb-4
               bg-white/60 placeholder-purple-200 text-purple-700 outline-none shadow-sm"
      />

      <!-- Button: Войти -->
      <button
        @click="handleLogin"
        class="w-full bg-gradient-to-r from-[#D9CFF1] to-[#CFC4EC] hover:from-[#CEC4E8] hover:to-[#C2B7E2]
               text-purple-700 py-3 rounded-xl transition-all duration-200 shadow-sm text-lg hover:scale-[1.01]"
      >
        Войти
      </button>

      <div v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">
        {{ errorMessage }}
      </div>

      <div class="text-center text-purple-500 text-sm mt-4">
        Хорошего дня! ☀️💜
      </div>

    </div>
  </div>
</template>

<script>
import { useUserStore } from "../stores/userStore.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export default {
  name: "Login",
  setup() {
    const userStore = useUserStore();
    const { token, user } = storeToRefs(userStore);
    const router = useRouter();

    return { userStore, token, user, router };
  },
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      const result = await this.userStore.login(this.username, this.password);
      if (result.success) {
        this.errorMessage = "";
        this.router.replace({ name: "Main" });
      } else {
        this.errorMessage = result.message;
      }
    },
    logout() {
      // Очищаем store
      this.userStore.logout?.();

      // Убираем токен из localStorage
      localStorage.removeItem("token");

      // Переход на страницу логина
      this.router.replace({ name: "Login" });
      location.reload();
    }
  }
};
</script>

<style>
/* Шрифт берется из index.html, фон и цвета заданы через Tailwind */
</style>
