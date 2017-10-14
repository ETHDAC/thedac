<template>
  <section class="container">
    <md-card class="space">
      <md-card-header>
        <div class="md-title">Your Account:</div>
        <div class="md-subhead">{{ account }}</div>
      </md-card-header>

      <!-- <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions> -->

      <md-card-content>
        Make Donations, track donations, etc...
      </md-card-content>
    </md-card>

    <form class="space" novalidate @submit.stop.prevent="() => {}">
      <h2 class="md-display-1">Donate</h2>
      <md-input-container>
        <label>Pick a Project</label>
        <md-input v-model="name"></md-input>
      </md-input-container>

      <md-input-container>
        <label>Amount</label>
        <md-input v-model="name"></md-input>
      </md-input-container>

      <md-button type="submit" class="md-raised md-primary">Donate</md-button>

      <p><strong>Note:</strong> After submit a receipt is generated that gives you the information you need to track transactions. The app stores this receipt.</p>

    </form>

    <form class="space" novalidate @submit.stop.prevent="() => {}">
      <h2 class="md-display-1">Track</h2>
      <md-input-container>
        <label>Hash or something from receipt that pulls up donation tracking</label>
        <md-input v-model="name"></md-input>
      </md-input-container>

      <md-button type="submit" class="md-raised md-primary">Look Up</md-button>

      <p><strong>Note:</strong> After submit the app reveals a table of titles and a visualization of tokens.</p>

    </form>
  </section>
</template>

<script>
import w3h from '../utils/web3helpers'

export default {
  name: 'TheDac',
  data() {
    return {
      account: '',
      name: '',
      title: 'The Dac'
    }
  },
  mounted() {
    w3h.getAccounts().then(data => {
      this.account = data[0]
    })
  }
}
</script>

<style scoped>
</style>
