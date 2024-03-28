<script>
import "../../design/flightDisplay/ErrorMessage.scss"

export default {
  data: function () {
    return {
      name: "ErrorMessage",
    }
  },
}
</script>

<template>
  <div class="error-message">
    <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="icon" />
    <p>
      Server Error<br />
      Unable to retrieve data.
    </p>
  </div>
</template>
