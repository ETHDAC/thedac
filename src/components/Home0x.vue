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

    <md-button @click="getSomeWeth" type="button" class="md-raised md-primary">Get Some wETH</md-button>

  </section>
</template>

<script>
import { ZeroEx } from '0x.js'
import BigNumber from 'bignumber.js'

export default {
  name: 'Home0x',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted() {
    console.log(ZeroEx, BigNumber)
    this.init()
  },
  methods: {
    async init() {
      console.log('init')
    },
    async getSomeWeth() {
      const provider = window.web3.currentProvider

      // Instantiate 0x.js instance
      const zeroEx = new ZeroEx(provider)

      const accounts = await zeroEx.getAvailableAddressesAsync()

      const takerAddress = accounts[0]

      console.log(takerAddress)

      // The wrapped ETH token contract
      // const WETH_ADDRESS = await zeroEx.etherToken.getContractAddressAsync()

      // Number of ETH to convert to WETH
      const amountOfEth = new BigNumber(0.001)

      // Deposit WETH
      const ethToConvert = ZeroEx.toBaseUnitAmount(amountOfEth, 18)

      const txHashWETH = zeroEx.etherToken.depositAsync(ethToConvert, takerAddress)
      await zeroEx.awaitTransactionMinedAsync(txHashWETH)
      console.log('ETH -> WETH Mined...')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
