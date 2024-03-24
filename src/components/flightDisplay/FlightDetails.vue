<script>
import "../../design/flightDisplay/FlightDetails.scss"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"
import FlightList from "@/components/flightDisplay/FlightList.vue"
import FlightUpdateForm from "@/components/updateFlight/FlightUpdateForm.vue"
import FlightUpdateForm2 from "@/components/updateFlight/FlightUpdateForm2.vue"
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
      showScrollButtonUp: false,
      showScrollButtonDown: true,
    }
  },
  components: {
    errorMessage: ErrorMessage,
    dataUnavailable: DataUnavailable,
    loadingAnimation: LoadingAnimation,
    flightList: FlightList,
    flightUpdateForm: FlightUpdateForm,
    flightUpdateForm2: FlightUpdateForm2,
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
        index < this.flightData.length &&
        updatedFlightDetails.status !== this.flightData[index].status
      ) {
        const updatedFlight = {
          ...this.flightData[index],
          status: updatedFlightDetails.status,
        }
        this.flightData.splice(index, 1, updatedFlight)
        this.showForm = false
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
        setTimeout(() => {
          const tdElements = document.querySelectorAll(".flight-list tbody td")
          tdElements.forEach((td) => {
            td.classList.add("animate")
          })

          setTimeout(() => {
            tdElements.forEach((td) => {
              td.classList.remove("animate")
            })
          }, 700)
        }, 500)
      } else {
        alert("Status not changed. Please provide a new value to update.")
      }
    },
    cancelUpdate(flight) {
      const previoulySelectedElement = this.$el.querySelector(
        `.flight-${flight.flightId}`
      )
      if (previoulySelectedElement) {
        previoulySelectedElement.scrollIntoView({ behavior: "smooth" })
      }
      this.showForm = false
    },
    handleScroll() {
      const scrollPosition = window.scrollY
      const halfViewportHeight = window.innerHeight / 2
      this.showScrollButtonUp = scrollPosition > halfViewportHeight
      this.showScrollButtonDown =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
          ? false
          : true
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    },
    scrollToBottom() {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      })
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll)
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll)
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
      <div v-if="!showForm && !noData && !errored" class="update-form2">
        <flightUpdateForm2
          :allFlights="flightData"
          @update-flight="updateFlight"
        ></flightUpdateForm2>
      </div>
    </div>
    <div
      v-if="showScrollButtonUp"
      class="scroll-top-button"
      @click="scrollToTop"
    >
      <font-awesome-icon icon="fa-solid fa-arrow-up" class="scroll-top-icon" />
    </div>
    <div
      v-if="showScrollButtonDown"
      class="scroll-down-button"
      @click="scrollToBottom"
    >
      <font-awesome-icon
        icon="fa-solid fa-arrow-down"
        class="scroll-down-icon"
      />
    </div>
  </div>
</template>

<style lang="scss"></style>
