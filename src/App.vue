<template>
  <div id="app">
    <router-view @start-quiz="handleStartQuiz" />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    handleStartQuiz(quizId) {
      this.$router.push(`/quiz/${quizId}`);
    }
  },
  mounted() {
    console.log('🚀 App mounted - ZONEQUIZZZ');
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  min-height: 100vh;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  background: #f8fafc;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #7468f3;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a4bd1;
}
</style>