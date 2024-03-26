<script>
import "../../design/updateFlight/FlightUpdateForm.scss"
import { timeMixin } from "../../mixins/timeMixin"

export default {
  props: {
    selectedFlight: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedStatus: "",
      customStatus: "",
      statusIsDiverted: false,
      divertedToCity: "",
    }
  },
  methods: {
    handleSubmit() {
      const updatedFlightData = {
        flightId: this.selectedFlight.id,
        status:
          this.selectedStatus === "Custom Status"
            ? this.customStatus
            : this.selectedStatus,
        divertedCity: this.divertedToCity,
      }
      this.$emit("update-flight", updatedFlightData)
    },
    handleCancel() {
      this.$emit("cancel-update", { flightId: this.selectedFlight.id })
    },
    scrollToUpdateFlightStatus() {
      const updateFlightStatusElement = this.$el.querySelector(
        ".flight-update-form h1"
      )
      if (updateFlightStatusElement) {
        updateFlightStatusElement.scrollIntoView({ behavior: "smooth" })
      }
    },
  },
  mixins: [timeMixin],
  mounted() {
    this.scrollToUpdateFlightStatus()
  },
  watch: {
    selectedFlight: {
      handler() {
        this.selectedStatus = ""
      },
    },
    selectedStatus: {
      immediate: true,
      handler(newStatus) {
        this.statusIsDiverted = newStatus === "Diverted"
      },
    },
  },
}
</script>

<template>
  <div class="flight-update-form">
    <h1>Update Flight Status</h1>
    <form @submit.prevent="handleSubmit">
      <div class="flight-data-container">
        <div class="left-content">
          <div class="time flight-data">
            <p>Departure Time:</p>
            <p class="highlight">
              {{
                formatTime([
                  selectedFlight.actualDepartureDateTime,
                  selectedFlight.estimatedDepartureDateTime,
                  selectedFlight.scheduledDepartureDateTime,
                ])
              }}
            </p>
          </div>
          <div class="destination flight-data">
            <p>Destination City:</p>
            <p class="highlight">
              {{ selectedFlight.arrivalAirport.cityName }}
            </p>
          </div>
          <div class="destination-country flight-data">
            <p>Destination Country:</p>
            <p class="highlight">
              {{ selectedFlight.arrivalAirport.countryName }}
            </p>
          </div>
        </div>
        <div class="right-content">
          <div class="destination-code flight-data right">
            <p>Code:</p>
            <p class="highlight">
              {{ selectedFlight.arrivalAirport.code }}
            </p>
          </div>
          <div class="airline flight-data right">
            <p>Airline:</p>
            <p class="highlight">
              {{ selectedFlight.airline.name }}
            </p>
          </div>
          <div class="status-select-container">
            <div class="status-select">
              <p>Status:</p>
              <select v-model="selectedStatus">
                <option disabled value="">
                  {{ selectedFlight.status }}
                </option>
                <option>Departed</option>
                <option>Diverted</option>
                <option>Delayed</option>
                <option>Cancelled</option>
                <option>Custom Status</option>
              </select>
            </div>
            <textarea
              v-if="selectedStatus === 'Custom Status'"
              v-model="customStatus"
              placeholder="Enter Custom Status Text"
            ></textarea>
            <input
              type="text"
              class="diverted-to"
              placeholder="Please enter city of diversion"
              v-if="statusIsDiverted"
              v-model="divertedToCity"
            />
          </div>
        </div>
      </div>
      <div class="button-container">
        <button type="submit">Update</button>
        <button type="button" @click="handleCancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
