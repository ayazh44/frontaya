<template>
  <div class="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-[#F5F3FA] to-[#F8F5FF] p-6 relative">

    <!-- Стрелка назад -->
<button
  v-if="isListVisible || isSearchVisible"
  @click="goBack"
  class="fixed top-3 left-4 w-12 h-12 flex items-center justify-center rounded-full
         bg-gradient-to-br from-purple-400 to-purple-600 text-white text-2xl
         shadow-lg hover:scale-110 hover:shadow-2xl transition transform duration-200"
>
  ←
</button>



    <!-- Заголовок -->
    <h1 class="text-4xl font-bold text-purple-700 mb-2 text-center">Список заметок ✧</h1>
    <p class="text-purple-500 text-lg mb-4 text-center">Добро пожаловать в Список заметок 💜</p>

    <!-- Главные кнопки -->
    <div v-if="!isListVisible && !isSearchVisible" class="flex flex-col gap-2">
      <button
        @click="showList"
        class="bg-purple-400 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-md transition duration-200 text-xl"
      >
        📜 Список заметок
      </button>

      <button
        @click="showSearch"
        class="bg-purple-400 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl shadow-md transition duration-200 text-xl"
      >
        🔍 Найти заметку
      </button>
    </div>

    <!-- Список заметок -->
    <div v-if="isListVisible" class="flex flex-col gap-8 mt-6 w-full max-w-md">
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md border border-purple-200 hover:scale-105 cursor-pointer transform transition duration-300"
        @click="openArticle(note.Article?.url)"
      >
        <p class="text-lg font-semibold text-purple-700 mb-2 break-words">{{ note.text }}</p>
        <div class="flex justify-between items-center text-purple-400 text-xs mt-3">
          <span class="px-2 py-1 bg-purple-100/50 rounded-full text-[10px]">ID: {{ note.id }}</span>
          <span>{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>

      <div v-if="notes.length === 0" class="text-center text-purple-400 mt-6">
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
          class="w-1/3 p-3 rounded-lg border border-purple-200 bg-white/60 focus:border-purple-400 outline-none"
        />
        <input
          type="text"
          placeholder="Текст заметки"
          v-model="newNoteText"
          class="flex-1 p-3 rounded-lg border border-purple-200 bg-white/60 focus:border-purple-400 outline-none"
        />
        <button
          @click="addNote"
          class="w-12 h-12 flex items-center justify-center bg-purple-400 text-white rounded-full shadow-md hover:bg-purple-500 active:scale-95 transition"
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
        class="w-full p-3 rounded-lg border border-purple-200 focus:border-purple-400 outline-none bg-white/60 text-purple-700"
      />

      <!-- Список найденных заметок -->
      <div v-for="note in filteredNotes" :key="note.id"
        class="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-md border border-purple-200 hover:scale-105 cursor-pointer transform transition duration-300"
        @click="openArticle(note.Article?.url)"
      >
        <p class="text-lg font-semibold text-purple-700 mb-2 break-words">{{ note.text }}</p>
        <div class="flex justify-between items-center text-purple-400 text-xs mt-3">
          <span class="px-2 py-1 bg-purple-100/50 rounded-full text-[10px]">ID: {{ note.id }}</span>
          <span>{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>

      <div v-if="filteredNotes.length === 0" class="text-center text-purple-400 mt-6">
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
