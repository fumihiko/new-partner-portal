<template>
    <Dropdown v-model="selectedSalesRep" @change="updateSalesRep" :options="salesRepOptions" optionLabel="salesRep" optionValue="userId"  />
</template>

<script>

//import { onBeforeRouteEnter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'
//import {list} from '../../db/salesRep.json'
export default {
    
    setup(props, {emit}) {

        

        const selectedSalesRep = ref(props.salesRep)
        const loading = ref(false)
        const error = ref()
        const salesRepOptions = ref([])
        const route = useRoute()

        const createSalesRepDropdown = () => {
            loading.value = true;
            const localtimeNow = new Date().toISOString()  
  
            const request = {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                    filter:{
                        partnerId: `${window.u.pid}`,
                        timeFrameType: 0,
                        timeFrameInDays: 30000,
                        date: localtimeNow,
                    }})
                }
         return fetch(`/api/reportingservice?uri=reporting/api/partnerDashboard/getLeaderboardSection`, request)
            .then(async response => {
                const data = await response.json()
                // check for error response
                if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status
                return Promise.reject(error)
                    }
                    
                    let sortedSalesRep = data.list.sort((a, b)  =>  b['salesRep'] - a['salesRep'])
                    salesRepOptions.value = [{salesRep: 'All Sales Reps', userId: -1}, ...sortedSalesRep]
                    
                    if(route.query.salesRep) {
                        selectedSalesRep.value = parseInt(route.query.salesRep)
                    } else {
                        selectedSalesRep.value = -1
                    }
                })
                .catch(err => {
                    error.value = err
                })
                .then(() => {
                    loading.value = false
                })
        }

        const updateSalesRep = () => {
            emit('changeSalesRep', selectedSalesRep)
        }

        onMounted(async () => {
            await createSalesRepDropdown()
            // let sortedSalesRep = list.sort((a, b)  =>  b['salesRep'] - a['salesRep'])
            // salesRepOptions.value = [{salesRep: 'All Sales Reps', userId: -1}, ...sortedSalesRep]
            
            if(parseInt(route.query.salesRep) > 0) {
                selectedSalesRep.value = parseInt(route.query.salesRep)
            } else {
                selectedSalesRep.value = -1
            }
            
        })
        
        

      

        return { selectedSalesRep, createSalesRepDropdown, updateSalesRep, loading, error, salesRepOptions}
    },
    
}

</script>
