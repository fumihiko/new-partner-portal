<template>
    <span class="p-input-icon-right">
        
       

        <transition
            @after-enter="onAfterEnter"
            enter-active-class="animate__animated animate__fadeIn animate__slideInRight" 
            leave-active-class="animate__animated animate__fadeOut animate__slideOutRight"
        >
            <InputText ref="input" v-if="show" type="text" v-model="search" placeholder="Search" />
        </transition>
         <a @click="show = !show">
            <i class="fa-solid fa-magnifying-glass"></i>
        </a>
    </span>
</template>

<script>

    import { ref } from 'vue'

    export default {
        setup() {
            const show = ref(false)
            const input = ref(null)
            const search = ref()

            const onAfterEnter = (el) => {
                el.focus()
            }

            

            return { show, input, search, onAfterEnter }
        }
    }

</script>

<style lang="scss" scoped>

    .p-input-icon-right {
         overflow: hidden;
        width: auto;
        a {
            z-index: 2;
            position: relative;
            background: #FFFFFF;
        }
    }
    
    input {
        border-bottom: 1px solid rgba(0, 0, 0, 0.38);
        outline: none;
        font-size: inherit;
        line-height: 30px;
            padding: 0 8px;
           margin-left: 16px;
    }

</style>
