<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-[#F5F3FA] to-[#F8F5FF]">
    
    <!-- Header: показываем только если пользователь залогинен -->
    <header
      v-if="isLoggedIn"
      class="bg-purple-200/50 backdrop-blur-xl shadow-md p-4 flex justify-end items-center"
    >
      <div class="flex items-center space-x-4">
        <span class="text-purple-700 font-medium">Привет, {{ username }}!</span>
        <button
          @click="logout"
          class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 shadow-sm"
        >
          Выйти
        </button>
      </div>
    </header>

    <!-- Main Slot -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

<script>
import { useUserStore } from '../../stores/userStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export default {
  name: "DefaultLayout",
  data() {
    return {
      isLoggedIn: false,
      username: "",
    };
  },
  setup() {
    const userStore = useUserStore();
    const { token, user } = storeToRefs(userStore);

    const isLoggedIn = computed(() => !!token.value);
    const username = computed(() => user.value?.username || 'Пользователь');

    function logout() {
      userStore.logout();
      localStorage.removeItem('token');
      userStore.$reset(); // если используешь Pinia reset
    }

    return {
      isLoggedIn,
      username,
      logout,
    };
  },
  mounted() {
    const userStore = useUserStore();
    const { token, user } = storeToRefs(userStore);

    this.isLoggedIn = !!token.value;
    this.username = user.value?.username || "Пользователь";

    // Подписка на изменения в Pinia store
    this.unwatchToken = token.watch((newToken) => {
      this.isLoggedIn = !!newToken;
    });
    this.unwatchUser = user.watch((newUser) => {
      this.username = newUser?.username || "Пользователь";
    });
  },
  beforeUnmount() {
    if (this.unwatchToken) this.unwatchToken();
    if (this.unwatchUser) this.unwatchUser();
  },
  methods: {
    logout() {
      const userStore = useUserStore();
      userStore.logout();
      this.$router.replace({ name: "Login" });
      location.reload();
    },
  },
};
</script>

<style scoped>
/* Все стили TailwindCSS уже в шаблоне */
</style>
