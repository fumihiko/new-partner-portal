<template>
    <header>
        <div class="">
            <div>
                <a href="/p"><img :src="logo" alt="" width="34px"></a>
                <span class="brand" ref="brand"><span v-if="window.u.pn != ''">{{ window.u.pn  }}</span><span v-else>{{ window.u.an  }}</span></span>
            </div>
            
            <ul class="sub-nav">
                <!-- <li><label class="search"><input type="text" placeholder="find prospects"><i class="fas fa-search"></i></label></li>
                <li><a href=""><i class="far fa-map"></i></a></li> -->
                <li><a href="/help/support" target="_blank" title="Support"><i class="fa-solid fa-circle-question"></i></a></li>
                <li><i class="fa-solid fa-circle-user"></i></li>
                <li class="dropdown">
                    <a @click="toggle" aria-haspopup="true" aria-controls="user-menu">{{ window.u.ufn }}</a>
                     <Menu v-if="window.u.aa == 'all'" id="user-menu" ref="menu" :model="menuItemsForAll" :popup="true" />
                     <Menu v-else id="user-menu" ref="menu" :model="menuItems" :popup="true" />

                    
                </li>

            </ul>
        </div>
        <nav class="nav">
            <ul>
                <li><router-link :to="{ name: 'Dashboard'}">Dashboard</router-link> </li>
                <li><router-link :to="{ name: 'Leads'}">Leads</router-link></li>
                <!-- <li><router-link :to="{ name: 'Prospects'}">Prospects</router-link> </li>
                <li><router-link :to="{ name: 'Reports'}">Reports</router-link></li>
                <li><router-link :to="{ name: 'Exports'}">Exports</router-link> </li>
                <li><router-link :to="{ name: 'Users'}">Users</router-link></li>
                <li><router-link :to="{ name: 'Settings'}">Settings</router-link> </li> -->
            </ul>
        </nav>
    </header>
</template>

<script>

import { ref, onMounted } from 'vue'
import image from "../assets/img/etrigue_logo.png"

export default {
   

    setup() {
        const pointyPosition = ref(0)
        const brand = ref(null)
        const logo = ref(image)
        const menu = ref()
          
        const menuItems = ref([
            
            {
                
                items: [
                    
                    {
                        label: 'Log Out',
                        icon: 'fa-regular fa-arrow-right-from-bracket',
                        url: '/logout'
                    }
            ]}
        ])

        const menuItemsForAll = ref([
            
            {
                
                items: [
                    {
                        label: 'eTrigue App',
                        icon: '',
                        url: '/'
                    },
                    
                    {
                        label: 'Log Out',
                        icon: 'fa-regular fa-arrow-right-from-bracket',
                        url: '/logout'
                    }
            ]}
        ])

        const toggle = (event) => {
            menu.value.toggle(event);
        }
        const findPointyPosition = () => {
            pointyPosition.value = `${brand.value.offsetWidth / 2 + 66}px`
        }

        onMounted(() => {
            findPointyPosition()
        })

        return {  pointyPosition, brand, findPointyPosition, logo, menu, menuItems, menuItemsForAll, toggle } 
    },
   
    

}
</script>

<style scoped>
    
    nav.nav:after { 
    left: v-bind('pointyPosition');
    } 

    nav.nav:before { 
    left: v-bind('pointyPosition');
    }

</style>
