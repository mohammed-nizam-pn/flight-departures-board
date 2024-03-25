import axios from "axios"

export async function fetchFlightData() {
  try {
    const response = await axios.get(
      "https://6315ae3e5b85ba9b11e4cb85.mockapi.io/departures/Flightdata"
    )
    return (
      response.data?.allDepartures.sort(
        (a, b) =>
          new Date(a.estimatedDepartureDateTime) -
          new Date(b.estimatedDepartureDateTime)
      ) || []
    )
  } catch (error) {
    console.error("Error fetching flight data: ", error)
    throw error
  }
}
