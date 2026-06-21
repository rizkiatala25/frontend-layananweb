<template>
  <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: 'Poppins', sans-serif;">
    <h1 style="color: #1e293b; margin-bottom: 10px;">🧪 Test Koneksi Backend</h1>
    <p style="color: #64748b; margin-bottom: 24px;">Cek apakah frontend sudah terhubung dengan backend</p>
    
    <!-- Status -->
    <div style="margin: 20px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
      <p><strong>📍 Backend URL:</strong> {{ apiUrl }}</p>
      <p><strong>📊 Status:</strong> <span :style="{color: statusColor, fontWeight: 'bold'}">{{ statusText }}</span></p>
      <p v-if="lastResponseTime" style="font-size: 13px; color: #94a3b8;">⏱️ Response time: {{ lastResponseTime }}ms</p>
    </div>

    <!-- Tombol Test -->
    <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;">
      <button 
        @click="testPing" 
        :disabled="loading" 
        style="padding: 12px 28px; background: #7468f3; color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 500;"
      >
        {{ loading ? '⏳ Loading...' : '🏓 Test Ping' }}
      </button>
      
      <button 
        @click="testLogin" 
        :disabled="loading" 
        style="padding: 12px 28px; background: #10b981; color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 500;"
      >
        {{ loading ? '⏳ Loading...' : '🔑 Test Login' }}
      </button>
      
      <button 
        @click="testQuizzes" 
        :disabled="loading" 
        style="padding: 12px 28px; background: #8b5cf6; color: white; border: none; border-radius: 10px; cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 500;"
      >
        {{ loading ? '⏳ Loading...' : '📚 Test Get Quizzes' }}
      </button>
    </div>

    <!-- Hasil Response -->
    <div v-if="result" style="margin-top: 20px; background: #1e293b; color: #e2e8f0; padding: 20px; border-radius: 12px; overflow: auto; max-height: 400px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <span style="font-weight: 600; color: #94a3b8;">📦 RESPONSE:</span>
        <span style="font-size: 12px; color: #64748b; cursor: pointer;" @click="copyResult">📋 Copy</span>
      </div>
      <pre style="white-space: pre-wrap; word-break: break-all; font-size: 13px; font-family: 'Courier New', monospace; margin: 0;">{{ result }}</pre>
    </div>

    <!-- Error -->
    <div v-if="errorMsg" style="margin-top: 20px; background: #fee2e2; padding: 20px; border-radius: 12px; color: #dc2626;">
      <div style="font-weight: 600; margin-bottom: 8px;">❌ ERROR:</div>
      <pre style="white-space: pre-wrap; word-break: break-all; font-size: 13px; margin: 0; font-family: 'Courier New', monospace;">{{ errorMsg }}</pre>
    </div>

    <!-- Tombol Kembali -->
    <div style="margin-top: 30px; text-align: center;">
      <button 
        @click="$emit('back-to-home')" 
        style="padding: 10px 24px; background: #e2e8f0; color: #1e293b; border: none; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif;"
      >
        ← Kembali ke Home
      </button>
    </div>
  </div>
</template>

<script>
import api from '@/api/index.js';
import { useAuthStore } from '@/stores/authStore.js';

export default {
  name: 'TestConnection',
  emits: ['back-to-home'],
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
      loading: false,
      result: null,
      errorMsg: null,
      statusText: 'Belum di-test',
      statusColor: '#94a3b8',
      lastResponseTime: null
    };
  },
  methods: {
    async testPing() {
      this.loading = true;
      this.result = null;
      this.errorMsg = null;
      this.statusText = '⏳ Testing...';
      this.statusColor = '#f59e0b';
      this.lastResponseTime = null;
      
      const startTime = Date.now();
      
      try {
        const response = await api.get('/ping');
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.result = JSON.stringify(response.data, null, 2);
        this.statusText = '✅ Koneksi Berhasil!';
        this.statusColor = '#10b981';
      } catch (error) {
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.statusText = '❌ Gagal Koneksi';
        this.statusColor = '#dc2626';
        this.errorMsg = `Error: ${error.message}`;
        
        if (error.response) {
          this.errorMsg += `\nStatus: ${error.response.status}`;
          this.errorMsg += `\nData: ${JSON.stringify(error.response.data, null, 2)}`;
        } else if (error.request) {
          this.errorMsg += '\n\n💡 Solusi:';
          this.errorMsg += '\n1. Pastikan backend sudah jalan (php -S 0.0.0.0:8000 -t public)';
          this.errorMsg += '\n2. Cek IP dan Port di src/api/index.js sudah benar';
          this.errorMsg += '\n3. Cek koneksi jaringan (ping IP backend)';
        }
      } finally {
        this.loading = false;
      }
    },

    async testLogin() {
      this.loading = true;
      this.result = null;
      this.errorMsg = null;
      this.statusText = '⏳ Testing Login...';
      this.statusColor = '#f59e0b';
      this.lastResponseTime = null;
      
      const startTime = Date.now();
      
      try {
        const authStore = useAuthStore();
        const result = await authStore.login('student', 'password123');
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.result = JSON.stringify(result, null, 2);
        
        if (result.success) {
          this.statusText = '✅ Login Berhasil!';
          this.statusColor = '#10b981';
        } else {
          this.statusText = '❌ Login Gagal';
          this.statusColor = '#dc2626';
          this.errorMsg = result.message || 'Login gagal';
        }
      } catch (error) {
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.statusText = '❌ Error Login';
        this.statusColor = '#dc2626';
        this.errorMsg = `Error: ${error.message}`;
        
        if (error.response) {
          this.errorMsg += `\nStatus: ${error.response.status}`;
          this.errorMsg += `\nData: ${JSON.stringify(error.response.data, null, 2)}`;
        }
      } finally {
        this.loading = false;
      }
    },

    async testQuizzes() {
      this.loading = true;
      this.result = null;
      this.errorMsg = null;
      this.statusText = '⏳ Testing Get Quizzes...';
      this.statusColor = '#f59e0b';
      this.lastResponseTime = null;
      
      const startTime = Date.now();
      
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          this.statusText = '❌ Tidak ada token';
          this.statusColor = '#dc2626';
          this.errorMsg = 'Silakan login terlebih dahulu sebelum mengambil quizzes';
          this.loading = false;
          return;
        }
        
        const response = await api.get('/quizzes');
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.result = JSON.stringify(response.data, null, 2);
        this.statusText = `✅ Quizzes Berhasil Diambil! (${response.data?.data?.length || 0} data)`;
        this.statusColor = '#10b981';
      } catch (error) {
        const endTime = Date.now();
        this.lastResponseTime = endTime - startTime;
        
        this.statusText = '❌ Gagal Get Quizzes';
        this.statusColor = '#dc2626';
        this.errorMsg = `Error: ${error.message}`;
        
        if (error.response) {
          this.errorMsg += `\nStatus: ${error.response.status}`;
          this.errorMsg += `\nData: ${JSON.stringify(error.response.data, null, 2)}`;
        }
      } finally {
        this.loading = false;
      }
    },

    copyResult() {
      if (this.result) {
        navigator.clipboard.writeText(this.result);
        alert('✅ Response berhasil di-copy!');
      }
    }
  }
};
</script>