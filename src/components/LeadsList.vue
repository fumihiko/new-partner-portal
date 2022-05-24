<template>
    <section>
      <ul>
         <li class="lead-card"
          v-for="lead in leads" 
          :key="lead.id"  
        >
            <lead-card :lead="lead" />
         </li>
      </ul>
    </section>
</template>
<script>
import { ref, onMounted, watch } from 'vue'
import LeadCard from '@/components/LeadCard.vue';

export default {
    
    components: {
       LeadCard
    },

    props: ['timeFrame'],
   
   
    setup(props) {
        
        const columns = ref()
        const ascending = ref(true)
        const sortColumn = ref('avgResponseTime')
        const loading = ref(false)
        const error = ref(null)
        const fetchTimeFrame = ref(props.timeFrame)
        const leads = ref()
      
        function fetchData(endpoint='getAllLeads', timeFrame = 90) {
            loading.value = true

            let end = new Date().toISOString().substring(0,10)
            let d = new Date()
            d.setDate(d.getDate() - timeFrame)
            let start = d.toISOString().substring(0,10)
  
            const request = {
                    method: 'POST',
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        accountId: `${window.u.aid}`,
                        partnerId: `${window.u.pid}`,
                        ownerUserId: `${window.u.uid}`,
                        start: `${start}`,
                        end: `${end}`
                    })
                }
            return fetch(`/api/leadservice?uri=leadservice/api/${enpoint}`, request)
            .then(async response => {
                const data = await response.json()
                // check for error response
                if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status
                return Promise.reject(error)
                    }
                    leads.value = data.o.leadAlerts
                })
                .catch(err => {
                    error.value = err
                })
                .then(() => {
                    loading.value = false
                })
        }
       

      const createHeader = () => {
            if (rows.value.length == 0) {
                return []
            }
            columns.value = Object.keys(rows.value[0])
        }
    const sortTable = (col) => {
        
        sortColumn.value = col;
      
        if (col === 'avgResponseTime') {
           // ascending.value = true
           console.log(col)
            rows.value.sort((a, b)  =>  a[col] - b[col])
        } 
         else {
           // ascending.value = false
           console.log(col)
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
      
    })

    watch(() => props.timeFrame, (newTimeFrame) => {
        fetchTimeFrame.value = newTimeFrame
        fetchData(fetchTimeFrame.value)
    })


      return {
          rows, columns, createHeader, formatHeader, sortTable, ascending, sortColumn , fetchTimeFrame, loading, error
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