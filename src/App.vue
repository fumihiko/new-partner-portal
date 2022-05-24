<template>
  <MobileNav />
  <div class="container">
    
      <Header :class="{ 'header--hidden': !showHeader, 'header--scrollup': scrollup }" />
        <router-view />
  </div>

</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import Header from "@/views/Header.vue"
import MobileNav from "@/views/MobileNav.vue"
import './assets/sass/app.scss'

export default {

  components: {
    Header,
    MobileNav
  },
  
  setup() {
    const showHeader = ref(true)
    const scrollup = ref(false)
    const lastScrollPosition = ref(0)
    const scrollValue = ref(0)
    const OFFSET = ref(30)
    const onScroll = () => {
      if (window.pageYOffset < 0) {
        return
      }
      if (Math.abs(window.pageYOffset - lastScrollPosition.value) < OFFSET.value) {
       scrollup.value = true
        if (window.pageYOffset === 0) {
        scrollup.value = false 
      }
        return
      }
      showHeader.value = window.pageYOffset < lastScrollPosition.value
      lastScrollPosition.value = window.pageYOffset
      
      
    }

    onMounted(() => {
      window.addEventListener('scroll', onScroll)

    })

    onBeforeUnmount(() => {
      window.removeEventListener('scroll', onScroll)

    })

    return {
      showHeader, lastScrollPosition, scrollValue, OFFSET, onScroll, scrollup
    }
  }

  


}
</script>

<style lang="scss" scoped>
  //@import "~primevue/resources/themes/mdc-light-indigo/theme.css";
  .container > header {
      
      transform: translate3d(0, 0, 0);
      transition: 0.1s all ease-out;
  }

  header.header--scrollup {
    box-shadow: 0 2px 16px rgba(99, 99, 99, 0.5);
  }
  header.header--hidden {
      box-shadow: none;
      transform: translate3d(0, -100%, 0);

  }


</style>