<template>
    <section id="marketing-qualified-leads" class="rounded-rectangle">
        <h2>Marketing Qualified Leads</h2>
        <h4 v-if="!loading && totalMqls">{{ totalMqls.toLocaleString() }} Total MQLs</h4>
        <marketing-qualified-leads-pie-chart v-if="!loading && detailList" :data="detailList" />
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
import MarketingQualifiedLeadsPieChart from '@/components/MarketingQualifiedLeadsPieChart.vue'


export default {
    props: ['timeFrame', 'customTimeFrame'],
    components: {
      MarketingQualifiedLeadsPieChart  
    },
    setup(props) {
        const totalMqls = ref(null)
        const detailList = ref(null)
        const loading = ref(true)
        const error = ref(null)
        const fetchTimeFrame = ref(props.timeFrame)
        const fetchCustomTimeFrame = ref(props.customTimeFrame)

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
            return fetch(`/api/reportingservice?uri=reporting/api/partnerDashboard/getMarketingQualifiedLeads`, request)
            .then(async response => {
                const data = await response.json()
                // check for error response
                if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status
                return Promise.reject(error)
                    }
                    totalMqls.value = data.totalMqls
                    detailList.value = data.detailList
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
            totalMqls,
            detailList,
            fetchTimeFrame,
            fetchCustomTimeFrame,
            loading,
            error
        }
    },
}
</script>
