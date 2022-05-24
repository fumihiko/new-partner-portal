<template>
    <button :type="buttonType" :class="className" class="btn" @click="onClick">
       <slot/>
    </button>
    
</template>

<script>
import { ref } from 'vue'

export default {
    props: ['onClick'],
    setup(props) {
      const buttonType = ref(props.type)
      const className = ref(props.class)

      return {
          buttonType,
          className
      }
    },
}
</script>
