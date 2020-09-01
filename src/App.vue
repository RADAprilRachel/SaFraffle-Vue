<template>
  <div id="app">
    <link href="https://fonts.googleapis.com/css2?family=Dosis&display=swap" rel="stylesheet">
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
    <div v-show="errors.hasOwnProperty('cancel') === true">
      <p class="error">Payment not processed!</p>
    </div>
    <div v-show="total_tickets > 0 && state === 'shop'">
      <form method="POST">
        <input class="form-input" name="customer_name"  placeholder="Name" v-model="customer_name">
        <p v-show="errors.hasOwnProperty('customer_name') === true" class="error">{{ errors.customer_name }}</p>
        <input class="form-input" name="customer_email" placeholder="Email" v-model="customer_email" type="email">
        <p v-show="errors.hasOwnProperty('customer_email') === true" class="error">{{ errors.customer_email }}</p>
        <input class="form-input" name="customer_phone" placeholder="Phone" v-model="customer_phone" type="tel">
        <p v-show="errors.hasOwnProperty('customer_phone') === true" class="error">{{ errors.customer_phone }}</p>
        <label for="contact_method" class="select">
        <select class="form-input" name="contact_method" v-model="contact_method">
          <option value="">Preferred Contact Method</option>
          <option value="email">Email</option>
          <option value="text">Text</option>
          <option value="call">Call</option>
        </select>
        </label>
        <p v-show="errors.hasOwnProperty('contact_method') === true" class="error">{{ errors.contact_method }}</p>
      </form>
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
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      contact_method: "",
      state: "shop",
      errors: {},
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
    validate () {
      let result = {success: true, errors: {}}
      if (this.customer_name === "") {
        result.errors.customer_name = "Must enter a name"
        result.success = false
      }
      switch(this.contact_method) {
        case 'email':
          if (!(/\S+@\S+\.\S+/.test(this.customer_email))) {
            result.errors.customer_email = "Must enter a valid email"
            result.success = false
          }
          break
        case 'call':
        case 'text':
          if (this.customer_phone === "") {
            result.errors.customer_phone = "Must enter a phone number"
            result.success = false
          }
          else if (this.customer_phone.length < 7) {
            result.errors.customer_phone = "Phone number must be at least 7 digits"
            result.success = false
          }
          break
        default:
          result.errors.contact_method = "Must select a contact method"
          result.success = false
      }
      return result
    },
    checkout () {
      let validation = this.validate()
      if (validation.success) {
        this.errors = {}
        this.state = "checkout"
      }
      else {
        this.errors = validation.errors
      }
    },
    paymentCompleted (response) {
      this.state = "complete"
      this.clearCancelError()
      console.log(response)
    },
    paymentCancelled () {
      this.$set(this.errors, 'cancel', true)
    },
    clearCancelError () {
      this.$delete(this.errors, 'cancel')
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
  font-family: 'Dosis', sans-serif;
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
.form-input {
    display: block;
    margin: 1em auto;
}

.select {
  box-shadow: 0 15px 30px -10px transparentize(#000, 0.9);
  cursor: pointer;
  outline: none;
}
@media all and (max-width:30em){
  .button{
    display:block;
    margin:0.4em auto;
  }
}
</style>
