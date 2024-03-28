<script>
import "../../design/flightDisplay/DataUnavailable.scss"

export default {
  data: function () {
    return {
      name: "DataUnavailable",
    }
  },
}
</script>

<template>
  <div class="no-data-available">
    <font-awesome-icon icon="fa-solid fa-plane-slash" class="icon" />
    <p>No Flights Available</p>
  </div>
</template>
