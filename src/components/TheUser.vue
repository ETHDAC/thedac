<template>
  <section class="container">
    <div class="flex">
      <md-card class="space">
        <md-card-header>
          <div class="md-title">Your Account:</div>
          <div class="md-subhead">{{ account }}</div>
          <p><strong>Balance:</strong> {{ balance }} ETH</p>
        </md-card-header>

        <!-- <md-card-actions>
          <md-button>Action</md-button>
          <md-button>Action</md-button>
        </md-card-actions> -->

        <md-card-content>
          Make donations &amp; track your donations.
        </md-card-content>
      </md-card>

      <form class="space" novalidate @submit.stop.prevent="() => {}">
        <h2 class="md-display-1">Donate</h2>

        <md-input-container>
          <label>Amount</label>
          <md-input type="number" v-model="donation"></md-input>
        </md-input-container>

        <md-button type="submit" class="md-raised md-primary" @click="donate">Donate</md-button>

        <p><strong>Note:</strong> After submit a receipt is generated that gives you the information you need to track transactions. The app stores this receipt.</p>

      </form>
    </div>

    <h2 class="md-display-1">Track Your Titles</h2>
    <p>Donations get converted into <strong>SAI</strong>. Your donation then mints a <strong>TitleToken</strong>, this way you are able to see exactly where your money is going and where it has been. A <strong>TitleToken</strong> represent your entire donation in <strong>SAI</strong>.</p>

    <h3>Click on a title to see a visual tree of your donation:</h3>

    <md-table class="space" @select="onSelect">
      <md-table-header>
        <md-table-row>
          <md-table-head>Title</md-table-head>
          <md-table-head class="align-right">Donation (ETH)</md-table-head>
          <md-table-head class="align-right">SAI</md-table-head>
        </md-table-row>
      </md-table-header>

      <md-table-body>
        <md-table-row md-selection :md-item="{title: 1}">
          <md-table-cell>1</md-table-cell>
          <md-table-cell class="align-right">10</md-table-cell>
          <md-table-cell class="align-right">1,000</md-table-cell>
        </md-table-row>
        <md-table-row md-selection :md-item="{title: 2}">
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
      account: '',
      balance: 0,
      donation: 0,
      title: '',
      
      amount: 0, // The amount of SAI raised
      targetAmount: 0, // The amount of SAI we are trying to raise
      name: '',
      title: 'The Dac'
      
    }
  },
  mounted() {
    setTimeout(() => this.init(), 1000)
  },
  methods: {
    onSelect(rows) {
      rows.forEach((row) => {
        console.log(`use ${row.title} to create the D3 graph`)
      })
    },
    
    async donate() {
      console.log(w3h.toWei(this.donation));
    },
    
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
  .flex > div {
    width: 50%;
  }

  .flex > form {
    width: calc(50% - 20px);
    margin-left: 20px;
  }

  .md-card .md-subhead {
    word-wrap: break-word;
  }
</style>
