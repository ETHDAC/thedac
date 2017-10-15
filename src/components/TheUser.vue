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

    <TitleViz :data="titleData"></TitleViz>

  </section>
</template>

<script>
import w3h from '../utils/web3helpers'
import DAC from '../../build/contracts/DAC.json'
import Project from '../../build/contracts/Project.json'
import TitleToken from '../../build/contracts/TitleToken.json'
import { DAC_ADDRESS } from '../constants'

import TitleViz from '@/components/TitleViz'

import ethJSABI from 'ethjs-abi'

const decodeLogs = function(C, instance, logs) {
  return logs
    .map(function(log) {
      var logABI = C.networks[Object.keys(C.networks)[0]].events[log.topics[0]]

      if (logABI == null) {
        return null
      }
      // This function has been adapted from web3's SolidityEvent.decode() method,
      // and built to work with ethjs-abi.

      var copy = Object.assign({}, log)

      function partialABI(fullABI, indexed) {
        var inputs = fullABI.inputs.filter(function(i) {
          return i.indexed === indexed
        })

        var partial = {
          inputs: inputs,
          name: fullABI.name,
          type: fullABI.type,
          anonymous: fullABI.anonymous
        }

        return partial
      }

      var argTopics = logABI.anonymous ? copy.topics : copy.topics.slice(1)
      var indexedData =
        '0x' +
        argTopics
          .map(function(topics) {
            return topics.slice(2)
          })
          .join('')
      var indexedParams = ethJSABI.decodeEvent(
        partialABI(logABI, true),
        indexedData
      )

      var notIndexedData = copy.data
      var notIndexedParams = ethJSABI.decodeEvent(
        partialABI(logABI, false),
        notIndexedData
      )

      copy.event = logABI.name

      copy.args = logABI.inputs.reduce(function(acc, current) {
        var val = indexedParams[current.name]

        if (val === undefined) {
          val = notIndexedParams[current.name]
        }

        acc[current.name] = val
        return acc
      }, {})

      Object.keys(copy.args).forEach(function(key) {
        var val = copy.args[key]

        // We have BN. Convert it to BigNumber
        if (val.constructor.isBN) {
          copy.args[key] = window.web3.toBigNumber('0x' + val.toString(16))
        }
      })

      delete copy.data
      delete copy.topics

      return copy
    })
    .filter(function(log) {
      return log != null
    })
}

let dac, accounts, token, projects

export default {
  name: 'TheDac',

  components: {
    TitleViz
  },

  data() {
    return {
      account: '',
      balance: 0,
      donation: 0,
      title: '',

      titleData: {
        name: 'donations',
        children: []
      },

      amount: 0, // The amount of SAI raised
      targetAmount: 0, // The amount of SAI we are trying to raise
      name: ''
    }
  },
  mounted() {
    w3h.getWeb3()
    setTimeout(() => this.init(), 1000)

    w3h.getAccounts().then((accounts) => {
      this.account = accounts[0]
      w3h.getBalance(this.account).then((balance) => {
        this.balance = balance
      })
    })
  },
  methods: {
    onSelect(rows) {
      rows.forEach(row => {
        console.log(`use ${row.title} to create the D3 graph`)
      })
    },

    async donate() {
      const wei = w3h.toWei(this.donation)
      const tx = await dac.sendTransaction({
        from: accounts[0],
        value: wei
      })

      setTimeout(() => this.update(), 1000)
    },

    async update() {
      const total = (await token.titleCount.call()).toNumber()
      const data = []
      for (let i = 0; i < total; i++) {
        const titleData = await token.titleData.call(i)
        titleData.push(i)
        if (titleData[1] !== accounts[0] || titleData[2] === false) continue
        data.push(titleData)
      }

      var filter = window.web3.eth.filter({
        address: token.address,
        fromBlock: 0,
        toBlock: 'latest'
      })

      filter.get(async (error, result) => {
        const logs = decodeLogs(TitleToken, token, result)

        for (let i in logs) {
          const log = logs[i]

          if (log.event !== 'Transfer') continue
          const args = log.args
          args.a = args.a.toNumber()
          args.b = args.b.toNumber()
          args.title = args.title.toNumber()

          const parent = data.find(d => d[3] === args.b)

          console.log(parent)

          if (!parent) continue

          const childTitle = await token.titleData.call(args.a)

          console.log(childTitle)

          parent.push([
            {
              name: w3h.toEth(childTitle[0]),
              children: []
            }
          ])
        }

        this.titleData.children = data.map(d => ({
          name: w3h.toEth(d[0].toNumber()),
          children: d[4] ? d[4] : []
        }))
      })
    },

    async init() {
      accounts = await w3h.getAccounts();



      //for deploying
      window.deployDAC = () => {
        w3h.deployContract(DAC, accounts[0], 4000000);
      };

      dac = await w3h.getContract(DAC, DAC_ADDRESS);

      projects = await dac.getProjects.call()

      const project = await w3h.getContract(Project, projects[2])

      const address = await dac.token.call()

      token = await w3h.getContract(TitleToken, address)

      this.update()
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
