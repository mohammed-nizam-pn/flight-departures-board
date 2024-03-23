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
  methods: {
    handleFlightClick(flight, index) {
      flight.id = index
      this.$emit("flight-click", flight)
    },
  },
  mixins: [timeMixin],
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
          :class="'flight-' + index"
        >
          <td class="time">
            {{ formatTime(flight.estimatedDepartureDateTime) }}
          </td>
          <td class="destination-airport">
            {{ flight.arrivalAirport?.cityName }}
          </td>
          <td class="destination-airport-code">
            {{ flight.arrivalAirport?.code }}
          </td>
          <td class="airline">{{ flight.airline?.name }}</td>
          <td class="gate">{{ flight.departureGate?.number }}</td>
          <td class="status">
            <p>
              <span>{{ flight.status }}</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style></style>
