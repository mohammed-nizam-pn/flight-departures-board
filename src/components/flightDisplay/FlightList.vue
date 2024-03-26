<script>
import "../../design/flightDisplay/FlightList.scss"
import { timeMixin } from "../../mixins/timeMixin"

export default {
  props: {
    allFlights: {
      type: Array,
      required: true,
    },
  },
  data: function () {
    return {
      shouldAnimateUpdate: true,
    }
  },
  methods: {
    handleFlightClick(flight, index) {
      flight.id = index
      this.$emit("flight-click", flight)
    },
    getStatusIcon(flight) {
      let iconClass = ""
      let backgroundColorClass = ""

      if (flight.status.includes("Departed")) {
        iconClass = "fa-solid fa-plane-circle-check"
        backgroundColorClass = "green-background"
      } else if (flight.status.includes("Diverted")) {
        iconClass = "fa-solid fa-plane-circle-exclamation"
        backgroundColorClass = "yellow-background"
      } else if (flight.status.includes("Delayed")) {
        iconClass = "fa-solid fa-clock-rotate-left"
        backgroundColorClass = "orange-background"
      } else if (flight.status.includes("Cancelled")) {
        iconClass = "fa-solid fa-plane-circle-xmark"
        backgroundColorClass = "red-background"
      }

      return { iconClass, backgroundColorClass }
    },
  },
  mixins: [timeMixin],
  mounted() {
    setTimeout(() => {
      this.shouldAnimateUpdate = false
    }, 700)
  },
}
</script>

<template>
  <div class="flight-list">
    <table>
      <thead>
        <tr>
          <th>Departure</th>
          <th>City Name</th>
          <th>Code</th>
          <th>Airline</th>
          <th>Gate</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(flight, index) in allFlights"
          :key="index"
          @click="handleFlightClick(flight, index)"
          :class="'flight-' + index + (shouldAnimateUpdate ? ' animate' : '')"
        >
          <td :class="'time' + (shouldAnimateUpdate ? ' animate' : '')">
            {{ formatTime(flight.estimatedDepartureDateTime) }}
          </td>
          <td
            :class="
              'destination-airport' + (shouldAnimateUpdate ? ' animate' : '')
            "
          >
            <span :class="flight?.divertedCity ? 'strike' : ''">{{
              flight.arrivalAirport?.cityName
            }}</span
            ><br /><span v-if="flight?.divertedCity !== ''">{{
              flight?.divertedCity
            }}</span>
          </td>
          <td
            :class="
              'destination-airport-code' +
              (shouldAnimateUpdate ? ' animate' : '')
            "
          >
            <span :class="flight?.divertedCity ? ' strike' : ''">{{
              flight.arrivalAirport?.code
            }}</span>
          </td>
          <td :class="'airline' + (shouldAnimateUpdate ? ' animate' : '')">
            {{ flight.airline?.name }}
          </td>
          <td :class="'gate' + (shouldAnimateUpdate ? ' animate' : '')">
            {{ flight.departureGate?.number }}
          </td>
          <td :class="'status' + (shouldAnimateUpdate ? ' animate' : '')">
            <p :class="getStatusIcon(flight).backgroundColorClass">
              <span>
                <font-awesome-icon
                  :icon="getStatusIcon(flight).iconClass"
                  v-if="getStatusIcon(flight).iconClass"
                  class="status-icon"
                />{{ flight.status }}
              </span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style></style>
