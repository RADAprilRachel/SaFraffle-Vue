<template>
  <div id="app">
    <raffle-display :raffle="raffle"/>
    <raffle-item-display :raffle_items="raffle_items" 
                         :ticket_cost="raffle.ticket_cost"
                         @increment="increment"
                         @decrement="decrement" />
  </div>
</template>

<script>
import RaffleDisplay from './components/RaffleDisplay.vue'
import RaffleItemDisplay from './components/RaffleItemDisplay.vue'

export default {
  name: 'App',
  components: {
    RaffleDisplay,
    RaffleItemDisplay
  },
  data () {
    return {
      raffle: {},
      raffle_items: {},
    }
  },
  mounted() {
    this.getRaffleData()
  },
  methods: {
    async getRaffleData() {
      try {
        const response = await fetch('https://safraffle.com/api/raffles/3/raffleItems')
        const data = await response.json()
        this.raffle = data.data.raffle
        this.raffle_items = data.data.raffle_items.map(item => {
            item.ticket_count = 0
            return item
        })
      } catch (error) {
        console.error(error)
      }
    },
    increment(id) {
      this.raffle_items = this.raffle_items.map(item => {
        if (item.id === id && item.ticket_count < 100) {
          item.ticket_count += 1
          return item
        }
        else {
          return item
        }
      })
    },
    decrement(id) {
      this.raffle_items = this.raffle_items.map(item => {
        if (item.id === id && item.ticket_count > 0) {
          item.ticket_count -= 1
          return item
        }
        else {
          return item
        }
      })
    } 
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
