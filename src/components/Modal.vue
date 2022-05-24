<template>
    <transition name="modal-animation" >
        <div v-show="modalActive" class="modal">
        <transition name="modal-animation-inner">
                <div v-show="modalActive" class="modal-inner">
                    <i @click="close" class="fa-solid fa-circle-xmark"></i>
                    <!-- modal content -->
                    <slot />
                    <button @click="close" type="button">Close</button>
                </div>   
            </transition> 
        </div>
    </transition>
     
</template>

<script>
export default {
   props: ['modalActive'],
   setup(props, {emit}) {
       const close = () => {
           emit('close');
       }

       return { close };
   }
}
</script>

<style scoped>
    .modal {
        z-index: 99;
        background-color: #ffffff;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        margin: 0;
        width: 55vw;
        height: 40%;
        border-radius: 6px;
        transition-property: top;
        transition-duration: 900ms;
    }

    .modal:not(.open) {
        /* display: none; */
    }

    .modal.open {
        animation: fadeup 250ms;
    }

    @keyframes fadeup {
        from { opacity: 0; top: 53%; }
        to { opacity: 1; top: 50%; }
    }

    .modal .actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>