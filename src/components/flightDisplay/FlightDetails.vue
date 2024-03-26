<script>
import "../../design/flightDisplay/FlightDetails.scss"
import ErrorMessage from "@/components/flightDisplay/ErrorMessage.vue"
import DataUnavailable from "@/components/flightDisplay/DataUnavailable.vue"
import LoadingAnimation from "@/components/flightDisplay/LoadingAnimation.vue"
import FlightList from "@/components/flightDisplay/FlightList.vue"
import FlightUpdateForm from "@/components/updateFlight/FlightUpdateForm.vue"
import FlightUpdateForm2 from "@/components/updateFlight/FlightUpdateForm2.vue"
import { fetchFlightData } from "@/services/FlightDataService"
import { timeMixin } from "../../mixins/timeMixin"

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
      showOptions: false,
      selectedCountries: [],
      filterApplied: false,
      flightsBeforeFilter: [],
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
      this.flightData.forEach((flight, index) => {
        flight.id = index
        flight.postFilterIndex = index
      })
    } catch (error) {
      this.errored = true
    } finally {
      this.loading = false
    }
  },
  watch: {
    flightData: {
      immediate: true,
      handler() {
        this.flightData.forEach((flight, index) => {
          flight.postFilterIndex = index
        })
      },
    },
  },
  mixins: [timeMixin],
  methods: {
    showUpdateForm(flight) {
      this.selectedFlight = flight
      this.showForm = true
    },
    updateFlight(updatedFlightDetails) {
      const index = updatedFlightDetails.flightId
      const currentFlightData = this.flightsBeforeFilter.length
        ? this.flightsBeforeFilter
        : this.flightData
      if (updatedFlightDetails.status !== "" && index >= 0) {
        const isStatusChanged =
          updatedFlightDetails.status !== currentFlightData[index].status
        const isDiverted = updatedFlightDetails.status === "Diverted"
        const isDivertedCityChanged =
          updatedFlightDetails.divertedCity !==
            currentFlightData[index]?.divertedCity &&
          updatedFlightDetails.divertedCity !== ""

        if (isStatusChanged || (isDiverted && isDivertedCityChanged)) {
          const updatedFlight = {
            ...currentFlightData[index],
            status: updatedFlightDetails.status,
            divertedCity: isDiverted ? updatedFlightDetails.divertedCity : "",
          }
          this.showForm = false
          const filteredIndex = updatedFlightDetails.filteredIndex
          const selectedFlightElement =
            filteredIndex === 0
              ? this.$el.querySelector("table > thead")
              : this.$el.querySelector(
                  `.flight-${
                    filteredIndex > 0 ? filteredIndex - 1 : filteredIndex
                  }`
                )
          if (selectedFlightElement)
            selectedFlightElement.scrollIntoView({ behavior: "smooth" })

          setTimeout(() => {
            if (this.flightsBeforeFilter.length) {
              this.flightsBeforeFilter.splice(index, 1, updatedFlight)
              this.flightData.splice(filteredIndex, 1, updatedFlight)
            } else {
              this.flightData.splice(index, 1, updatedFlight)
            }
            const tdElements = document.querySelectorAll(
              `.flight-list table tbody tr.flight-${filteredIndex} td`
            )
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
    toggleFilter() {
      this.showOptions = !this.showOptions
      this.selectedCountries = []
    },
    applyFilter() {
      if (this.selectedCountries.length > 0) {
        this.flightsBeforeFilter = this.flightData
        this.flightData = this.flightData.filter((flight) =>
          this.selectedCountries.includes(flight.arrivalAirport.countryName)
        )
        this.filterApplied = true
      }
      this.showOptions = false
    },
    removeFilter() {
      this.flightData = this.flightsBeforeFilter
      this.selectedCountries = []
      this.flightsBeforeFilter = []
      this.filterApplied = false
    },
  },
  computed: {
    uniqueCountries() {
      return [
        ...new Set(
          this.flightData
            .map((flight) => flight.arrivalAirport.countryName)
            .sort((a, b) => a.localeCompare(b))
        ),
      ]
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
      <div class="filter-container" v-if="!loading && !errored && !noData">
        <div class="filter-button-container">
          <div
            class="selected-countries-container"
            v-if="selectedCountries.length && filterApplied"
          >
            <span
              class="selected-country"
              v-for="country in selectedCountries"
              :key="country"
              >{{ country }}</span
            >
          </div>
          <div class="buttons">
            <button
              @click="toggleFilter"
              type="button"
              class="filter-button"
              v-if="!showOptions && !filterApplied"
            >
              <span class="filter-open"
                ><font-awesome-icon icon="fa-solid fa-filter" /> Filter By
                Country
              </span>
            </button>
            <button
              @click="toggleFilter"
              type="button"
              class="close-button"
              v-if="showOptions"
            >
              <span class="filter-close"
                >Close <font-awesome-icon icon="fa-solid fa-x"
              /></span>
            </button>
            <button
              @click="removeFilter"
              type="button"
              v-if="filterApplied"
              class="filter-reset"
            >
              <span class="filter-reset-text"
                >Clear Filter
                <font-awesome-icon icon="fa-solid fa-filter-circle-xmark"
              /></span>
            </button>
          </div>
        </div>
        <div class="filter-options-container" v-if="showOptions">
          <div v-if="showOptions" class="filter-options">
            <div v-for="country in uniqueCountries" :key="country">
              <input
                type="checkbox"
                class="custom-checkbox"
                :id="'countryCheckbox_' + country"
                :value="country"
                v-model="selectedCountries"
              />
              <label :for="'countryCheckbox_' + country">{{ country }}</label>
            </div>
          </div>
          <div class="apply-button-container">
            <button
              @click="applyFilter"
              v-if="selectedCountries.length"
              type="button"
              class="apply-button"
            >
              Apply Filter
            </button>
          </div>
        </div>
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
      v-if="showScrollButtonDown && flightData.length"
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
