import { defineStore } from "pinia";
import axios from "axios";


export const useNoteStore = defineStore("note", {
  state: () => ({
    notes: [],

  }),
  actions: {
    async getNoteByUserid(userId) {

      const res = await axios.get(`http://localhost:3000/api/note/${userId}`);

      if (res.status == 200) {
        this.notes = res.data.notes;
        // debugger 
      }
    },
    async addNote(data){
      try {
        const res = await axios.post(`http://localhost:3000/api/note/new`, data);
        if (res.status === 201) {
          // добавляем новую заметку в store
          this.notes.push(res.data.note); 
        }
        return { success: true, message: res.data.message };
      } catch (err) {
        return { success: false, message: err.response?.data?.message || err.message };
      } 
      
    }
  },
});
