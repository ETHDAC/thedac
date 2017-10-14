<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <header class="site-header space">
      <h1 class="md-display-1">
        <router-link :to="{ name: 'Home', params: {} }">DAC</router-link>
      </h1>
    </header>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.site-header {
  padding: 20px 40px;
  background: #f5f5f5;
  border-bottom: 1px solid #e3e3e3;
}

.site-header h1 {
  margin: 0;
}

.site-header h1 a {
  margin: 0;
  color: #fff;
}
</style>
