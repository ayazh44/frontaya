<template>
  <div class="flex flex-col items-center justify-start min-h-screen bg-pink-50 p-6 relative">

    <!-- Стрелка назад -->
    <button
      v-if="isListVisible || isSearchVisible"
      @click="goBack"
      class="absolute top-4 left-4 text-pink-600 bg-pink-100 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-pink-200 transition"
    >
      ←
    </button>

    <!-- Заголовок -->
    <h1 class="text-4xl font-bold text-pink-600 mb-2 text-center">Список заметок 🎀</h1>
    <p class="text-pink-500 text-lg mb-4 text-center">Добро пожаловать в Список заметок 💕</p>

    <!-- Главные кнопки -->
    <div v-if="!isListVisible && !isSearchVisible" class="flex flex-col gap-2">
      <button
        @click="showList"
        class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
      >
        📜 Список заметок
      </button>

      <button
        @click="showSearch"
        class="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
      >
        🔍 Найти заметку
      </button>
    </div>

    <!-- Список заметок -->
    <div v-if="isListVisible" class="flex flex-col gap-4 mt-4 w-full max-w-md">
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-white p-4 rounded-xl shadow-lg border border-pink-200 hover:scale-105 cursor-pointer transform transition duration-300"
        @click="openArticle(note.Article?.url)"
      >
        <p class="text-lg font-semibold text-pink-700 mb-2 break-words">{{ note.text }}</p>
        <div class="flex justify-between items-center text-pink-400 text-xs mt-3">
          <span class="px-2 py-1 bg-pink-100 rounded-full text-[10px]">ID: {{ note.id }}</span>
          <span>{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>

      <div v-if="notes.length === 0" class="text-center text-pink-400 mt-6">
        Заметок не найдено 😿
      </div>
    </div>

    <!-- Найти/Добавить заметку -->
    <div v-if="isSearchVisible" class="flex flex-col gap-3 mt-4 w-full max-w-md">
      
      <!-- Добавление новой заметки -->
      <div class="flex gap-3">
        <input
          type="text"
          placeholder="ID статьи"
          v-model="newNoteArticleId"
          class="w-1/3 p-3 rounded-lg border border-pink-300 bg-white focus:border-pink-500 outline-none"
        />
        <input
          type="text"
          placeholder="Текст заметки"
          v-model="newNoteText"
          class="flex-1 p-3 rounded-lg border border-pink-300 bg-white focus:border-pink-500 outline-none"
        />
        <button
          @click="addNote"
          class="w-12 h-12 flex items-center justify-center bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 active:scale-95 transition"
        >
          +
        </button>
      </div>

      <!-- Поле поиска заметок -->
      <input
        v-model="searchQuery"
        @input="filterNotes"
        type="text"
        placeholder="Поиск заметки..."
        class="w-full p-3 rounded-lg border border-pink-300 focus:border-pink-500 outline-none bg-white"
      />

      <!-- Список найденных заметок -->
      <div v-for="note in filteredNotes" :key="note.id"
        class="bg-white p-4 rounded-xl shadow-lg border border-pink-200 hover:scale-105 cursor-pointer transform transition duration-300"
        @click="openArticle(note.Article?.url)"
      >
        <p class="text-lg font-semibold text-pink-700 mb-2 break-words">{{ note.text }}</p>
        <div class="flex justify-between items-center text-pink-400 text-xs mt-3">
          <span class="px-2 py-1 bg-pink-100 rounded-full text-[10px]">ID: {{ note.id }}</span>
          <span>{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>

      <div v-if="filteredNotes.length === 0" class="text-center text-pink-400 mt-6">
        Заметок не найдено 😿
      </div>
    </div>

  </div>
</template>

<script>
import { useNoteStore } from "../stores/noteStore.js";
import { storeToRefs } from "pinia";

export default {
  name: "Main",
  data() {
    return {
      notes: [],
      filteredNotes: [],
      searchQuery: "",
      isListVisible: false,
      isSearchVisible: false,
      newNoteArticleId: "",
      newNoteText: ""
    };
  },
  async created() {
    await this.loadNotes();
  },
  setup() {
    const noteStore = useNoteStore();
    const { notes } = storeToRefs(noteStore);
    return { noteStore, notes };
  },
  methods: {
    async loadNotes() {
      await this.noteStore.getNoteByUserid(1);
      this.notes = [...this.noteStore.notes];
      this.filteredNotes = [...this.notes];
    },
    showList() {
      this.isListVisible = true;
      this.isSearchVisible = false;
    },
    showSearch() {
      this.isSearchVisible = true;
      this.isListVisible = false;
      this.filteredNotes = [...this.notes];
    },
    goBack() {
      this.isListVisible = false;
      this.isSearchVisible = false;
      this.searchQuery = "";
    },
    async addNote() {
      const articleId = this.newNoteArticleId?.trim();
      const text = this.newNoteText?.trim();
      if (!text || !articleId) return;

      const userId = 1;
      const newNote = { articleId, userId, text };
      const result = await this.noteStore.addNote(newNote);

      if (result.success) {
        this.filteredNotes = [...this.noteStore.notes];
        this.newNoteArticleId = "";
        this.newNoteText = "";
      } else {
        alert(result.message);
      }
    },
    filterNotes() {
      const q = this.searchQuery.toLowerCase().trim();
      if (!q) {
        this.filteredNotes = [...this.notes];
        return;
      }
      this.filteredNotes = this.notes.filter(note =>
        note.text.toLowerCase().includes(q)
      );
    },
    async openArticle(url) {
      if (!url) return;
      window.open(url, "_blank");
    },
    formatDate(date) {
      return new Date(date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }
};
</script>

<style scoped>
/* Стрелка и тень элементов */
</style>
