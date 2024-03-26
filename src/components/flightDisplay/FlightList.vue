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
      if (flight.actualDepartureDateTime) {
        return new Date(flight.actualDepartureDateTime)
      } else if (flight.estimatedDepartureDateTime) {
        return new Date(flight.estimatedDepartureDateTime)
      } else {
        return new Date(flight.scheduledDepartureDateTime)
      }
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
          return this.sortedAscending ? timeA - timeB : timeB - timeA
        })
      } else {
        if (sortBy === "cityName") {
          this.allFlights.sort((a, b) => {
            const cityA = a.arrivalAirport?.name.toLowerCase()
            const cityB = b.arrivalAirport?.name.toLowerCase()
            if (cityA < cityB) {
              return this.sortedAscending ? -1 : 1
            }
            if (cityA > cityB) {
              return this.sortedAscending ? 1 : -1
            }
            return 0
          })
        } else if (sortBy === "airline") {
          this.allFlights.sort((a, b) => {
            const airlineA = a.airline?.name.toLowerCase()
            const airlineB = b.airline?.name.toLowerCase()
            if (airlineA < airlineB) {
              return this.sortedAscending ? -1 : 1
            }
            if (airlineA > airlineB) {
              return this.sortedAscending ? 1 : -1
            }
            return 0
          })
        } else if (sortBy === "gate") {
          this.allFlights.sort((a, b) => {
            const gateA = a.departureGate?.number
            const gateB = b.departureGate?.number
            return this.sortedAscending ? gateA - gateB : gateB - gateA
          })
        } else if (sortBy === "status") {
          this.allFlights.sort((a, b) => {
            const statusA = a.status.toLowerCase()
            const statusB = b.status.toLowerCase()
            if (statusA < statusB) {
              return this.sortedAscending ? -1 : 1
            }
            if (statusA > statusB) {
              return this.sortedAscending ? 1 : -1
            }
            return 0
          })
        }
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
            Departure Time<span v-if="sortedAccordingTo === 'time'">
              <font-awesome-icon
                :icon="
                  sortedAscending
                    ? 'fa-solid fa-caret-up'
                    : 'fa-solid fa-caret-down'
                "
                class="sort-icon"
              />
            </span>
          </th>
          <th @click="handleSort('cityName')" class="clickable">
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
          </th>
          <th>Code</th>
          <th @click="handleSort('airline')" class="clickable">
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
          </th>
          <th @click="handleSort('gate')" class="clickable">
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
          </th>
          <th @click="handleSort('status')" class="clickable">
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
