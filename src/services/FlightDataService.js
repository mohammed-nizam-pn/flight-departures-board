import axios from "axios"

export async function fetchFlightData() {
  try {
    const response = await axios.get(
      "https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata"
    )

    const sortedDepartures =
      response.data?.allDepartures.sort((a, b) => {
        const departureTimeA = getDepartureTime(a)
        const departureTimeB = getDepartureTime(b)

        if (departureTimeA && departureTimeB) {
          return departureTimeA - departureTimeB
        } else if (departureTimeA) {
          return -1
        } else if (departureTimeB) {
          return 1
        } else {
          return 0
        }
      }) || []

    return sortedDepartures
  } catch (error) {
    console.error("Error fetching flight data: ", error)
    throw error
  }
}

function getDepartureTime(flight) {
  if (flight.actualDepartureDateTime) {
    return new Date(flight.actualDepartureDateTime)
  } else if (flight.estimatedDepartureDateTime) {
    return new Date(flight.estimatedDepartureDateTime)
  } else {
    return new Date(flight.scheduledDepartureDateTime)
  }
}
