<template>

<div id="raffle-item-display" class="container">
  <div class="center-container" v-for="raffle_item in raffle_items" :key="raffle_item.id">
    <div :class="{ 'card-sm':isSmall(), 'card-lg':!isSmall() }">
      <h3> {{ raffle_item.name }} </h3>
      <p> {{ raffle_item.description }} </p>
      <p> Estimated ${{ raffle_item.value }} value</p>
      <img :src="'http://radet5.com'+raffle_item.image">
      <h5> Donated by {{ raffle_item.donor }} </h5>
    </div>
    <div :class="{ 'counter-container-lg':!isSmall() }">
      <button @click="$emit('decrement', raffle_item.id)">-</button>
      <div class="count">{{ raffle_item.ticket_count }} </div>
      <button @click="$emit('increment', raffle_item.id)">+</button>
      <div>Tickets</div>
    </div>
  </div>
  <div class="center-container">
    <div :class="{ 'summary-card-sm':isSmall(), 'summary-card-lg':!isSmall() }">
      <p class="totals-label">Total Tickets:</p>
    </div>
    <div :class="{ 'counter-container-sm':isSmall(), 'counter-container-lg':!isSmall() }">
      <p class="totals">{{ total_tickets }}</p>
    </div>
  </div>
  <div class="center-container">
    <div :class="{ 'summary-card-sm':isSmall(), 'summary-card-lg':!isSmall() }">
      <p class="totals-label">Total Cost:</p>
    </div>
    <div :class="{ 'counter-container-sm':isSmall(), 'counter-container-lg':!isSmall() }">
      <p class="totals">${{ total_cost }}</p>
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
      return this.window_width < 500
    }
  },
  props: {
    raffle_items: Array,
    ticket_cost: Number,
  },
  computed: {
    total_tickets () {
      return this.raffle_items.reduce( (acc, item) => acc + Number(item.ticket_count), 0)
    },
    total_cost () {
      return parseFloat(this.total_tickets * this.ticket_cost).toFixed(2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
    width: 75%;
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
  width: 80%;
  margin: 0 auto;
  display: inline-block;
}
.card-lg {
  width: 20%;
  margin: 0 auto;
  display: inline-block;
}
.summary-card-sm {
  width: 50%;
  margin: 0 auto;
  display: inline-block;
}
.summary-card-lg {
  width: 15%;
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
</style>
