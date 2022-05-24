<template>
    <div>
        <div class="panel-header">
            <button @click="toggle" :class="{collapsed: collapsed}">
                <i class="fa-solid fa-sliders"></i>
            </button>
        </div>
         <div :class="{animate__slideInDown: collapsed, animate__slideOutUp: !collapsed }" class="panel-content animate__animated ">
             <slot></slot>
         </div>
    </div>
</template>

<script>
import { ref } from 'vue'
export default {

    setup() {
        const collapsed = ref(false)

        const toggle = () => {
            collapsed.value = !collapsed.value
        }
        return {
            collapsed, toggle
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';

    .panel-header {
        display: flex;
        justify-content: end;
        position: relative;
    }
    button {
        border: 0;
        border-radius:  0;
        box-shadow: none;
        cursor: pointer;
        background: transparent;
        color: inherit;
        padding: 8px;
        margin-right: 24px;
        position: relative;
        bottom: -1px;
        background: $background-color;
        z-index: 5;
    }
    button.collapsed{
         border-top: 1px solid $border-color;
        border-right: 1px solid $border-color;
        border-left: 1px solid $border-color;
       
    }
    .animate__slideInDown.panel-content { 
        border-top: 1px solid $border-color;
    }
    
</style>
