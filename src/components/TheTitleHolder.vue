<template>
  <section class="container">
    <md-card class="space">
      <md-card-header>
        <div class="md-title">Title Transfers</div>
      </md-card-header>

      <!-- <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions> -->

      <md-card-content>
        The DAC can transfer titles between projects. Select from the table below and transfer titles between projects.
      </md-card-content>
    </md-card>

    <md-table @select="getTotal">
      <md-table-header>
        <md-table-row>
          <md-table-head>Title</md-table-head>
          <md-table-head class="align-right">Donation (ETH)</md-table-head>
          <md-table-head class="align-right">Donor</md-table-head>
          <md-table-head class="align-right">Active?</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row md-selection :md-item="title" v-for="(title, index) in titles" key={index}>
          <md-table-cell>{{ index }}</md-table-cell>
          <md-table-cell class="align-right">{{ title.balance }}</md-table-cell>
          <md-table-cell class="align-right">
            {{ title.donor }}
          </md-table-cell>
          <md-table-cell class="align-right">{{ title.active ? 'yes' : 'no' }}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>
    <p><strong>Total ETH to Transfer:</strong> {{ selectedTotal }}</p>

    <form @submit.prevent="() => {}" class="space">
      <md-input-container>
        <label for="movie">Project</label>
        <md-select name="movie" id="movie" v-model="movie">
          <md-option v-for="(project, index) in projects" :key="index" :value="project">{{ project }}</md-option>
        </md-select>
      </md-input-container>
      <md-button type="submit" class="md-raised md-primary">Transfer Title</md-button>
    </form>
  </section>
</template>

<script>
import w3h from '../utils/web3helpers'
import DAC from '../../build/contracts/DAC.json'
// import Project from '../../build/contracts/Project.json'
import TitleToken from '../../build/contracts/TitleToken.json'
import { DAC_ADDRESS } from '../constants'

export default {
  data() {
    return {
      totalTitles: 0,
      titles: [],
      selectedTotal: 0,
      projects: []
    }
  },
  mounted() {
    setTimeout(() => this.init(), 500)
    // w3h.getAccounts().then(data => {
    //   this.account = data[0]
    // })
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
    getTotal(titles) {
      this.selectedTotal = titles.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.balance
      }, 0)
    },
    async init() {
      const dac = await w3h.getContract(DAC, DAC_ADDRESS)
      // const accounts = await w3h.getAccounts()

      const projects = await dac.getProjects.call()
      this.projects = projects

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
