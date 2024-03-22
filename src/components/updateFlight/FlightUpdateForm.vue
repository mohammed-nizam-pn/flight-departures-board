<template>
  <div class="flight-update-form">
    <h1>Update Flight Status</h1>
    <form @submit.prevent="handleSubmit">
      <div class="flight-data-container">
        <div class="time flight-data">
          <p>Departure Time:</p>
          <p class="highlight">
            {{ formatTime(selectedFlight.estimatedDepartureDateTime) }}
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
        <div class="destination-code flight-data">
          <p>Code:</p>
          <p class="highlight">
            {{ selectedFlight.arrivalAirport.code }}
          </p>
        </div>
        <div class="airline flight-data">
          <p>Airline:</p>
          <p class="highlight">
            {{ selectedFlight.airline.name }}
          </p>
        </div>
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
        <textarea
          v-if="selectedStatus === 'Custom Status'"
          v-model="customStatus"
        ></textarea>
      </div>
      <div class="button-container">
        <button type="submit">Update</button>
        <button type="button" @click="handleCancel">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
import "../../design/updateFlight/FlightUpdateForm.scss"

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
      }
      this.$emit("update-flight", updatedFlightData)
    },
    handleCancel() {
      this.$emit("cancel-update")
    },
    formatTime(dateTime) {
      const date = new Date(dateTime)
      const hours = ("0" + date.getHours()).slice(-2)
      const minutes = ("0" + date.getMinutes()).slice(-2)
      return `${hours}.${minutes}`
    },
  },
}
</script>

<style scoped></style>
