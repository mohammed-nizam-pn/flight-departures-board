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
      sortedAccordingTo: "time",
      sortedAscending: true,
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
    getDepartureTime(flight) {
      return new Date(
        flight.actualDepartureDateTime ||
          flight.estimatedDepartureDateTime ||
          flight.scheduledDepartureDateTime
      )
    },
    compareValues(valueA, valueB, ascending = true) {
      if (valueA < valueB) {
        return ascending ? -1 : 1
      }
      if (valueA > valueB) {
        return ascending ? 1 : -1
      }
      return 0
    },
    handleSort(sortBy) {
      this.sortedAscending =
        this.sortedAccordingTo === sortBy ? !this.sortedAscending : true
      this.sortedAccordingTo =
        this.sortedAccordingTo === sortBy ? this.sortedAccordingTo : sortBy

      if (sortBy === "time") {
        this.allFlights.sort((a, b) => {
          const timeA = this.getDepartureTime(a)
          const timeB = this.getDepartureTime(b)
          return this.compareValues(timeA, timeB, this.sortedAscending)
        })
      } else {
        this.allFlights.sort((a, b) => {
          let valueA, valueB
          switch (sortBy) {
            case "cityName":
              valueA = a.arrivalAirport?.name.toLowerCase()
              valueB = b.arrivalAirport?.name.toLowerCase()
              break
            case "airline":
              valueA = a.airline?.name.toLowerCase()
              valueB = b.airline?.name.toLowerCase()
              break
            case "gate":
              valueA = a.departureGate?.number
              valueB = b.departureGate?.number
              break
            case "status":
              valueA = a.status.toLowerCase()
              valueB = b.status.toLowerCase()
              break
            default:
              break
          }
          return this.compareValues(valueA, valueB, this.sortedAscending)
        })
      }
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
          <th @click="handleSort('time')" class="clickable">
            <span class="header-text-container">
              Departure Time<span v-if="sortedAccordingTo === 'time'">
                <font-awesome-icon
                  :icon="
                    sortedAscending
                      ? 'fa-solid fa-caret-up'
                      : 'fa-solid fa-caret-down'
                  "
                  class="sort-icon"
                /> </span
            ></span>
          </th>
          <th @click="handleSort('cityName')" class="clickable">
            <span class="header-text-container">
              City Name<span v-if="sortedAccordingTo === 'cityName'">
                <font-awesome-icon
                  :icon="
                    sortedAscending
                      ? 'fa-solid fa-caret-up'
                      : 'fa-solid fa-caret-down'
                  "
                  class="sort-icon"
                />
              </span>
            </span>
          </th>
          <th>Code</th>
          <th @click="handleSort('airline')" class="clickable">
            <span class="header-text-container">
              Airline<span v-if="sortedAccordingTo === 'airline'">
                <font-awesome-icon
                  :icon="
                    sortedAscending
                      ? 'fa-solid fa-caret-up'
                      : 'fa-solid fa-caret-down'
                  "
                  class="sort-icon"
                />
              </span>
            </span>
          </th>
          <th @click="handleSort('gate')" class="clickable">
            <span class="header-text-container">
              Gate<span v-if="sortedAccordingTo === 'gate'">
                <font-awesome-icon
                  :icon="
                    sortedAscending
                      ? 'fa-solid fa-caret-up'
                      : 'fa-solid fa-caret-down'
                  "
                  class="sort-icon"
                />
              </span>
            </span>
          </th>
          <th @click="handleSort('status')" class="clickable">
            <span class="header-text-container">
              Status<span v-if="sortedAccordingTo === 'status'">
                <font-awesome-icon
                  :icon="
                    sortedAscending
                      ? 'fa-solid fa-caret-up'
                      : 'fa-solid fa-caret-down'
                  "
                  class="sort-icon"
                />
              </span>
            </span>
          </th>
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
            {{
              formatTime([
                flight.actualDepartureDateTime,
                flight.estimatedDepartureDateTime,
                flight.scheduledDepartureDateTime,
              ])
            }}
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
