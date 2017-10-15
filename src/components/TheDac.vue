<template>
  <section class="container">
    <md-card class="space">
      <md-card-header>
        <h1 class="md-title">Fundraiser:</h1>
        <div class="md-subhead">We are trying to raise {{ goal }} SAI</div>
      </md-card-header>

      <md-card-content>
        <h2>{{ balance }} / {{ goal }}</h2>
        <md-progress :md-progress="(balance/goal) * 100"></md-progress>
      </md-card-content>
    </md-card>

    <h2>Titles</h2>
    <p>The DAC issues titles that are backed by certain amounts of SAI. This table shows that:</p>

    <md-table class="space">
      <md-table-header>
        <md-table-row>
          <md-table-head>Title</md-table-head>
          <md-table-head class="align-right">Donation (ETH)</md-table-head>
          <md-table-head class="align-right">Donor</md-table-head>
          <md-table-head class="align-right">Active?</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row v-for="(title, index) in titles" key={index}>
          <md-table-cell>{{ index }}</md-table-cell>
          <md-table-cell class="align-right">{{ title.balance }}</md-table-cell>
          <md-table-cell class="align-right">
            {{ title.donor }}
          </md-table-cell>
          <md-table-cell class="align-right">{{ title.active ? 'yes' : 'no' }}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

  </section>
</template>

<script>
import w3h from '../utils/web3helpers'
import DAC from '../../build/contracts/DAC.json'
// import Project from '../../build/contracts/Project.json'
import TitleToken from '../../build/contracts/TitleToken.json'
import { DAC_ADDRESS } from '../constants'

export default {
  name: 'TheDac',
  data() {
    return {
      balance: 0, // The amount of SAI raised
      goal: 0, // The amount of SAI we are trying to raise
      name: '',
      title: 'The Dac',
      totalTitles: 0,
      titles: []
    }
  },
  mounted() {
    setTimeout(() => this.init(), 500)
  },
  methods: {
    createTitle(title) {
      const parsedTitle = {
        balance: window.web3.fromWei(title[0], 'ether').toNumber(),
        donor: title[1],
        active: title[2]
      }

      return parsedTitle
    },
    async init() {
      const dac = await w3h.getContract(DAC, DAC_ADDRESS)
      // const accounts = await w3h.getAccounts()

      // const projects = await dac.getProjects.call()

      // console.log(projects)

      // const project = await w3h.getContract(Project, projects[2])

      const address = await dac.token.call()
      const titleTokenContract = await w3h.getContract(TitleToken, address)

      // console.log(accounts)
      console.log('dac', dac)
      console.log('titleTokenContract', titleTokenContract)
      // console.log(project)

      // Get Target Amount (how much we want)
      const goal = await dac.goal()
      this.goal = window.web3.fromWei(goal, 'ether').toNumber()

      // Get Balance Amount (how much we have)
      const balance = await dac.balance()
      this.balance = window.web3.fromWei(balance, 'ether').toNumber()

      // Get Titles

      // const total = (await token.titleCount.call()).toNumber();
      // const data = [];
      //
      // console.log(total);
      //
      // for (let i = 0; i < total; i++) {
      //
      //   console.log(i);
      //   data.push(await token.titleData.call(i));
      // }
      // console.log(data);

      this.totalTitles = (await titleTokenContract.titleCount()).toNumber()
      const titles = []

      for (let i = 0; i < this.totalTitles; i++) {
        titles[i] = await titleTokenContract.titleData(i)
      }

      this.titles = titles.map((title) => {
        return this.createTitle(title)
      })
    }
  }
}
</script>

<style scoped>
</style>
