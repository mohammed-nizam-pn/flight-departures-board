<script>
import "../../design/flightDisplay/FlightDetails.scss"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"
import FlightList from "@/components/flightDisplay/FlightList.vue"
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
    flightList: FlightList,
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
    <div class="info-panel">
      <div v-if="loading">
        <loadingAnimation></loadingAnimation>
      </div>
      <div v-if="errored"><errorMessage></errorMessage></div>
      <div v-if="noData && !loading && !errored">
        <dataUnavailable></dataUnavailable>
      </div>
      <flightList
        v-if="!loading && !errored && !noData"
        :allFlights="flightData"
      >
      </flightList>
    </div>
  </div>
</template>

<style lang="scss"></style>
