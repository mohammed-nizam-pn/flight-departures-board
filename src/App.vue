<script>
import "./design/App.scss"
import Header from "@/components/Header.vue"
import FlightDetails from "@/components/flightDisplay/FlightDetails.vue"

export default {
  name: App,
  data: function () {
    return {
      name: "App",
    }
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
