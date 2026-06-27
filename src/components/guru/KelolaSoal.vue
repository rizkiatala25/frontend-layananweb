<template>
  <div style="padding: 50px; max-width: 900px; margin: 0 auto;">
    <h1 style="color: #6c5ce7;">📝 Kelola Soal</h1>
    <p style="color: #64748b; margin-bottom: 30px;">Halaman untuk mengelola soal-soal quiz.</p>
    
    <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
      <p style="color: #94a3b8; text-align: center; padding: 40px 0;">
        🔧 Halaman ini sedang dalam pengembangan.
      </p>
    </div>
    
    <div style="margin-top: 20px;">
      <button @click="goBack" style="padding: 10px 24px; background: #e2e8f0; color: #1e293b; border: none; border-radius: 8px; cursor: pointer;">
        ← Kembali
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KelolaSoal',
  methods: {
    goBack() {
      this.$router.push('/dashboard/guru');
    }
  }
};
</script>