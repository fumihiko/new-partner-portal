<template>
  <li class="metric-card-large">
    <h3>
      <span>{{data.value}}</span>
      <small>{{data.value === 0 || data.value === 1 ? fixPlural(data.name) : data.name}}</small>
    </h3>
  </li>
</template>

<script>
export default {
  name: "MetricCardLarge",
  
  props:['data'],
  setup () {
    const singularize = (str) => {
      if (str[str.length-1] === 's') {
        return str.slice(0, str.length -1)
      }
      else {
        return str
      }
    }

    const fixPlural = (str) => {
      let words = str.split(' ')
      return words.map(item => singularize(item)).join(' ')
    }

    return {
      singularize,
      fixPlural
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';
.metric-card-large {
  h3 {
    font-weight: 300;
    span {
      font-size: 96px;
      line-height: 112px;
    }
    
    small {
      font-size: 34px;
      display: block;
    }
  }
}
@media (prefers-color-scheme: dark) {
  

}
</style>
