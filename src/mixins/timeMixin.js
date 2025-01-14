export const timeMixin = {
  methods: {
    formatTime(departureTimes) {
      for (const dateTime of departureTimes) {
        if (dateTime) {
          const date = new Date(dateTime)
          const hours = ("0" + date.getHours()).slice(-2)
          const minutes = ("0" + date.getMinutes()).slice(-2)

          return `${hours}.${minutes}`
        }
      }
      return ""
    },
  },
}
