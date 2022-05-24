<template>
  <li class="metric-card">
    <label>{{data.key}}</label>
    <h3>{{data.value}}</h3>
  </li>
</template>

<script>
export default {
  name: "MetricCard",
  
  props: ['data']
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';
  
@media (prefers-color-scheme: dark) {
  li:nth-child(even) {
    background-color: $dark-list-background-color-even;
  }

}
</style>
