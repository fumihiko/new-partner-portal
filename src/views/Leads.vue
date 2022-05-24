<template>
  <main id="leads">
    <header>
      <h1 class="page-title">Leads</h1>
      <div class="dropdown-group">
        <SalesRepDropdown v-if="userRole == 'partnerManager'" @changeSalesRep="changeSalesRep" :sales-rep="salesRep" :param="salesRep" />
        <LeadStatusDropdown @changeLeadStatus="changeLeadStatus" :lead-status="leadStatus" :param="leadStatus" />
        <TimeFrameDropdown @changeTimeFrame="changeTimeFrame" @changeCustomTimeFrame="changeCustomTimeFrame" :custom-time-frame="customTimeFrame" :time-frame="timeFrame"/>
      </div>
    </header>
    
    <section class="rounded-rectangle">
      
      <ul id="leads-metrics">
        <metric-card-large v-for="(metric, index) in leadsMetrics" :key="index" :index="index" :data="metric" />
      </ul>
      
      <responsive-line-chart v-if="!processing && leadsAlertData" :data="leadsAlertData" :mode="mode" />
      <!-- <leads-line-chart v-if="!processing && leadsAlertData" :aspectRatio="6" :responsive="true" :data="leadsAlertData" /> -->
    </section>
    <section>
      <DataTable :value="filteredBySalesRepLeads" showGridlines
                :paginator="false" :rows="25"  :scrollable="true" :scrollHeight="600"
                dataKey="id" v-model:filters="filters" :loading="loading"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" 
            responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                :globalFilterFields="['companyName','prospectName','prospectEmail','phone','userName', 'userEmail', 'mqlType']">
       <!-- <DataTable :value="filteredBySalesRepLeads" showGridlines
               
                dataKey="id" v-model:filters="filters" :loading="loading"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
           
            responsiveLayout="scroll"
                :globalFilterFields="['companyName','prospectName','prospectEmail','phone','userName', 'userEmail', 'mqlType']"> -->
                <template #header>
                    <div>
                    
                        <span class="p-input-icon-left">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <InputText v-model="filters['global'].value" placeholder="Search" />
                        </span>
                        <SelectButton v-model="leadsOrAlertsValue" :options="leadsOrAlerts" optionLabel="name"  />
                    </div>
                </template>
                <template #empty>
                    No <span v-if="leadsOrAlertsValue.value == 1">alerts</span><span v-else>leads</span> found.
                </template>
                <template #loading>
                    <i class="fa-solid fa-sync fa-spin fa-3x"></i> Loading <span v-if="leadsOrAlertsValue.value == 1">alerts</span><span v-else>leads</span> data. Please wait.
                </template>

                <Column>
                  <template #body="slotProps">
                    <div  class="profile-pic" :class="convertStatus(parseInt(slotProps.data.status))">
                      <i class="fa-solid fa-circle-user"></i>
                    </div>
                  </template>
                </Column>
                <Column field="prospectName" header="Lead" :sortable="true">
                  <template #body="slotProps">
                    <router-link  :to="`/p/leads/${slotProps.data.prospectId}/lead`">
                      <b>{{slotProps.data.prospectName}}</b>
                      <span>{{slotProps.data.prospectEmail}}</span>
                      <span>{{slotProps.data.phone}}</span>
                    </router-link>
                  </template>
                </Column>
                <Column field="companyName" header="Company" :sortable="true">
                   <template #body="slotProps">
                    
                      <span>{{slotProps.data.companyName}}</span><br>
                      <span>{{slotProps.data.title}}</span><br>
                      <!-- <span><pill :status="convertStatus(slotProps.data.status)">{{ convertStatus(slotProps.data.status) }}</pill></span> -->
                  </template>
                </Column>
                <Column field="state" header="State" :sortable="true"></Column>
                <Column field="mqlType" header="MQL Type" :sortable="true"></Column>
                <Column v-if="leadsOrAlertsValue.value == 1" field="userName" header="Sent To" :sortable="true">
                  <template #body="slotProps">
                    
                      <span>{{slotProps.data.userName}}</span><br>
                      <span>{{slotProps.data.userEmail}}</span>
                    
                  </template>
                </Column>
                <Column v-else field="userName" header="" :sortable="false">
                  <template #body>
                    
                      
                    
                  </template>
                </Column>
                <Column field="responses" header="Responses" :sortable="true">
                  <template #body="slotProps">
                      <span>{{slotProps.data.responses === null ? 0 : slotProps.data.responses.length}} {{slotProps.data.responses === null ? 'response' : slotProps.data.responses.length === 1  ? 'response' : 'responses'}}</span>                  
                  </template>
                </Column>
                <Column field="" header="" :sortable="false">
                  <template #body="slotProps">
                    <router-link  :to="`/p/leads/${slotProps.data.prospectId}/response`">
                      <i class="fa fa-plus"></i>
                    </router-link>
                  </template>
                </Column>
               
                
            </DataTable>
            

          
    </section>
   
  <div v-if="displayModal"> 
        <router-view :leads="leads" />
  </div>
  </main>
 
</template>

<script>
import { ref, onMounted, watch, computed  } from 'vue'
import { useRoute } from 'vue-router'
import SalesRepDropdown from '@/components/Dropdowns/SalesRepDropdown.vue'
import LeadStatusDropdown from '@/components/Dropdowns/LeadStatusDropdown.vue'
import TimeFrameDropdown from '@/components/Dropdowns/TimeFrameDropdown.vue'
import ResponsiveLineChart from "@/components/ResponsiveLineChart.vue"
import MetricCardLarge from '@/components/MetricCardLarge.vue'
//import LeadCard from '@/components/LeadCard.vue'
//import Pill from '@/components/Pill.vue'

import {FilterMatchMode,

// FilterOperator
} from 'primevue/api'
// import LeadsLineChart from './LeadsLineChart.vue'

//import db from '../db/sample.json'

export default {
 name: 'Leads',

 components: {
  ResponsiveLineChart,
  MetricCardLarge,
  SalesRepDropdown,
  LeadStatusDropdown,
  TimeFrameDropdown,
  // LeadsLineChart,
 },

setup() {
    
    const route = useRoute()
    const userRole = ref()
    const showModal = ref(false)
    const salesRep =  ref(route.query.salesRep ? parseInt(route.query.salesRep) : -1) 
    const leadStatus = ref(route.query.leadStatus ? parseInt(route.query.leadStatus) : 0) 
    const timeFrame = ref(route.query.timeFrame ? parseInt(route.query.timeFrame) : 90)
    const customTimeFrame = ref([])
    const loading = ref(false)
    const error = ref(null)
    const leadsOrAlertsValue = ref({name: 'Alerts', value: 1})
    const leads = ref([])
    const allLeads = ref([])
    const processing = ref(true)
    const mode = ref()
    const determineRole = () => {
      const featuresList = window.u.f
      userRole.value = featuresList.indexOf(100) > 0 ? 'partnerManager' : 'salesRep'
    }

    const filteredBySalesRepLeads = computed(() => {
      if (salesRep.value !== -1) {
        if (leadsOrAlertsValue.value.value == 1) {
            return  leads.value.filter(lead => 
            lead.userId == salesRep.value
          )
        } else {
          return  leads.value.filter(lead => 
            lead.userId.indexOf(salesRep.value) !== -1
          )
        }
        
      } else {
        return leads.value
      }
    })

    const leadsOrAlerts = ref([
            {name: 'Leads', value: 0},
            {name: 'Alerts', value: 1}
        ])
    const leadsMetrics = ref([
        {
          name:'leads generated',
          value: 0
        },
        { 
          name: 'alerts sent', 
          value: 0
        },
        {
            name: 'recipients',
            value: 0
        }
      ])
    
    const createLeadsMetricsData = (arr) => {
      
      const leadsGenerated = [...new Set(arr.map(lead => lead.prospectId))]
      const alertsSent = arr.length
      const recipients = [...new Set(arr.map(lead => lead.userEmail))]
      leadsMetrics.value.filter(item => item.name === 'leads generated').map(item => item.value = leadsGenerated.length )
      leadsMetrics.value.filter(item => item.name === 'alerts sent').map(item => item.value = alertsSent )
      leadsMetrics.value.filter(item => item.name === 'recipients').map(item => item.value = recipients.length )
    }

    const leadsAlertData = ref([])

     const filters = ref({
            'global': {value: null, matchMode: FilterMatchMode.CONTAINS}
        })
 

    const createChartData = async (arr) => {
      processing.value = true
      let alertSentDate = []
      
     
      if (timeFrame.value >= 90 ) {
        mode.value = 'months'
      } else {
        mode.value = 'days'
      }
			
      if (mode.value ==='days') {
         alertSentDate = await arr.map(item => item.sent.split(' ')[0])
      }

      if (mode.value === 'months') {
         alertSentDate = await arr.map(item => item.sent.substring(0,7))
      }
     //console.log(alertSentDate)
      const alertSentCountPerDate = {}
      alertSentDate.forEach(x => {
        alertSentCountPerDate[x] = (alertSentCountPerDate[x] || 0 ) + 1
      })

      const performance = Object.entries(alertSentCountPerDate).map(entry => {
        return {date: entry[0].replaceAll('-', '/'), value: entry[1]}
      } )

      performance.sort(function(a, b) {
        var keyA = new Date(a.date),
          keyB = new Date(b.date);
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });

      console.log(performance)
      
      leadsAlertData.value = performance
      processing.value = false
    }

    const convertStatus = (value) => {
            return value === 0 ? 'inactive' : value === 1 ? 'active' : value === 2 ? 'bad-email' : 'opted-out'
        }
   

    
    const mergeDedupe = (arr) => {
      return [...new Set([].concat(...arr))];
    }
    
    
    const fetchData = async (timeFrame = 90, startDate = '', endDate = '') => {
          loading.value = true
          let endpoint = 'getAllLeads'
          if (leadStatus.value == 1) {
            endpoint = 'getPendingLeads'
          }
          let end = '',
              start = ''
          if (timeFrame >=  0) {
             end = new Date().toISOString().substring(0,10)
            let d = new Date()
            d.setDate(d.getDate() - timeFrame)
            start = d.toISOString().substring(0,10)
          } else {
            start = startDate
            end = endDate
          }
          
          const request = {
                  method: 'POST',
                  headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      accountId: `${window.u.aid}`,
                      partnerId: `${window.u.pid}`,
                      ownerUserId: `${userRole.value == 'salesRep' ? window.u.uid :  ''}`,
                      start: `${start}`,
                      end: `${end}`
                  })
              }
          try {
        const response = await fetch(`/api/leadservice?uri=leadservice/api/${endpoint}`, request)
        const data= await response.json()
        // check for error response
        if(!response.ok) {
          // get error message from body or default to response status
          const error=(data&&data.message)||response.status
          return Promise.reject(error)
        }
        if(leadStatus.value===2) {

          allLeads.value=data.o.leadAlerts.filter(item => item.responses!==null)


        } else {
          allLeads.value=data.o.leadAlerts
        }
        leads.value=allLeads.value
        createLeadsMetricsData(data.o.leadAlerts)
        createChartData(data.o.leadAlerts)
      } catch(err) {
        error.value=err
      }
      loading.value=false
      }
    
    const computedUniqueLeads = computed(() => {
      return [...new Set(leads.value.map(lead => lead.prospectId))].map(prospectId => {
                  
                  return {
                    prospectId,
                    prospectName: [...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.prospectName))].join(),
                    companyName:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.companyName))].join(),
                    responses:[...new Set(mergeDedupe([...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.responses))]).map(a => JSON.stringify(a)))].map(a => JSON.parse(a)),
                    status:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.status))].join(),
                    state:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.state))].join(),
                    title:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.title))].join(),
                    prospectEmail:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.prospectEmail))].join(),
                    phone:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.phone))].join(),
                    prospectOwnerId:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.prospectOwnerId))].join(),
                    userId:[...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.userId))],
                    mqlType: [...new Set(leads.value.filter(lead => lead.prospectId === prospectId).map(lead => lead.mqlType))].join(', '),
                  }
                })
    })

    
    


    const changeTimeFrame = ($event) => {
      timeFrame.value = $event.value
    }

    const changeCustomTimeFrame = ($event) => {
      customTimeFrame.value = $event.value
    }


    const changeLeadStatus = ($event) => {
      leadStatus.value = $event.value
    }

    const changeSalesRep = ($event) => {
      salesRep.value = $event.value
    }

   

 

    onMounted(async () => {
      determineRole()
    
      
      salesRep.value = userRole.value == 'salesRep' ? window.u.uid : route.query.salesRep ? parseInt(route.query.salesRep) : -1
      fetchData(timeFrame.value)
    
      // allLeads.value = db.o.leadAlerts
      // leads.value = allLeads.value
      // createLeadsMetricsData(leads.value)
      // createChartData(leads.value)
     
       
    })

    watch(timeFrame, (newValue) => {
        if (newValue >= 0) {
          
       // showAllAlertSent.value = newValue
          fetchData(timeFrame.value)
          
        }
        
    })  

    watch(leadsOrAlertsValue, (newValue) => {
      newValue.value == 0 ? leads.value = computedUniqueLeads.value : leads.value = allLeads.value
      
    })

     
     watch(customTimeFrame, (newValue) => {
       
        if (newValue[0] !== null && newValue[1] !== null && timeFrame.value < 0) {
           let start = new Date(customTimeFrame.value[0])
                
            let end = new Date(customTimeFrame.value[1])
              if(start < end) {
                start = start.toISOString().substring(0,10)
                end = end.toISOString().substring(0,10)
                fetchData(timeFrame.value, start, end)
                
              }
      
        }
        
    })

    

    watch(leadStatus, () => {
        //leadStatus.value = newValue
        if (timeFrame.value < 0 && customTimeFrame.value.length == 2 ) {
          let start = new Date(customTimeFrame.value[0])
                start = start.toISOString().substring(0,10)
            let end = new Date(customTimeFrame.value[1])
                end = end.toISOString().substring(0,10)
            fetchData(timeFrame.value, start, end)
        } else {
           fetchData(timeFrame.value)
        }
        
       // showAllAlertSent.value = newValue
       
    })

    






  

    return {
      salesRep, leadStatus, timeFrame, changeTimeFrame, changeLeadStatus, changeSalesRep, showModal, customTimeFrame, changeCustomTimeFrame, error, loading,
      leads,leadsMetrics, leadsAlertData, createChartData,  processing, mode, filteredBySalesRepLeads, allLeads,
      computedUniqueLeads, leadsOrAlerts, leadsOrAlertsValue, filters, convertStatus, userRole, createLeadsMetricsData
    }
  },
  
  methods: {
    
    toggleBodyClass() {
      if (this.showModal) {
        document.body.classList.add('noscroll')
      } else {
        document.body.classList.remove('noscroll')
      }
    }
  },
  watch: {
   
   $route: {
      immediate: true,
      handler: function(newVal) {
        // this.showModal = newVal.meta && newVal.meta.showModal;
        this.displayModal = newVal.meta && newVal.meta.displayModal;
        this.toggleBodyClass(); 
      }
}
  }
  
};
</script>
<style lang="scss" scoped>
 @import '../assets/sass/_variables.scss';
ul li ul.header {
  display: grid;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 32px  2fr 2fr 1fr 2fr 2fr 1fr 32px;
}

.modal-route {
    width: 100vw;
    //height: 120vh;
    position: absolute;
    overflow-y: scroll;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    background: rgba(0,0,0, .7);
    overscroll-behavior: contain;
    margin: 0 auto;
    height: 100vh;
    z-index: 5;
}

 #leads {
   display: grid;
    grid-gap: 32px;
 }

 
    
  li.lead-card {
    border: 1px solid $border-color;
    line-height: 24px;
    border-radius: 8px;
    padding: 8px 8px;
    margin: 0 0 16px 0;
    box-shadow: 0px 1px 2px 0px #BFBFBF;
    &:nth-child(even) {
      background-color: $list-background-color-even;
    }
    a {
      text-decoration: inherit;
      color: inherit;
      cursor: pointer;
    }
  }

#leads-metrics {
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 32px;
  transition: height 0.5s ease;
}


    .dropdown-group, .tool-box {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        align-items: baseline;
        
    }
    .tool-box {
      margin-bottom: 32px;
    }

</style>
