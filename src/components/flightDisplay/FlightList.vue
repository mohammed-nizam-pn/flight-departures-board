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

      switch (flight.status) {
        case "Departed":
          iconClass = "fa-solid fa-plane-circle-check"
          backgroundColorClass = "green-background"
          break
        case "Diverted":
          iconClass = "fa-solid fa-plane-circle-exclamation"
          backgroundColorClass = "yellow-background"
          break
        case "Delayed":
          iconClass = "fa-solid fa-clock-rotate-left"
          backgroundColorClass = "orange-background"
          break
        case "Cancelled":
          iconClass = "fa-solid fa-plane-circle-xmark"
          backgroundColorClass = "red-background"
          break
        default:
          break
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
          <th>Departure Time</th>
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
            {{ flight.arrivalAirport?.cityName }}
          </td>
          <td
            :class="
              'destination-airport-code' +
              (shouldAnimateUpdate ? ' animate' : '')
            "
          >
            {{ flight.arrivalAirport?.code }}
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
