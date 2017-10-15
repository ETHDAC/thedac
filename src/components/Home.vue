<template>
  <section class="container">
    <p><strong>The DAC</strong> tries to raise a certain amount of <strong>SAI</strong> to fund a variety of projects and then allows donors to track their donations all the way to the boots on the ground who ultimately use the funds. How does it do it?</p>

    <ul>
      <li>Donations are done with <strong>ETH</strong> and converted to <strong>SAI</strong> at the moment of donation</li>
      <li>All SAI is held in a reserve account</li>
      <li>A <strong>Trackable Token</strong> called a <strong>TitleToken</strong> is minted to represent each donation</li>
      <li><strong>TitleTokens</strong> are transferred down the supply chain all the way to boots on the ground</li>
      <li>At any point the <strong>TitleTokens</strong> can be traded for <strong>SAI</strong> from the reserve account</li>
    </ul>

    <router-link tag="md-button" to="/dac" class="md-raised md-primary">See the DAC</router-link>
    <router-link tag="md-button" to="/user" class="md-raised md-primary">Donate</router-link>
    <router-link tag="md-button" to="/title-holder" class="md-raised md-primary">Title Transfers</router-link>
    <router-link tag="md-button" to="/zero-x" class="md-raised md-primary">DAC Wallet</router-link>

  </section>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
