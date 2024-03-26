<script>
import "../../design/updateFlight/FlightUpdateForm2.scss"
import { timeMixin } from "../../mixins/timeMixin"

export default {
  props: {
    allFlights: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedFlight: {},
      selectedDestination: "",
      selectedAirline: "",
      selectedTime: "",
      selectedFlightNumber: "",
      selectedStatus: "",
      customStatus: "",
      filteredFlights: [],
      statusIsDiverted: false,
      divertedToCity: "",
    }
  },
  methods: {
    handleSubmit() {
      if (this.selectedFlight?.status) {
        const updatedFlightData = {
          flightId: this.selectedFlight.id,
          status:
            this.selectedStatus === "Custom Status"
              ? this.customStatus
              : this.selectedStatus,
          divertedCity: this.divertedToCity,
          filteredIndex: this.selectedFlight.postFilterIndex,
        }
        if (updatedFlightData.status) {
          if (updatedFlightData.status !== this.selectedFlight?.status) {
            this.resetFormFields()
            this.$emit("update-flight", updatedFlightData)
          } else if (updatedFlightData.status === "Diverted") {
            if (
              updatedFlightData.divertedCity !==
              this.selectedFlight?.divertedCity
            ) {
              this.resetFormFields()
              this.$emit("update-flight", updatedFlightData)
            } else {
              alert("Status not changed. Please provide a new value to update.")
            }
          }
        } else {
          alert("Status not changed. Please provide a new value to update.")
        }
      } else {
        alert("Please select a Flight.")
      }
    },
    handleReset() {
      this.resetFormFields()
    },
    resetFormFields() {
      this.selectedFlight = {}
      this.selectedDestination = ""
      this.selectedAirline = ""
      this.selectedTime = ""
      this.selectedFlightNumber = ""
      this.selectedStatus = ""
      this.customStatus = ""
      ;(this.filteredFlights = [...this.allFlights]), (this.divertedToCity = "")
    },
  },
  mixins: [timeMixin],
  computed: {
    sortedUniqueCityNames() {
      const uniqueCityNames = new Set()
      this.filteredFlights.forEach((flight) => {
        uniqueCityNames.add(flight.arrivalAirport.cityName)
      })
      return Array.from(uniqueCityNames).sort()
    },
    sortedUniqueAirlineNames() {
      const uniqueAirlineNames = new Set()
      const airlines = []
      this.filteredFlights.forEach((flight) => {
        const lowercaseName = flight.airline.name.toLowerCase()
        if (!uniqueAirlineNames.has(lowercaseName)) {
          uniqueAirlineNames.add(lowercaseName)
          airlines.push({
            original: flight.airline.name,
            lowercase: lowercaseName,
          })
        }
      })

      return airlines
        .sort((a, b) => a.lowercase.localeCompare(b.lowercase))
        .map((airline) => airline.original)
    },
  },
  watch: {
    allFlights: {
      immediate: true,
      handler(newFlights) {
        this.filteredFlights = [...newFlights]
        this.selectedDestination = ""
      },
    },
    selectedDestination: {
      immediate: true,
      handler(newDestination) {
        if (newDestination) {
          this.filteredFlights = [...this.allFlights].filter(
            (flight) => flight.arrivalAirport.cityName === newDestination
          )
        }
      },
    },
    selectedAirline: {
      immediate: true,
      handler(newAirline) {
        if (newAirline) {
          this.filteredFlights = this.filteredFlights.filter(
            (flight) => flight.airline.name === newAirline
          )
        }
      },
    },
    selectedTime: {
      immediate: true,
      handler(newTime) {
        if (newTime) {
          this.filteredFlights = this.filteredFlights.filter((flight) => {
            const departureTime = this.getDepartureTime(flight)
            return departureTime === newTime
          })
        }
      },
    },
    filteredFlights: {
      immediate: true,
      handler(newFilteredFlights) {
        if (newFilteredFlights.length === 1) {
          this.selectedFlight = newFilteredFlights[0]
          this.selectedDestination =
            newFilteredFlights[0].arrivalAirport.cityName
        } else {
          this.selectedFlight = {}
        }
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
  <div class="flight-update-form2">
    <h1>Update Flight Status</h1>
    <form @submit.prevent="handleSubmit">
      <div class="flight-data-container">
        <div class="left-content">
          <div class="destination flight-data" v-if="selectedDestination">
            <p>Destination City:</p>
            <p class="highlight">{{ selectedDestination }}</p>
          </div>
          <div
            class="code flight-data"
            v-if="selectedFlight?.arrivalAirport?.code"
          >
            <p>Destination Code:</p>
            <p class="highlight">{{ selectedFlight?.arrivalAirport?.code }}</p>
          </div>
          <div
            class="time flight-data"
            v-if="
              selectedTime &&
              !(
                selectedFlight?.actualDepartureDateTime ||
                selectedFlight?.estimatedDepartureDateTime ||
                selectedFlight?.scheduledDepartureDateTime
              )
            "
          >
            <p>Estimated Departure Time:</p>
            <p class="highlight">{{ formatTime([selectedTime]) }}</p>
          </div>
          <div
            class="time flight-data"
            v-if="
              selectedFlight?.actualDepartureDateTime ||
              selectedFlight?.estimatedDepartureDateTime ||
              selectedFlight?.scheduledDepartureDateTime
            "
          >
            <p>Estimated Departure Time:</p>
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
        </div>
        <div class="right-content">
          <div
            class="airline flight-data right"
            v-if="selectedAirline && !selectedFlight?.airline?.name"
          >
            <p>Airline:</p>
            <p class="highlight">{{ selectedAirline }}</p>
          </div>
          <div
            class="airline flight-data right"
            v-if="selectedFlight?.airline?.name"
          >
            <p>Airline:</p>
            <p class="highlight">{{ selectedFlight?.airline?.name }}</p>
          </div>
          <div
            class="flightNumber flight-data right"
            v-if="selectedFlightNumber"
          >
            <p>Flight Number:</p>
            <p class="highlight">{{ selectedFlightNumber }}</p>
          </div>
          <div
            class="flightNumber flight-data right"
            v-if="selectedFlight?.flightNumber"
          >
            <p>Flight Number:</p>
            <p class="highlight">{{ selectedFlight?.flightNumber }}</p>
          </div>
          <div
            class="gate flight-data right"
            v-if="selectedFlight?.departureGate?.number"
          >
            <p>Gate:</p>
            <p class="highlight">{{ selectedFlight?.departureGate?.number }}</p>
          </div>
        </div>
      </div>
      <div class="destination-select-container" v-if="!selectedDestination">
        <div class="destination-select">
          <p>Destination City:</p>
          <select v-model="selectedDestination">
            <option
              v-for="cityName in sortedUniqueCityNames"
              :value="cityName"
              :key="cityName"
            >
              {{ cityName }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="airline-select-container"
        v-if="
          selectedDestination &&
          !selectedAirline &&
          !selectedFlight?.airline?.name
        "
      >
        <div class="airline-select">
          <p>Airline:</p>
          <select v-model="selectedAirline">
            <option
              v-for="airlineName in sortedUniqueAirlineNames"
              :value="airlineName"
              :key="airlineName"
            >
              {{ airlineName }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="time-select-container"
        v-if="
          selectedDestination &&
          selectedAirline &&
          !selectedTime &&
          !(
            selectedFlight?.actualDepartureDateTime ||
            selectedFlight?.estimatedDepartureDateTime ||
            selectedFlight?.scheduledDepartureDateTime
          )
        "
      >
        <div class="time-select">
          <p>Departure Time:</p>
          <select v-model="selectedTime">
            <option
              v-for="flight in filteredFlights"
              :value="getDepartureTime(flight)"
              :key="flight.flightNumber"
            >
              {{
                formatTime([
                  flight.actualDepartureDateTime,
                  flight.estimatedDepartureDateTime,
                  flight.scheduledDepartureDateTime,
                ])
              }}
            </option>
          </select>
        </div>
      </div>
      <div
        class="flightNumber-select-container"
        v-if="
          selectedDestination &&
          selectedAirline &&
          selectedTime &&
          !selectedFlightNumber &&
          !selectedFlight?.flightNumber
        "
      >
        <div class="flightNumber-select">
          <p>Flight Number:</p>
          <select v-model="selectedFlightNumber">
            <option
              v-for="flight in filteredFlights"
              :value="flight.flightNumber"
              :key="flight.flightNumber"
            >
              {{ flight?.flightNumber }}
            </option>
          </select>
        </div>
      </div>
      <div class="status-select-container" v-if="selectedFlight?.status">
        <div class="status-select">
          <p>Status:</p>
          <select v-model="selectedStatus">
            <option disabled value="">
              {{ selectedFlight?.status }}
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
      <div class="button-container">
        <button type="submit">Update</button>
        <button type="button" @click="handleReset">Reset</button>
      </div>
    </form>
  </div>
</template>

<style></style>
