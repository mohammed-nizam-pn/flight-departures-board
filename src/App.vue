<script>
import Header from "@/components/Header.vue"

export default {
  data: function () {
    return {}
  },
  components: {
    appHeader: Header,
  },
}
</script>

<template>
  <div id="main-container">
    <appHeader></appHeader>
  </div>
</template>

<style lang="scss">
#main-container {
  margin: 2rem;
}
</style>
