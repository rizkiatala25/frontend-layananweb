<template>
  <div class="hello-container">
    <h1>Hello World!</h1>
    <p>{{ pesan }}</p>
    <small>kuis</small>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Variabel reaktif untuk menampilkan pesan ke HTML di atas
const pesan = ref('Mantap')
</script>

<style scoped>
/* Styling sederhana agar tulisan pas di tengah layar */
.hello-container {
  font-family: sans-serif;
  text-align: center;
  margin-top: 150px;
  padding: 20px;
}

h1 {
  color: #42b883; /* Warna hijau khas Vue */
  font-size: 3rem;
  margin-bottom: 10px;
}

p {
  color: #2c3e50;
  font-size: 1.2rem;
}

small {
  color: #95a5a6;
  display: block;
  margin-top: 40px;
}
</style>