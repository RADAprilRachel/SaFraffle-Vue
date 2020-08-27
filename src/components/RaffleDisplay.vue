<template>

<div id="raffle-display" class="container">
  <meta name="viewport" content="width=500">
  <div id="header">
    <img :src="'http://safraffle.com'+raffle.image">
  </div>
  <div class="column">
    <h1> {{ raffle.name }} </h1>
    <h4> Benefitting {{ raffle.benefactor }} </h4>
    <p> {{ raffle.description }} </p>
    <p> Raffle ends on {{ raffle.end_date }} </p>
  </div>
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
}
#header {
  width: 100%;
  text-align: center;
}
.column {
    width: 400px;
    margin: auto;
}
img {
  width: 500px;
}
@media (max-width: 500px) {
  img {
    padding-left: 50%;
    margin-left: -250px;
  }
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
