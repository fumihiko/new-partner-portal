<template>
    <section id="leaderboard">
      <h2>Leaderboard</h2>
      <ul  v-if="!loading && rows">
        <li>
          <div class="header">
            <span></span>
            <span></span>
            <span>Sales Rep</span>
            <span @click="sortTable('totalLeads')" :class="{ active: (sortColumn === 'totalLeads') }">Total Leads</span>
            <span @click="sortTable('pendingLeads')" :class="{ active: (sortColumn === 'pendingLeads') }">Pending Leads</span>
            <span @click="sortTable('leadsResponded')" :class="{ active: (sortColumn === 'leadsResponded') }">Leads Responded</span>
            <span @click="sortTable('opportunityValues')" :class="{ active: (sortColumn === 'opportunityValues') }">Opportunity Value</span>
            <span @click="sortTable('avgResponseTime')" :class="{ active: (sortColumn === 'avgResponseTime') }">Avg. Response Time</span>
          </div>
        </li>
      
           
         <sales-rep-card v-for="(row,index) in rows" :key="row.id" :user-role="userRole" :time-frame="timeFrame" :index="index" :sales="row" />
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
import SalesRepCard from '@/components/SalesRepCard.vue';

export default {
    
    components: {
       SalesRepCard
    },

    props: ['timeFrame', 'customTimeFrame', 'userRole'],
   
   
    setup(props) {
        
        const columns = ref()
        const ascending = ref(true)
        const sortColumn = ref('total')
        const loading = ref(false)
        const error = ref(null)
        const fetchTimeFrame = ref(props.timeFrame)
        const fetchCustomTimeFrame = ref(props.customTimeFrame)
        
        const rows = ref()
        
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
            return fetch(`/api/reportingservice?uri=reporting/api/partnerDashboard/getLeaderboardSection`, request)
            .then(async response => {
                const data = await response.json()
                // check for error response
                if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status
                return Promise.reject(error)
                    }
                    rows.value = findTopPerformer(data.list)
                    sortTable('total')
                })
                .catch(err => {
                    error.value = err
                })
                .then(() => {
                    loading.value = false
                })
        }

      const calculateResponseRate = (item) => {
        return item['leadsResponded']/ item['totalLeads'] * 100
      }

const findTopPerformer = (arr) => {
  const rr = arr.map(calculateResponseRate)
  arr.map((item,index) => arr[index]['responseRate'] = rr[index])
  arr.sort((a,b) => b.responseRate - a.responseRate)
  let rank1 = 1
  arr.map((item, index) => {
    if(index > 0 && item.responseRate < arr[index - 1].responseRate) {
      rank1 = index + 1
    } 
    item.rank1 = rank1
  })
  arr.sort((a,b) => b.totalLeads - a.totalLeads)
  let rank2 = 1
  arr.map((item, index) => {
    if(index > 0 && item.totalLeads < arr[index - 1].totalLeads) {
      rank2 = index +1
    }
    item.rank2 = rank2
  })
  
  arr.sort((a,b) => a.avgResponseTime - b.avgResponseTime)
  let rank3 = 1
  arr.map((item, index) => {
    if(index > 0 && item.avgResponseTime > arr[index - 1].avgResponseTime) {
      rank3 = index + 1
    } 
    item.rank3 = rank3
  })

  arr.sort((a,b) => a.rank3 - b.rank3).sort((a,b) => a.rank2 - b.rank2).sort((a,b) => a.rank1 - b.rank1)
  let total = 1
  
  arr.map((item, index) => {
    if(index > 0 && item.rank1 > arr[index - 1].rank1) {
      total = index + 1
    } else {
      if(index > 0 && item.rank2 > arr[index - 1].rank2) {
        total = index + 1
      } else {
        if(index > 0 && item.rank3 > arr[index - 1].rank3) {
          total = index + 1
        }
      }
    }
    item.total = total
  })
  return arr
}
       

      const createHeader = () => {
            if (rows.value.length == 0) {
                return []
            }
            columns.value = Object.keys(rows.value[0])
        }
    const sortTable = (col) => {
        
        sortColumn.value = col;
      
        if (col === 'avgResponseTime' || col === 'total') {
           
            rows.value.sort((a, b)  =>  a[col] - b[col])
        } 
         else {
          
             rows.value.sort((a, b)  =>  b[col] - a[col])
        }
      

    //   rows.value.sort(function(a, b) {
    //     if (a[col] > b[col]) {
    //       return ascending.value ? 1 : -1
    //     } else if (a[col] < b[col]) {
    //       return ascending.value ? -1 : 1
    //     }
    //     return 0;
    //   })
    }

    const formatHeader = str => {
        let formatted = str.replaceAll('_', ' ').split(' ').map((s) => s.charAt(0).toUpperCase() + s.substr(1)).join(' ')
        return formatted
    }    

      
    onMounted(() => {
      fetchData(fetchTimeFrame.value)
      
    //   rows.value = findTopPerformer(rows.value)
    //                 sortTable('total')
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
          rows, columns, createHeader, formatHeader, sortTable, ascending, sortColumn , fetchTimeFrame, loading, error, fetchCustomTimeFrame
          
      
      }
    },


}
</script>
<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';
 
 
 li {
    padding: 16px 32px;
    margin: 0 0 16px 0;
    font-weight: 300;
    line-height: 20px;
    &:first-child {
      padding: 0 32px;
      margin: 0 0 8px 0;
      font-size: 14px;
      
      font-weight: 400;
      
    }
    &.metric-card {
      padding: 0;
    }
  }
  .header {
    display: grid;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 12px 24px 2fr 1fr 1fr 1fr 1fr 1fr;
     grid-gap: 2%;
    span {
      display: block;
      &.active {
          color: $primary-color;
      }
    }
    > span {
      display: flex;
      flex-direction: column;
    }
  } 
  </style>