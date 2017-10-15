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
    <md-button @click="getSAI" type="button" class="md-raised md-primary">Get SAI</md-button>

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
      const amountOfEth = new BigNumber(1)

      // Deposit WETH
      const ethToConvert = ZeroEx.toBaseUnitAmount(amountOfEth, 18)

      const txHashWETH = zeroEx.etherToken.depositAsync(ethToConvert, takerAddress)
      await zeroEx.awaitTransactionMinedAsync(txHashWETH)
      console.log('ETH -> WETH Mined...')
    },
    async getSAI() {
      const DECIMALS = 18;

      const provider = window.web3.currentProvider

      // Instantiate 0x.js instance
      const zeroEx = new ZeroEx(provider)

      const accounts = await zeroEx.getAvailableAddressesAsync()

      const takerAddress = accounts[0]

      console.log(takerAddress)

      const NULL_ADDRESS = ZeroEx.NULL_ADDRESS;
      // The wrapped ETH token contract
      const WETH_ADDRESS = await zeroEx.etherToken.getContractAddressAsync();
      // The Exchange.sol address (0x exchange smart contract)
      const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddressAsync();
      console.log('exch addr', EXCHANGE_ADDRESS);
      const SAI_ADDRESS  = '0x228BF3D5BE3ee4b80718b89b68069b023c32131E'.toLowerCase();
      console.log('SAI', SAI_ADDRESS);
      const makerAddress = '0x001908971Cd263807D027606A18C95ceC1674E17'.toLowerCase();
      BigNumber.config({
        EXPONENTIAL_AT: 1000,
      });


      const order = {
    			 maker: "0x001908971cd263807d027606a18c95cec1674e17",
    			 taker: NULL_ADDRESS,
    	           	 feeRecipient: NULL_ADDRESS,
    	           	 makerTokenAddress: SAI_ADDRESS,
    	              	 takerTokenAddress: WETH_ADDRESS,
    	              	 exchangeContractAddress: EXCHANGE_ADDRESS,
    	              	 salt: new BigNumber('13919592993420762108117692848912661297005251644568999534567383672765549202412'),
    	           	     makerFee: new BigNumber(0),
    	              	 takerFee: new BigNumber(0),
    	            	 makerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(40000), DECIMALS),  // Base 18 decimals
    	           	 takerTokenAmount: ZeroEx.toBaseUnitAmount(new BigNumber(133.33), DECIMALS),  // Base 18 decimals
    	           	 expirationUnixTimestampSec: new BigNumber('1508265300'),          // Valid up to an hour
    	              };
      // Create orderHash
    	const orderHash = ZeroEx.getOrderHashHex(order);

      // Signing orderHash -> ecSignature
    	const ecSignature = {
        r:"0x233b1b970b1a2d780d50af928f4ec0f4a28bdf42edb9cd8437939d025ac2ed64",
        s:"0x6e66fa2b1cf170a0d9b9d843af6c8df9623b0e867baf0f71580b1414f8b755e3",
        v:28}
      // const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress);

      // Appending signature to order
      const signedOrder = {
    			       ...order,
    			       ecSignature,
    	                    };

      const shouldThrowOnInsufficientBalanceOrAllowance = true;
      const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(new BigNumber(0.1), DECIMALS);
      console.log(signedOrder)
      // Try filling order
      const txHash = await zeroEx.exchange.fillOrderAsync(signedOrder, fillTakerTokenAmount,
        shouldThrowOnInsufficientBalanceOrAllowance, takerAddress,);

    	// Transaction Receipt
    	const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash);
    	console.log(txReceipt.logs);

    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
