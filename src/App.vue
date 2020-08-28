<template>
  <div id="app">
    <div>
      <raffle-display :raffle="raffle"
                      :ticket_cost="raffle.ticket_cost"
                      :state="state"/>
      <raffle-item-display :raffle_items="raffle_items" 
                           :total_tickets="total_tickets"
                           :total_donation="total_donation"
                           :ticket_cost="raffle.ticket_cost"
                           :state="state"
                           @increment="increment"
                           @decrement="decrement" />
    </div>
    <div v-show="state === 'complete'">
      <p class="success">Payment Completed!</p>
      <p>Thank you for your donation</p>
      <p>We will contact you if you win. Good luck!</p>
    </div>
    <div v-show="error === 'cancel'">
      <p class="error">Payment not processed!</p>
    </div>
    <div v-show="total_tickets > 0 && state === 'shop'">
      <button class="button" @click="checkout">Checkout</button>
    </div>
    <div class=paypal v-show="state === 'checkout'">
      <PayPal
        @payment-cancelled="paymentCancelled"
        @payment-completed="paymentCompleted"
        :amount="total_donation"
        currency="USD"
        :client="credentials"
        :items="itemized_tickets"
        :experience="experience_options"
        env="sandbox">
      </PayPal>
    </div>
  </div>
</template>

<script>
import RaffleDisplay from './components/RaffleDisplay.vue'
import RaffleItemDisplay from './components/RaffleItemDisplay.vue'
import PayPal from 'vue-paypal-checkout'

export default {
  name: 'App',
  components: {
    RaffleDisplay,
    RaffleItemDisplay,
    PayPal
  },
  data () {
    return {
      state: "shop",
      error: "none",
      raffle: {},
      raffle_items: [],
      credentials: {
        sandbox: 'AdsXXE61inTIs-q731ToP4wjGgKodV8ZYxu53_NU184iGwql8WD8QdKv9eKZQHsNcbYhvLWBUWvJPNQs',
        production: '<production client id>'
      },
      experience_options: {
       input_fields: {
          no_shipping: 1
        }
      }
    }
  },
  computed: {
    itemized_tickets () {
      return this.raffle_items.filter(item => item.ticket_count > 0).map( item => {
        return {
          name: 'Raffle ticket for '+item.name,
          description: 'Raffle ticket',
          quantity: item.ticket_count,
          price: this.raffle.ticket_cost,
          currency: 'USD'
        }
      })
    },
    total_tickets () {
      return this.raffle_items.reduce( (acc, item) => acc + Number(item.ticket_count), 0)
    },
    total_donation () {
      return parseFloat(this.total_tickets * this.raffle.ticket_cost).toFixed(2)
    }
  },
  mounted() {
    this.getRaffleData()
  },
  methods: {
    checkout () {
      this.state = "checkout"
    },
    paymentCompleted (response) {
      this.state = "complete"
      this.clearError()
      console.log(response)
    },
    paymentCancelled () {
      this.error = "cancel"
    },
    clearError () {
      this.error = "None"
    },
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
  margin-top: 0px;
}
.paypal {
    padding: 8px;
}
.success {
    background-color: #adffc5;
    color: #111111;
    font-weight: bold;
    margin: 6px auto;
    padding: 8px;
    display: inline-block;
    border-radius: 7px;
}
.error {
    background-color: #ff7070;
    color: #111111;
    font-weight: bold;
    margin: 6px auto;
    padding: 6px;
    display: inline-block;
    border-radius: 7px;
}
.button{
  border: none;
  background-color:#d86018;
  display:inline-block;
  padding:0.5em 1.0em;
  margin:0 0.3em 0.3em 0;
  border-radius:0.5em;
  box-sizing: border-box;
  text-decoration:none;
  font-weight:600;
  font-size: 1.1rem;
  color:#FFFFFF;
  box-shadow:inset 0 -0.6em 1em -0.35em rgba(0,0,0,0.17),inset 0 0.6em 2em -0.3em rgba(255,255,255,0.15),inset 0 0 0em 0.05em rgba(255,255,255,0.12);
text-align:center;
position:relative;
}
.button:active{
  box-shadow:inset 0 0.6em 2em -0.3em rgba(0,0,0,0.55),inset 0 0 0em 0.05em rgba(255,255,255,0.12);
}
@media all and (max-width:30em){
  .button{
    display:block;
    margin:0.4em auto;
  }
}
</style>
