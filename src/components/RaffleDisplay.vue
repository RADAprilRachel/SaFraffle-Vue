<template>

<div id="raffle-display" class="container">
  <h1> {{ raffle.name }} </h1>
  <h4> Benefitting {{ raffle.benefactor }} </h4>
  <p> {{ raffle.description }} </p>
  <p> Raffle ends on {{ raffle.end_date }} </p>
</div>

</template>

<script>
export default {
  name: 'RaffleDisplay',
  props: {
    raffle: Object,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
    width: 300px;
    margin: 0 auto;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
