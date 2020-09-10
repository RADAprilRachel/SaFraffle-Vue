<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css2?family=Dosis&display=swap" rel="stylesheet">
    <div>
      <raffle-display :raffle="raffle"
                      :ticket_cost="raffle.ticket_cost"
                      :state="state"/>
      <raffle-item-display :raffle_items="raffle_items" 
                           :total_tickets="total_tickets"
                           :total_cost="total_cost"
                           :total_donation="total_donation"
                           :total_discount="total_discount"
                           :ticket_cost="raffle.ticket_cost"
                           :state="state"
                           @increment="increment"
                           @decrement="decrement" />
      <checkout-form :state="state"
                     :total_donation="total_donation"
                     :total_cost="total_cost"
                     :total_discount="total_discount"
                     :itemized_tickets="itemized_tickets"
                     :custom_id="custom_id"
                     :raffle_id="raffle.id"
                     @checkout="checkout"
                     @complete="paymentComplete"
      />
    </div>
  </div>
</template>

<script>
import RaffleDisplay from './components/RaffleDisplay.vue'
import RaffleItemDisplay from './components/RaffleItemDisplay.vue'
import CheckoutForm from './components/CheckoutForm.vue'

export default {
  name: 'App',
  components: {
    RaffleDisplay,
    RaffleItemDisplay,
    CheckoutForm
  },
  data () {
    return {
      state: "shop",
      raffle: {},
      raffle_items: [],
      contact_data: {},
      paypal_response: {},
      custom_id: Math.random().toString(36).slice(2)
    }
  },
  computed: {
    itemized_tickets () {
      return this.raffle_items.filter(item => item.ticket_count > 0).map( item => {
        return {
          name: 'Raffle ticket for '+item.name,
          description: 'Raffle ticket',
          quantity: item.ticket_count,
          unit_amount: {
              currency_code: "USD",
              value: this.raffle.ticket_cost
          },
          sku: item.id,
          category: "DIGITAL_GOODS"
        }
      })
    },
    total_tickets () {
      return this.raffle_items.reduce( (acc, item) => acc + Number(item.ticket_count), 0)
    },
    total_cost () {
      return parseFloat(this.total_tickets * this.raffle.ticket_cost).toFixed(2)
    },
    total_donation () {
      return parseFloat(this.total_cost - this.total_discount).toFixed(2)
    },
    total_discount () {
      return parseFloat(Math.floor(this.total_tickets/5)*this.raffle.ticket_cost).toFixed(2)
    }
  },
  mounted() {
    this.getRaffleData()
  },
  methods: {
    checkout (contact_data) {
      this.state = "checkout"
      this.contact_data = contact_data
    },
    paymentComplete(response) {
        this.state = "complete"
        this.paypal_response = response
    },
    async getRaffleData() {
      try {
        const response = await fetch('https://safraffle.com/api/raffles/1/raffleItems')
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
  font-family: 'Dosis', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
