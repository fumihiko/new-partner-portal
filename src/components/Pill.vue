<template>
    <span class="pill" :class="status" ><slot /></span>
</template>

<script>


export default {
    props: ['status']
}
</script>

<style lang="scss" scoped>
 @import '../assets/sass/_variables.scss';
    span.pill {
        border: 1px solid $black-25;
        border-radius: 4px;
        display: inline-block;
        padding: 0 8px;
        font-size: 14px;
        line-height: 20px;
        text-transform: capitalize;
        background: rgba(191, 191, 191,.5);
        min-width: unset;
        width: auto;
        margin-right: 8px;
        &.active {
            border-color: #00FFCF;
            background: rgba(0, 255, 207,.5) ;
        }
        &.button {
           min-width: unset; 
        }
        
    }
</style>