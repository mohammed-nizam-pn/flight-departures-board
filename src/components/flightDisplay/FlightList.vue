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
        <tr v-for="(flight, index) in allFlights" :key="index">
          <td class="time">
            {{ formatTime(flight.estimatedDepartureDateTime) }}
          </td>
          <td class="destination-airport">
            {{ flight.arrivalAirport?.cityName }}
          </td>
          <td>{{ flight.arrivalAirport?.code }}</td>
          <td>{{ flight.airline?.name }}</td>
          <td>{{ flight.departureGate?.number }}</td>
          <td>{{ flight.status }}</td>
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
  },
}
</script>

<style></style>
