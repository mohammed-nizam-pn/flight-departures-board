<script>
import "../../design/flightDisplay/FlightDetails.scss"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"
import { fetchFlightData } from "@/services/FlightDataService"

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
  async created() {
    try {
      this.flightData = await fetchFlightData()
      this.noData = this.flightData.length === 0
    } catch (error) {
      this.errored = true
    } finally {
      this.loading = false
    }
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
