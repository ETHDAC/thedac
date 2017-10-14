<template>
  <form class="container" novalidate @submit.stop.prevent="() => {}">
    <md-input-container>
      <label>Name</label>
      <md-input v-model="name"></md-input>
    </md-input-container>
  </form>
</template>

<script>
export default {
  name: 'TheDac',
  data () {
    return {
      title: 'The Dac',
      name: ''
    }
  }
}
</script>

<style scoped>
</style>
