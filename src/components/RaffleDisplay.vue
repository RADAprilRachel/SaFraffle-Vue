<template>

<div id="raffle-display" class="container">
  <link href="https://fonts.googleapis.com/css2?family=Berkshire+Swash&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab:wght@700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Dosis&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=500">
  <div id="header">
    <img v-if="raffle.image" :src="'https://safraffle.com'+raffle.image">
  </div>
  <div class="column">
    <h1 class="title"> {{ raffle.name }} </h1>
    <h4 class="subtitle"> Benefitting {{ raffle.benefactor }} </h4>
    <div class=card v-show="state === 'shop'">
      <p> {{ raffle.description }} </p>
      <p> Raffle ends on {{ raffle.end_date }} </p>
      <p> Tickets cost ${{ ticket_cost }} each OR get 5 for ${{ ticket_cost*4 }}!</p>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'RaffleDisplay',
  props: {
    raffle: Object,
    state: String,
    ticket_cost: String,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title {
  font-family: 'Berkshire Swash', cursive;
  font-size: 2rem;
  color: #d86018;
}
.subtitle {
  font-family: 'Josefin Slab', serif;
  font-size: 1.25rem;
}
.container {
  font-family: 'Dosis', sans-serif;
/*background-color: #fff2ee;*/
}
#header {
  width: 100%;
  text-align: center;
}
.column {
    width: 500px;
    margin: 0.75em auto auto;
    border: dashed;
    border-radius: 10px;
    border-color: #d86018;
}
.card {
    width: auto;
    margin: auto 1.5em auto;
}
img {
  border-radius: 10px;
  margin-top: 0px;
  width: 800px;
}
@media (max-width: 500px) {
  img {
    padding-left: 50%;
    margin-left: -250px;
    width: 500px;
  }
.column {
  width: 400px;
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
