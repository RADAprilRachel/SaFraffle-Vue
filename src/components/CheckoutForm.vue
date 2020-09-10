<template>
  <div id="checkout-form" class="container">
    <link href="https://fonts.googleapis.com/css2?family=Dosis&display=swap" rel="stylesheet">
    <div v-show="total_donation > 0 && state === 'shop'">
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
    <div v-show="errors.hasOwnProperty('cancel') === true">
      <p class="error">Payment not processed!</p>
    </div>
    <div class=paypal v-show="state === 'checkout'">
      <div ref="paypal"></div>
    </div>
    <div v-show="state === 'complete'">
      <p class="success">Payment Completed!</p>
      <p>Thank you for your donation</p>
      <p>We will contact you if you win. Good luck!</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CheckoutForm',
  data () {
    return {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      contact_method: "",
      purchase_id: null,
      errors: {},
      credentials: {
        sandbox: 'AdsXXE61inTIs-q731ToP4wjGgKodV8ZYxu53_NU184iGwql8WD8QdKv9eKZQHsNcbYhvLWBUWvJPNQs',
        production: 'AdGw2AY8etwlYRaa9aDM20UTUVMBADMedk9O1My0SEFGcxJEj54oitfWHuh6eo848ip9cm-wqX6EpOFG'
      },
    }
  },
  props: {
    state: String,
    total_donation: String,
    total_cost: String,
    total_discount: String,
    itemized_tickets: Array,
    raffle_id: Number,
    custom_id: String,
  },
  mounted: function() {
    const script = document.createElement("script");
    script.src ="https://www.paypal.com/sdk/js?client-id="+this.credentials.production;
    script.addEventListener("load", this.setLoaded);
    document.body.appendChild(script);
  },
  methods: {
    setLoaded: function() {
      this.loaded = true;
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "Raffle tickets for Safai fundraiser",
                  custom_id: this.custom_id,
                  amount: {
                    currency_code: "USD",
                    value: this.total_donation,
                    breakdown: {
                      item_total: {
                        currency_code: "USD",
                        value: this.total_cost,
                      },
                      discount: {
                        currency_code: "USD",
                        value: this.total_discount,
                      }
                    }
                  },
                  items: this.itemized_tickets
                }
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING"
              }
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log(order)
            console.log(order.status)
            this.paymentCompleted(order)
          },
          onError: err => {
            console.log(err);
            this.paymentCancelled()
          },
          onCancel: () => {
            this.paymentCancelled()
          }
        })
        .render(this.$refs.paypal);
    },
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
        let data = {
            customer_name: this.customer_name,
            customer_email: this.customer_email,
            customer_phone: this.customer_phone,
            contact_method: this.contact_method}
        this.addPurchase(data, this.itemized_tickets, this.raffle_id, this.custom_id)
      }
      else {
        this.errors = validation.errors
      }
    },
    async addPurchase(contact_data, itemized_tickets, raffle_id, custom_id) {
      try {
        const response = await fetch('https://safraffle.com/api/purchases', {
          method: 'POST',
          body: JSON.stringify({contact_data: contact_data, itemized_tickets: itemized_tickets, raffle_id:raffle_id, custom_id: custom_id}),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        const data = await response.json()
        console.log(data)
        let errors = {}
        if (data.success) {
          this.purchase_id = data.purchase_id
          this.$emit('checkout', data)
          if (window.page === "pos") {
            console.log("POS")
            this.paymentCompleted({id: "POS"})
          }
        }
        else {
          if (data.errors.hasOwnProperty('contact_data.customer_name') === true) {
            errors.customer_name = data.errors['contact_data.customer_name'][0]
          }
          if (data.errors.hasOwnProperty('contact_data.customer_phone') === true) {
            errors.customer_phone = data.errors['contact_data.customer_phone'][0]
          }
          if (data.errors.hasOwnProperty('contact_data.customer_email') === true) {
            errors.customer_email = data.errors['contact_data.customer_email'][0]
          }
          if (data.errors.hasOwnProperty('contact_data.contact_method') === true) {
            errors.contact_method = data.errors['contact_data.contact_method'][0]
          }
        }
        this.errors = errors
      } catch (error) {
        console.error(error)
      }
    },
    paymentCompleted (response) {
      console.log(this.purchase_id)
      this.addPayment(this.purchase_id, response.id, this.custom_id)
      this.$emit('complete', response)
      this.clearCancelError()
    },
    async addPayment(purchase_id, paypal_order_id, custom_id) {
      try {
        const response = await fetch('https://safraffle.com/api/payments', {
          method: 'POST',
          body: JSON.stringify({purchase_id: purchase_id, paypal_order_id: paypal_order_id, custom_id: custom_id}),
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error(error)
      }
    },
    paymentCancelled () {
      this.$set(this.errors, 'cancel', true)
    },
    clearCancelError () {
      this.$delete(this.errors, 'cancel')
    },
  }
}
</script>

<style>
.container {
  font-family: 'Dosis', sans-serif;
  text-align: center;
}
.paypal {
  margin: auto;
  padding: 8px;
  width: 300px;
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
  margin: 4px auto 6px;
  padding: 6px;
  display: inline-block;
  border-radius: 7px;
}
.button{
  border: none;
  background-color:#d86018;
  display:inline-block;
  padding:0.5em 1.0em;
  margin:0.5em auto;
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
  margin: 0.5em auto 0em;
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
