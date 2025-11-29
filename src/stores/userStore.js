import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("jwt") || null,
    user: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await axios.post("http://localhost:3000/api/account/login/", {
          username,
          password,
        });

        if (res.data?.token) {
          this.token = res.data.token;
          this.user = res.data.user;

          // Сохраняем JWT в localStorage
          localStorage.setItem("jwt", this.token);
        }

        return { success: true, message: res.data.message };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("jwt");
    },
  },
});
