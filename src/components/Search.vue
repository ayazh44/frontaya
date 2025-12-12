<template>
  <div class="min-h-screen bg-gradient-to-br from-[#F3E5F5] to-[#EDE7F6] p-6">

    <!-- Заголовок -->
    <h1 class="text-3xl font-bold text-purple-700 mb-6 text-center">Мои заметки 💌</h1>

    <!-- Добавление новой заметки -->
    <div class="flex flex-col md:flex-row items-center gap-3 max-w-md mx-auto mb-6">
      <input
        type="text"
        placeholder="ID статьи"
        v-model="newNoteArticleId"
        class="w-full p-3 rounded-lg border border-purple-200 bg-white/80 focus:border-purple-400 outline-none shadow-sm"
      />

      <input
        type="text"
        placeholder="Текст заметки"
        v-model="newNoteText"
        class="w-full p-3 rounded-lg border border-purple-200 bg-white/80 focus:border-purple-400 outline-none shadow-sm"
      />

      <button
        @click="addNote"
        class="w-12 h-12 flex items-center justify-center bg-purple-300 text-white rounded-full shadow-md hover:bg-purple-400 active:scale-95 transition"
      >
        +
      </button>
    </div>

    <!-- Поиск -->
    <div class="flex mb-6 max-w-md mx-auto gap-2">
      <input
        v-model="searchQuery"   
        @input="filterNotes"
        type="text"
        placeholder="Поиск заметки..."
        class="flex-1 p-3 rounded-lg border border-purple-200 focus:border-purple-400 outline-none bg-white/80 text-purple-700"
      />
      <button
        @click="filterNotes"
        class="bg-purple-300 hover:bg-purple-400 text-white px-4 py-2 rounded-lg shadow-md transition"
      >
        🔍
      </button>
    </div>

    <!-- Список заметок -->
    <div class="flex flex-col gap-6 max-w-md mx-auto">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="bg-white/80 p-4 rounded-2xl shadow-md border border-purple-200 transform transition duration-300 hover:scale-105 hover:shadow-lg"
      >
        <p class="text-lg font-semibold text-purple-700 mb-2 break-words">
          {{ note.text }}
        </p>
        <div class="flex justify-between items-center text-purple-400 text-xs mt-3">
          <span class="px-2 py-1 bg-purple-100/50 rounded-full text-[10px]">ID: {{ note.id }}</span>
          <span>{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredNotes.length === 0" class="text-center text-purple-400 mt-6">
      Заметки не найдены 😿
    </div>

  </div>
</template>

<script>
import { useNoteStore } from "../stores/noteStore.js";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

export default {
  name: "NotesPage",
  setup() {
    const noteStore = useNoteStore();
    const { notes } = storeToRefs(noteStore);
    const router = useRouter();

    return { noteStore, notes, router };
  },
  data() {
    return {
      filteredNotes: [], // после поиска
      searchQuery: "",
    };
  },
  async created() {
    await this.loadNotes(1);
  },
  methods: {
    async loadNotes(userId) {
      await this.noteStore.getNoteByUserid(userId);
      this.filteredNotes = [...this.noteStore.notes];
    },
    async addNote() {
      const articleId = this.newNoteArticleId?.trim();
      const text = this.newNoteText?.trim();
      if (!text) return;
      const userId = 1;
      const newNote = { articleId, userId, text };

      const result = await this.noteStore.addNote(newNote);
      if (result.success) {
        this.filteredNotes = [...this.noteStore.notes];
        this.newNoteText = "";
      } else {
        alert(result.message);
      }
    },
    filterNotes() {
      const q = this.searchQuery.toLowerCase().trim();
      if (!q) {
        this.filteredNotes = [...this.noteStore.notes];
        return;
      }
      this.filteredNotes = this.noteStore.notes.filter(note =>
        note.text.toLowerCase().includes(q)
      );
    },
    formatDate(date) {
      return new Date(date).toLocaleString("ru-RU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
/* Мягкий стиль: плавные тени и легкая прозрачность уже через Tailwind */
</style>
