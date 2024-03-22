<script>
import "./design/App.scss"
import Header from "@/components/Header.vue"
import FlightDetails from "@/components/FlightDetails.vue"

export default {
  data: function () {
    return {}
  },
  components: {
    appHeader: Header,
    flightDetails: FlightDetails,
  },
}
</script>

<template>
  <div id="main-container">
    <appHeader></appHeader>
    <flightDetails></flightDetails>
  </div>
</template>

<style lang="scss"></style>
