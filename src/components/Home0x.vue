<template>
  <section class="container">
    <h1>DAC Wallet</h1>
    <p>The DAC wallet convers ETH to SAI. Why?</p>

    <ul>
      <li><strong>SAI</strong> is a stable coin, because of it's realiable value it will closer match your cryptocurrency donation</li>
      <li>The DAC mints <strong>TitleTokens</strong> that represent each of your donations in <strong>SAI</strong></li>
      <li>The <strong>TitleTokens</strong> that the DAC issues can be traded for <strong>SAI</strong> from the pool</li>
    </ul>


    <md-card class="space">
      <md-card-header>
        <div class="md-title">Your Wallet</div>
        <div class="md-subhead"><strong>Your SAI Balance: {{ sai }} SAI</strong></div>
        <div class="md-subhead">Your WETH Balance: {{ weth }} wETH</div>
      </md-card-header>

      <md-card-actions>
        <md-button @click="getSomeWeth" type="button" class="md-raised md-primary">Convert 1 ETH to wETH</md-button>
        <md-button @click="getSAI" type="button" class="md-raised md-primary">Get SAI</md-button>
      </md-card-actions>

      <md-card-content>
        <strong>Note:</strong> you need wETH to trade for SAI because we use <code>0x.js</code> to simplify trading and acquiring <strong>SAI</strong>
      </md-card-content>
    </md-card>

    <p>Once you've got some <strong>SAI</strong> you can go to the donation page:</p>
    <router-link tag="md-button" to="/user" class="md-raised md-primary space">GO Donate</router-link>


  </section>
</template>

<script>
import { ZeroEx } from '0x.js'
import BigNumber from 'bignumber.js'

export default {
  name: 'Home0x',
  data() {
    return {
      weth: 0, // Amount of wEth
      sai: 0 // Amount of SAI
    }
  },
  mounted() {
    this.init()
    this.getBalancesOfStuff()
  },
  methods: {
    async init() {},
    async getBalancesOfStuff() {
      const provider = window.web3.currentProvider

      const zeroEx = new ZeroEx(provider)
      const accounts = await zeroEx.getAvailableAddressesAsync()
      const ownerAddress = accounts[0]

      const saiBalance = await zeroEx.token.getBalanceAsync('0x228bf3d5be3ee4b80718b89b68069b023c32131e', ownerAddress)

      this.sai = saiBalance.toNumber() / 1000000000000000000

      const wethBalance = await zeroEx.token.getBalanceAsync('0x05d090b51c40b020eab3bfcb6a2dff130df22e9c', ownerAddress)
      this.weth = wethBalance.toNumber() / 1000000000000000000
    },
    async getSomeWeth() {
      const provider = window.web3.currentProvider

      // Instantiate 0x.js instance
      const zeroEx = new ZeroEx(provider)

      const accounts = await zeroEx.getAvailableAddressesAsync()

      const takerAddress = accounts[0]

      // The wrapped ETH token contract
      const WETH_ADDRESS = await zeroEx.etherToken.getContractAddressAsync()
      console.log(WETH_ADDRESS)

      // Number of ETH to convert to WETH
      const amountOfEth = new BigNumber(1)

      // Deposit WETH
      const ethToConvert = ZeroEx.toBaseUnitAmount(amountOfEth, 18)

      const txHashWETH = zeroEx.etherToken.depositAsync(
        ethToConvert,
        takerAddress
      )
      await zeroEx.awaitTransactionMinedAsync(txHashWETH)
    },
    async getSAI() {
      const DECIMALS = 18

      const provider = window.web3.currentProvider

      // Instantiate 0x.js instance
      const zeroEx = new ZeroEx(provider)

      const accounts = await zeroEx.getAvailableAddressesAsync()

      const takerAddress = accounts[0]

      const NULL_ADDRESS = ZeroEx.NULL_ADDRESS
      // The wrapped ETH token contract
      const WETH_ADDRESS = await zeroEx.etherToken.getContractAddressAsync()
      // The Exchange.sol address (0x exchange smart contract)
      const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddressAsync()
      console.log('exch addr', EXCHANGE_ADDRESS)
      const SAI_ADDRESS = '0x228BF3D5BE3ee4b80718b89b68069b023c32131E'.toLowerCase()
      console.log('SAI', SAI_ADDRESS)
      const makerAddress = '0x001908971Cd263807D027606A18C95ceC1674E17'.toLowerCase()
      BigNumber.config({
        EXPONENTIAL_AT: 1000
      })

      const order = {
        maker: '0x001908971cd263807d027606a18c95cec1674e17',
        taker: NULL_ADDRESS,
        feeRecipient: NULL_ADDRESS,
        makerTokenAddress: SAI_ADDRESS,
        takerTokenAddress: WETH_ADDRESS,
        exchangeContractAddress: EXCHANGE_ADDRESS,
        salt: new BigNumber(
          '13919592993420762108117692848912661297005251644568999534567383672765549202412'
        ),
        makerFee: new BigNumber(0),
        takerFee: new BigNumber(0),
        makerTokenAmount: ZeroEx.toBaseUnitAmount(
          new BigNumber(40000),
          DECIMALS
        ), // Base 18 decimals
        takerTokenAmount: ZeroEx.toBaseUnitAmount(
          new BigNumber(133.33),
          DECIMALS
        ), // Base 18 decimals
        expirationUnixTimestampSec: new BigNumber('1508265300') // Valid up to an hour, remember to change
      }
      // Create orderHash
      const orderHash = ZeroEx.getOrderHashHex(order)

      // Signing orderHash -> ecSignature
      const ecSignature = {
        r: '0x233b1b970b1a2d780d50af928f4ec0f4a28bdf42edb9cd8437939d025ac2ed64',
        s: '0x6e66fa2b1cf170a0d9b9d843af6c8df9623b0e867baf0f71580b1414f8b755e3',
        v: 28
      }
      // const ecSignature = await zeroEx.signOrderHashAsync(orderHash, makerAddress);

      // Appending signature to order
      const signedOrder = {
        ...order,
        ecSignature
      }

      const shouldThrowOnInsufficientBalanceOrAllowance = true
      const fillTakerTokenAmount = ZeroEx.toBaseUnitAmount(
        new BigNumber(0.1),
        DECIMALS
      )
      // Try filling order
      const txHash = await zeroEx.exchange.fillOrderAsync(
        signedOrder,
        fillTakerTokenAmount,
        shouldThrowOnInsufficientBalanceOrAllowance,
        takerAddress
      )

      // Transaction Receipt
      const txReceipt = await zeroEx.awaitTransactionMinedAsync(txHash)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
