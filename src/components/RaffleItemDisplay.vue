<template>

<div id="raffle-item-display" class="container">
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Dosis&display=swap" rel="stylesheet">
  <div v-show="state === 'shop'" class="center-container" v-for="raffle_item in raffle_items" :key="raffle_item.id">
    <div :class="{ 'card-sm':isSmall(), 'card-lg':!isSmall() }">
      <h3 class="subtitle"> {{ raffle_item.name }} </h3>
      <p> {{ raffle_item.description }} </p>
      <p> Estimated ${{ raffle_item.value }} value</p>
      <img v-if="raffle_item.image" :src="'http://safraffle.com'+raffle_item.image">
      <h5> Donated by {{ raffle_item.donor }} </h5>
    </div>
    <div :class="{ 'counter-container-lg':!isSmall() }">
      <button class="button minus" @click="$emit('decrement', raffle_item.id)">-</button>
      <div class="count">{{ raffle_item.ticket_count }} </div>
      <button class="button plus" @click="$emit('increment', raffle_item.id)">+</button>
      <div>Tickets</div>
    </div>
  </div>
  <div v-show="state === 'shop'" class="center-container">
    <div :class="{ 'summary-card-sm':isSmall(), 'summary-card-lg':!isSmall() }">
      <p class="totals-label">Total Tickets:</p>
    </div>
    <div :class="{ 'counter-container-sm':isSmall(), 'counter-container-lg':!isSmall() }">
      <p class="totals">{{ total_tickets }}</p>
    </div>
  </div>
  <div v-show="state === 'shop'" class="center-container">
    <div :class="{ 'summary-card-sm':isSmall(), 'summary-card-lg':!isSmall() }">
      <p class="totals-label">Total Donation:</p>
    </div>
    <div :class="{ 'counter-container-sm':isSmall(), 'counter-container-lg':!isSmall() }">
      <p class="totals">${{ total_donation }}</p>
    </div>
  </div>
  <div v-show="state === 'checkout'" class="center-container">
    <div :class="{ 'table-card-sm':isSmall(), 'table-card-lg':!isSmall() }">
      <table>
        <thead><tr><th>Item</th><th>Tickets</th><th>Donation</th></tr></thead>
        <tbody>
          <tr v-for="raffle_item in raffle_items" :key="raffle_item.id">
            <td>{{ raffle_item.name }}</td>
            <td>{{ raffle_item.ticket_count }}</td>
            <td>${{ parseFloat(ticket_cost*raffle_item.ticket_count).toFixed(2) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr><th>Total</th><th>{{ total_tickets }}</th><th>${{ total_donation }}</th></tr>
        </tfoot>
      </table>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'RaffleItemDisplay',
  data() {
    return {
      window_width: window.innerWidth
    }
  },
  methods: {
    isSmall() {
      return this.window_width < 600
    }
  },
  props: {
    raffle_items: Array,
    total_tickets: Number,
    total_donation: String,
    ticket_cost: String,
    state: String,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    font-family: 'Dosis', sans-serif;
/*  background-color: #fff2ee;*/
}
.subtitle {
    font-family: 'Josefin Slab', serif;
    font-size: 1.5rem
}
img {
    width: 75%;
    border-radius: 20px;
}
table {
    border-collapse: collapse;
    border: 1px solid;
    margin: 1em auto auto;
}
col {
    border: 1px solid;
}
tbody tr:nth-child(odd) {
  background: #ddd;
}
tfoot tr {
  background: #616c75;
  color: #dbc12e;
  padding: 8px 4px;
  border: 1px solid;
}
th {
  border: 1px solid;
  padding: 6px;
}
td {
  border-left: 1px solid;
  padding: 8px 4px;
}
.table-card-sm {
  width: 50%;
  margin: 0 auto;
  display: inline-block;
}
.table-card-lg {
  width: 20%;
  margin: 0 auto;
  display: inline-block;
}
.totals-label {
  font-weight: bold;
  border: solid;
  padding: 0.5em;
}
.totals {
  font-weight: bold;
  border: solid;
  padding: 0.5em;
  min-width: 60px;
}
.count {
  width: 35px;
  height: 30px;
  display: inline-block;
  margin: 0.5em 10px;
  font-size: 1.15em;
  text-align: center;
}
p {
  text-align: center;
}
.center-container {
  position: relative;
}
.card-sm {
  color: white;
  width: 80%;
  margin: 2.0em auto 1em;
  display: inline-block;
  background: #5e514d;
}
.card-lg {
  color: white;
  width: 25%;
  margin: 1em auto;
  display: inline-block;
  border-radius: 7px;
  background: #5e514d;
}
.summary-card-sm {
  width: 50%;
  margin: 0 auto;
  display: inline-block;
}
.summary-card-lg {
  width: 10%;
  margin: 0 auto;
  display: inline-block;
}
.counter-container-sm {
  display: inline-block;
}
.counter-container-lg {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  margin-left: 2em;
}
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
.button{
  border: none;
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
.plus {
  background-color:#d86018;
}
.minus {
  background-color: #5e514d;
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
