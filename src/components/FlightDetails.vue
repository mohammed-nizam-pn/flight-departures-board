<script>
import axios from "axios"
import "../design/FlightDetails.scss"
import ErrorMessage from "@/components/ErrorMessage.vue"
import DataUnavailable from "@/components/DataUnavailable.vue"
import LoadingAnimation from "@/components/LoadingAnimation.vue"

export default {
  data: function () {
    return {
      flightData: [],
      loading: true,
      errored: false,
      noData: false,
    }
  },
  components: {
    errorMessage: ErrorMessage,
    dataUnavailable: DataUnavailable,
    loadingAnimation: LoadingAnimation,
  },
  created() {
    axios
      .get("https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata")
      .then((response) => {
        this.flightData =
          response.data?.allDepartures.sort((a, b) => {
            return (
              new Date(a.estimatedDepartureDateTime) -
              new Date(b.estimatedDepartureDateTime)
            )
          }) || []
        if (this.flightData.length === 0) {
          this.noData = true
        }
      })
      .catch((error) => {
        console.log(error, "Error Encountered")
        this.errored = true
      })
      .finally(() => {
        this.loading = false
      })
  },
}
</script>

<template>
  <div class="flights-container">
    <div class="infoPanel">
      <div class="dataLoading" v-if="loading">
        <loadingAnimation></loadingAnimation>
      </div>
      <div class="dataError" v-if="errored"><errorMessage></errorMessage></div>
      <div v-if="noData && !loading" class="noDataAvailable">
        <dataUnavailable></dataUnavailable>
      </div>
      <div v-for="flight in flightData" class="flightItem" v-if="!loading">
        <p>
          {{ flight.estimatedDepartureDateTime }}<span></span>
          {{ flight.arrivalAirport?.cityName }}
          {{ flight.arrivalAirport?.code }}
          {{ flight.departureGate?.number }}
          {{ flight.status }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.flightItem {
  color: white;
  span {
    margin-right: 10px;
  }
}
</style>
