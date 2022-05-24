
<template>
    <div class="checkbox-container">
        <label
          v-for="(option, i) of options"
          :key="i"
          class="item">
          
          <input
            :id="option"
            v-model="checked"
            type="checkbox"
            :value="option"
            @change="onChange"
          >
          <span>{{option}}</span>
        </label>
    </div>
</template>

<script>
 import { ref } from 'vue'
export default {
    props: {
        options: {
        type: Array,
        required: false,
        default: () => []
        }
    },
    setup(props, { emit }) {
        const checked= ref([])
        const onChange = () => {
            emit('input', checked.value)
        }
        return {
            checked, onChange
        }
    }
}
</script>

<style lang="scss" scoped>
  .checkbox-container {
    input {
      display: none;
      & + span {
          font-size: 16px;
          line-height: 19px;
          &::before {
              font-family: 'Font Awesome 6 Regular';
              content: '\f0c8';
              width: 19px;
              height: 19px;
              margin-right: 8px;
              vertical-align: baseline;
          }
      }
      &:checked + {
          span {
              &::before {
                  font-family: 'Font Awesome 6 Solid';
                  content: '\f14a';
                  color: #FE4A49;
              }
          }
      }
    }
  }
</style>
