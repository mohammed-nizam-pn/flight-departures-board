<script>
import "../../design/flightDisplay/FlightDetails.scss"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"
import FlightList from "@/components/flightDisplay/FlightList.vue"
import FlightUpdateForm from "@/components/updateFlight/FlightUpdateForm.vue"
import { fetchFlightData } from "@/services/FlightDataService"

export default {
  data: function () {
    return {
      flightData: [],
      loading: true,
      errored: false,
      noData: false,
      showForm: false,
      selectedFlight: null,
    }
  },
  components: {
    errorMessage: ErrorMessage,
    dataUnavailable: DataUnavailable,
    loadingAnimation: LoadingAnimation,
    flightList: FlightList,
    flightUpdateForm: FlightUpdateForm,
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
  methods: {
    showUpdateForm(flight) {
      this.selectedFlight = flight
      this.showForm = true
    },
    updateFlight(updatedFlightDetails) {
      const index = updatedFlightDetails.flightId
      if (
        updatedFlightDetails.status !== "" &&
        index >= 0 &&
        index < this.flightData.length
      ) {
        const updatedFlight = {
          ...this.flightData[index],
          status: updatedFlightDetails.status,
        }
        this.flightData.splice(index, 1, updatedFlight)
        this.showForm = false
      }
    },
    cancelUpdate() {
      this.showForm = false
    },
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
        @flight-click="showUpdateForm"
      >
      </flightList>
      <div v-if="showForm" class="update-form">
        <flightUpdateForm
          :selectedFlight="selectedFlight"
          @update-flight="updateFlight"
          @cancel-update="cancelUpdate"
        ></flightUpdateForm>
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
