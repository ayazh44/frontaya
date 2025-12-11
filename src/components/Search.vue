<template>
  <div class="min-h-screen bg-pink-50 p-6">

    <!-- Заголовок -->
    <h1 class="text-3xl font-bold text-pink-600 mb-6 text-center">Мои заметки 💌</h1>
    <div class="flex flex-col md:flex-row items-center gap-3 max-w-md mx-auto mb-6">
  
  <input
    type="text"
    placeholder="ID статьи"
    v-model="newNoteArticleId"
    class="w-full p-3 rounded-lg border border-pink-300 bg-white focus:border-pink-500 outline-none"
  />

  <input
    type="text"
    placeholder="Текст заметки"
    v-model="newNoteText"
    class="w-full p-3 rounded-lg border border-pink-300 bg-white focus:border-pink-500 outline-none"
  />

  <button
    @click="addNote"
    class="w-12 h-12 flex items-center justify-center bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 active:scale-95 transition"
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
        class="flex-1 p-3 rounded-lg border border-pink-300 focus:border-pink-500 outline-none bg-white"
      />
      <button
        @click="filterNotes"
        class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-md"
      >
        🔍
      </button>
    </div>

    <!-- Список заметок -->
<div class="flex flex-col gap-6">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="bg-white p-4 rounded-xl shadow-lg border border-pink-200 transform transition duration-300 hover:rotate-1 hover:scale-105 hover:shadow-2xl"
      >
<p class="text-lg font-semibold text-pink-700 mb-2 break-words">
  {{ note.text }}
</p>
<div class="flex justify-between items-center text-pink-400 text-xs mt-3">
  <span class="px-2 py-1 bg-pink-100 rounded-full text-[10px]">ID: {{ note.id }}</span>
  <span>{{ formatDate(note.createdAt) }}</span>
</div>
      </div>
    </div>

    <div v-if="filteredNotes.length === 0" class="text-center text-pink-400 mt-6">
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
    //   notes: [],         // все заметки с сервера
      filteredNotes: [], // после поиска
      searchQuery: "",
    };
  },
  async created() {
    await this.loadNotes(1);
    // Получаем заметки с backend
    
  },
  methods: {
    async loadNotes(userId) {
        await this.noteStore.getNoteByUserid(userId); // ждём обновления notes
        this.filteredNotes = [...this.noteStore.notes]; // копируем массив после обновления
    },
    async addNote(){
        const articleId = this.newNoteArticleId?.trim();
        const text = this.newNoteText?.trim();
        if (!text) return;
        const userId = 1;
        const newNote = { articleId, userId, text };

        const result = await this.noteStore.addNote(newNote);
        if (result.success) {
        this.filteredNotes = [...this.noteStore.notes];
        this.newNoteText = ""; // очищаем поле
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
/* Эффект бумаги (тень + немного наклона) */
</style>