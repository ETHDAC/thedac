<template>
  <section class="container">
    <md-card class="space">
      <md-card-header>
        <h1 class="md-title">Fundraiser:</h1>
        <div class="md-subhead">We are trying to raise {{ targetAmount }} SAI</div>
      </md-card-header>

      <md-card-content>
        <h2>{{ amount }} / {{ targetAmount }}</h2>
        <md-progress :md-progress="0"></md-progress>
      </md-card-content>
    </md-card>

    <h2>Titles</h2>
    <p>The DAC issues titles that are backed by certain amounts of SAI. This table shows that:</p>

    <md-table class="space">
      <md-table-header>
        <md-table-row>
          <md-table-head>Title</md-table-head>
          <md-table-head class="align-right">Donation (ETH)</md-table-head>
          <md-table-head class="align-right">SAI</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row>
          <md-table-cell>1</md-table-cell>
          <md-table-cell class="align-right">10</md-table-cell>
          <md-table-cell class="align-right">1,000</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>2</md-table-cell>
          <md-table-cell class="align-right">1</md-table-cell>
          <md-table-cell class="align-right">250</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

  </section>
</template>

<script>
import w3h from '../utils/web3helpers'
import DAC from '../../build/contracts/DAC.json'
import Project from '../../build/contracts/Project.json'
import TitleToken from '../../build/contracts/TitleToken.json'

export default {
  name: 'TheDac',
  data() {
    return {
      amount: 0, // The amount of SAI raised
      targetAmount: 0, // The amount of SAI we are trying to raise
      name: '',
      title: 'The Dac'
    }
  },
  mounted() {
    setTimeout(() => this.init(), 500)
  },
  methods: {
    async init() {
      const dac = await w3h.getContract(DAC)
      const accounts = await w3h.getAccounts()
      
      const projects = await dac.getProjects.call()
      
      console.log(projects);
      
      const project = await w3h.getContract(
        Project,
        projects[2]
      )
      
      const address = await dac.token.call()
      const token = await w3h.getContract(
        TitleToken,
        address
      )
      
      
      console.log(dac);
      console.log(token);
      console.log(project);

    }
  }
}
</script>

<style scoped>
</style>
