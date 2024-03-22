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

<script>
import "../../design/flightDisplay/FlightList.scss"

export default {
  props: {
    allFlights: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatTime(dateTime) {
      const date = new Date(dateTime)
      const hours = ("0" + date.getHours()).slice(-2)
      const minutes = ("0" + date.getMinutes()).slice(-2)
      return `${hours}.${minutes}`
    },
    handleFlightClick(flight, index) {
      flight.id = index
      this.$emit("flight-click", flight)
    },
  },
}
</script>

<style></style>
