<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-pink-100">
    <div class="bg-white shadow-lg rounded-3xl p-6 w-full max-w-sm border-2 border-pink-300">

      <!-- Header -->
      <div class="flex flex-col items-center mb-4">
        <div class="text-5xl">🎀</div>
        <h1 class="text-3xl font-bold text-pink-600 mt-2">Hello Kitty Login</h1>
      </div>

      <p class="text-center text-pink-500 mb-6">
        Добро пожаловать, дружочек! 💕
      </p>

      <!-- Username -->
      <input
        v-model="username"
        type="text"
        placeholder="Введите ваш милый Username 😺"
        class="border-2 border-pink-300 focus:border-pink-500 transition-all duration-200 rounded-lg w-full p-3 mb-3 bg-pink-50 placeholder-pink-300 text-pink-700 outline-none"
      />

      <!-- Password -->
      <input
        v-model="password"
        type="password"
        placeholder="Ваш секретный пароль 🎀"
        class="border-2 border-pink-300 focus:border-pink-500 transition-all duration-200 rounded-lg w-full p-3 mb-4 bg-pink-50 placeholder-pink-300 text-pink-700 outline-none"
      />

      <!-- Button -->
      <button
        @click="handleLogin"
        class="w-full bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white py-3 rounded-lg transition-all duration-200 shadow-md text-lg flex items-center justify-center gap-2"
      >
        💗 Войти 💗
      </button>

      <div v-if="errorMessage" class="text-red-500 text-sm mt-2 text-center">
        {{ errorMessage }}
      </div>

      <div class="text-center text-pink-400 text-sm mt-4">
        * Hello Kitty желает вам хорошего дня! *
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
        this.router.replace({ name: "Main" }); // перенаправление на главную
      } else {
        this.errorMessage = result.message;
      }
    }
  },
};
</script>
