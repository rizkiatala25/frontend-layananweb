<template>
  <div class="home">
    <h1>ZONEQUIZZZ</h1>
    <p>Selamat datang di platform quiz!</p>
    <div class="btn-group">
      <router-link to="/login/siswa" class="btn">Login Siswa</router-link>
      <router-link to="/login/guru" class="btn">Login Guru</router-link>
      <router-link to="/register/siswa" class="btn btn-outline">Daftar Siswa</router-link>
      <router-link to="/register/guru" class="btn btn-outline">Daftar Guru</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>