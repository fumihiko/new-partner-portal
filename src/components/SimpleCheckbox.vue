<template>
    <div :class="size" class="checkbox-container">
        <label><input type="checkbox" :value="value" :v-model="model"><span>{{label}}</span></label>
    </div>
</template>

<script>
// import { ref } from 'vue'
export default {
    props: ['label', 'value', 'model'],
   
}
</script>

<style lang="scss" scoped>
  .checkbox-container {
    input {
      display: none;
      & + span {
          font-size: 12px;
          &::before {
              font-family: 'Font Awesome 6 Regular';
              content: '\f0c8';
              width: 12px;
              height: 12px;
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
  .normal.checkbox-container {
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