import axios from "axios"

export async function fetchFlightData() {
  try {
    const response = await axios.get(
      "https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata"
    )
    const sortedDepartures = (response?.allDepartures || [])
      .filter(
        (departure) =>
          departure.arrivalAirport.name &&
          departure.arrivalAirport.name.trim() !== ""
      )
      .sort(
        (a, b) => new Date(getDepartureTime(a)) - new Date(getDepartureTime(b))
      )

    return sortedDepartures
  } catch (error) {
    console.error("Error fetching flight data: ", error)
    throw error
  }
}

function getDepartureTime(flight) {
  return (
    flight.actualDepartureDateTime ||
    flight.estimatedDepartureDateTime ||
    flight.scheduledDepartureDateTime
  )
}
