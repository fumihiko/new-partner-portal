<template>
    <section id="overall-performance" class="rounded-rectangle">
        <h2>Overall Performance</h2>
        <ul v-if="!loading && overallPerformance">
            <li class="metric-card"                                                                                                      
            v-for="(value, key, index) in overallPerformance" 
            :key="key" 
            :overallPerformance="overallPerformance">
                <label v-if="index <= 2">
                    <router-link  :to="{ name: 'Leads', query: { leadStatus: index, timeFrame: fetchTimeFrame } }">{{capitalizeKey(key) }}</router-link> <a  v-tooltip="termDefinitions[index]"><i class="fa-regular fa-circle-question"></i></a>
                </label>
                <h3 class="animate__animated" v-if="index <= 2" >
                    <router-link :to="{ name: 'Leads', query: { leadStatus: index, timeFrame: fetchTimeFrame } }">{{formatValue(value, key)}}</router-link>
                </h3>
                <label v-if="index > 2">
                    {{capitalizeKey(key) }} <a  v-tooltip="termDefinitions[index]"><i class="fa-regular fa-circle-question"></i></a>
                </label>
                <h3 class="animate__animated" v-if="index > 2" >
                    {{formatValue(value, key)}}
                </h3>
            </li>
        </ul>
        <div v-if="loading" class="fa-3x">
            <i class="fa-solid fa-sync fa-spin"></i>
        </div>
        <p v-if="error">
            {{ error }}
        </p> 
    </section>
</template>

<script>
import { ref, onMounted, watch } from 'vue'


export default {
    props: ['timeFrame', 'customTimeFrame'],
    setup(props) {
        const overallPerformance = ref(null)
        // const overallPerformance = ref({
        // totalLeads: 12,
        // pendingLeads: 8,
        // leadsResponded: 4,
        // opportunityValue: 80000,
        // avgResponseTime: 13680064
        // })
        const isHovering = ref(false)
        const loading = ref(false)
        const error = ref(null)
        const fetchTimeFrame = ref(props.timeFrame)
        const fetchCustomTimeFrame = ref(props.customTimeFrame)
        const termDefinitions = ref([
            'The number of unique leads identified.',
            'The number of unique leads that have not received any follow-up from sales reps.',
            'The number of unique leads that have received follow-up from sales reps.',
            'The total (sum) opportunity value across all leads.',
            'Across all sales reps, the average time it takes to follow-up with a lead initially.'
        ])
        function fetchData(timeFrame = 90, start, end) {
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
                        timeFrameType: `${timeFrame >= 0 ? 0 : 1}`,
                        timeFrameInDays: timeFrame,
                        date: localtimeNow,
                        customFromDate: `${timeFrame >= 0 ? localtimeNow : start}`,
                        customToDate: `${timeFrame >= 0 ? localtimeNow : end}`, 
                    }})
                }
            return fetch(`/api/reportingservice?uri=reporting/api/partnerDashboard/getOverallPerformanceSection`, request)
            .then(async response => {
                const data = await response.json()
                // check for error response
                if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status
                return Promise.reject(error)
                    }
                    overallPerformance.value = data
                })
                .catch(err => {
                    error.value = err
                })
                .then(() => {
                    loading.value = false
                })
        }

        onMounted(() => {
            
            fetchData(fetchTimeFrame.value)
        })

        watch(() => props.timeFrame, (newTimeFrame) => {
            if (newTimeFrame >= 0) { 
                fetchTimeFrame.value = newTimeFrame
                fetchData(fetchTimeFrame.value)
            }
        })

        watch(() => props.customTimeFrame, (newValue) => {
            
            fetchCustomTimeFrame.value = newValue
           
            if (fetchTimeFrame.value < 0 && fetchCustomTimeFrame.value[0] !== null && fetchCustomTimeFrame.value[1] !== null) {
                let start = new Date(fetchCustomTimeFrame.value[0])
                let end = new Date(fetchCustomTimeFrame.value[1])
                if (start < end) {
                    start = start.toISOString()
                    end = end.toISOString()
                    fetchData(fetchTimeFrame.value, start, end)
                }
                
            }
        })

        return {
            overallPerformance,
            fetchTimeFrame,
            loading,
            error,
            fetchCustomTimeFrame,
            termDefinitions,
            isHovering
        }
    },
    methods: {

        convertMsToHM(time) {
            let milliseconds = time
            if (milliseconds === 0) {
                return '0 minutes'
            }
            let seconds = Math.floor(milliseconds / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);

            seconds = seconds % 60;
            // 👇️ if seconds are greater than 30, round minutes up (optional)
            minutes = seconds >= 30 ? minutes + 1 : minutes;

            minutes = minutes % 60;

            
            // hours = hours % 24;

            return `${hours > 1 ? hours + ' hours': hours == 1 ? '1 hour' : '' } ${minutes > 1 ? minutes + ' minutes' : minutes == 1 ? '1 minute' : '0 minutes'}`;
        },
        capitalizeKey(str) {
        let formatted =  str.replace(/([A-Z])/g, ' $1').trim()
        
        const words = formatted.split(' ')
        return words.map((word) => { 
        return word[0].toUpperCase() + word.substring(1)}).join(' ')
        },
        formatValue(str, key) {
        let formatted = (key === 'opportunityValue') ? `$${str.toLocaleString()}` :  (key === 'avgResponseTime') ? `${this.convertMsToHM(str)}` : str 
        return formatted
        }
    }
}
</script>

<style lang="scss" scoped>

     h3 {
        a {
            text-decoration: none;
            color: inherit;
        }
        &:hover {
            animation-name: tada;
        }
    }

</style>