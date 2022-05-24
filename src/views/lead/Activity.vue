<template>
  <div class="tab-content">
       
        <div v-if="!loading && interactions && updates && touches" class="activity-summary-boxes">
          <div @click="showOnlyInteractions" :class="{active: selectedType == 'interactions'}" class="activity-summary-box">
            <h3>{{interactions.length}} <span>interactions</span></h3>
          </div>
          <div @click="showOnlyTouches" :class="{active: selectedType == 'touches'}" class="activity-summary-box">
            <h3>{{touches.length}} <span>touches</span></h3>
          </div>
          <div @click="showOnlyUpdates" :class="{active: selectedType == 'updates'}" class="activity-summary-box">
            <h3>{{updates.length}} <span>updates</span></h3>
          </div>
        </div>
        <Accordion v-if="!loading && activityHistory" class="custom-accordion">
            <AccordionTab>
              <template #header>
                <i class="fa-solid fa-sliders"></i>
              </template>
            <div class="checkbox-filters">
              <div v-for="(category, categoryIndex) in Object.keys(activities)" :key="categoryIndex">
                  <b>{{category}}</b>
                  <ul>
                    <li v-for="(type, typeIndex) in activities[category]" :key="typeIndex">
                      <div  class="field-checkbox">
                        <Checkbox :id="type.value" :value="type.value" v-model="selectedActivities" />
                        <label :for="type.value"  >{{type.name}}</label>
                      </div>
                    </li>

                  </ul>
                  
            
              </div>
            </div>            
          </AccordionTab>
        </Accordion>
        

          <ScrollPanel style="width: 100%; height: 264px">
            <ul v-if="!selectedType && activityHistory" class="p-timeline p-component p-timeline-left p-timeline-vertical customized-timeline">
              <li v-for="activity in filteredActivities" :key="activity.ActivityTime + activity.Details[0].Value" class="p-timeline-event">
                <div class="p-timeline-event-separator">
                  <span class="custom-marker shadow-2" :class="activitydispatcher[activity.Type].class">
                      <i class="fa-solid" :class="activitydispatcher[activity.Type].icon"></i>
                  </span>
                  <div class="p-timeline-event-connector" style="width: 2px; background: rgb(197, 197, 197);"></div>
                </div>
                <div class="p-timeline-event-content">
                  <p>{{activitydispatcher[activity.Type].title}}: <b>{{activity.Details[0].Value}}</b></p>
                  <small>{{dateFormatter(activity.ActivityTime)}} 
                      <template v-if="activity.Type == 'Visit'">
                        • {{activity.Details[0].Value}} <span v-if="parseInt(activity.Details[0].Value) == 1">page</span><span v-else>pages</span> viewed
                      </template>
                      <template v-if="activity.Type == 'Mailout'">
                        • {{activity.Details[2].Value}}
                      </template>
                    </small>
                </div>
              </li>
            </ul>
            
            <Timeline v-if="selectedType == 'interactions'" :value="interactions" align="left" class="customized-timeline">
                <template #marker="slotProps">
                    <span class="custom-marker shadow-2" :class="activitydispatcher[slotProps.item.Type].class">
                       <i class="fa-solid" :class="activitydispatcher[slotProps.item.Type].icon"></i>
                    </span>
                </template>
                <template #connector>
                  <div class="p-timeline-event-connector" style="width:2px; background: #C5C5C5"></div>
                </template>
                <template #content="slotProps">
                    <p>{{activitydispatcher[slotProps.item.Type].title}}: <b>{{slotProps.item.Details[0].Value}}</b></p>
                    <small>{{dateFormatter(slotProps.item.ActivityTime)}} 
                      <template v-if="slotProps.item.Type == 'Visit'">
                        • {{slotProps.item.Details[0].Value}} <span v-if="parseInt(slotProps.item.Details[0].Value) == 1">page</span><span v-else>pages</span> viewed
                      </template>
                      
                    </small>
                    
                </template>
            </Timeline>
            <Timeline v-if="selectedType == 'touches'" :value="touches" align="left" class="customized-timeline">
                <template #marker="slotProps">
                    <span class="custom-marker shadow-2" :class="activitydispatcher[slotProps.item.Type].class">
                       <i class="fa-solid" :class="activitydispatcher[slotProps.item.Type].icon"></i>
                    </span>
                </template>
                <template #connector>
                  <div class="p-timeline-event-connector" style="width:2px; background: #C5C5C5"></div>
                </template>
                <template #content="slotProps">
                    <p>{{activitydispatcher[slotProps.item.Type].title}}: <b>{{slotProps.item.Details[0].Value}}</b></p>
                    <small>{{dateFormatter(slotProps.item.ActivityTime)}}
                      <template v-if="slotProps.item.Type == 'Mailout'">
                        • {{slotProps.item.Details[2].Value}} 
                      </template>

                    </small>

                </template>
            </Timeline>
            <Timeline v-if="selectedType == 'updates'" :value="updates" align="left" class="customized-timeline">
                <template #marker="slotProps">
                    <span class="custom-marker shadow-2" :class="activitydispatcher[slotProps.item.Type].class">
                       <i class="fa-solid" :class="activitydispatcher[slotProps.item.Type].icon"></i>
                    </span>
                </template>
                <template #connector>
                  <div class="p-timeline-event-connector" style="width:2px; background: #C5C5C5"></div>
                </template>
                <template #content="slotProps">
                    <p>{{activitydispatcher[slotProps.item.Type].title}}: <b>{{slotProps.item.Details[0].Value}}</b></p>
                    <small>{{dateFormatter(slotProps.item.ActivityTime)}}</small>
                    
                </template>
            </Timeline>
            <div v-if="loading" class="loading">
                <i class="fa-solid fa-sync fa-spin"></i>
            </div>
            <p v-if="error">
                {{ error }}
            </p>
          </ScrollPanel>

    </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue'

//import data from '../../db/data.json'
export default {
  props: ['lead', 'leadsId', 'csrfTknValue', 'csrfTknName'],

  setup(props) {
    const fetchLeadId = ref(props.leadsId)
    const activityHistory = ref([])
    const allActivities = ref([])
    const selectedActivities = ref(['typeadcampaign', 'typedownload','typeemailconsent', 'typeeventatt','typeeventreg', 'typeformsubmit', 'typevisit', 'typemailout', 'typecampaign', 'typeeventmiss' ])
    const filteredActivities = computed(()=> {
      if(selectedActivities.value.length == 0) {
        return []
      } else {
       return  activityHistory.value.filter(activity => 
           selectedActivities.value.indexOf(activitydispatcher[activity.Type].class) !== -1 
           
        )
      }
    })
    const touches = computed(() => allActivities.value.filter(activity => activitydispatcher[activity.Type].type === 'touch'))
    const interactions = computed(() => allActivities.value.filter(activity => activitydispatcher[activity.Type].type === 'interaction'))
    const updates = computed(() => allActivities.value.filter(activity => activitydispatcher[activity.Type].type === 'update'))
    const selectedType = ref()
    const csrfTknNam = ref(props.csrfTknName)
    const csrfTknVal = ref(props.csrfTknValue)
    const loading = ref(false)
    const loading2 = ref(false)
    const error = ref()
    const activitydispatcher = {
        'Mailout':                  {icon: 'fa-envelope', class:'typemailout',             title:'Email Sent',               type:'touch'},
        'Visit':                    {icon: 'fa-arrow-pointer', class:'typevisit',               title:'Visit',                    type:'interaction'},
        'Asset Download':           {icon: 'fa-download', class:'typedownload',            title:'Asset Download',           type:'interaction'},
        'Form Fill':                {icon: 'fa-pen-to-square', class:'typeformsubmit',          title:'Form Submission',          type:'interaction'},
        'Member Of Campaign':       {icon: 'fa-megaphone', class:'typecampaign',            title:'Campaign Member',          type:'update'},
        'Attended Event':           {icon: 'fa-microphone', class:'typeeventatt',            title:'Attended Event',           type:'interaction'},
        'Did Not Attend Event':     {icon: 'fa-microphone', class:'typeeventmiss',           title:'Missed Event',             type:'update'},
        'Registered For Event':     {icon: 'fa-microphone', class:'typeeventreg',            title:'Registered for Event',     type:'interaction'},
        'Responded to Ad Campaign': {icon: 'fa-brands fa-google', class:'typeadcampaign',          title:'Clicked on Ad Campaign',   type:'interaction'},
        'email consent granted':    {icon: 'fa-check', class:'typeemailconsentgranted', title:'Email Consent Granted',    type:'interaction'},
        'email consent revoked':    {icon: 'fa-xmark', class:'typeemailconsentrevoked', title:'Email Consent Revoked',    type:'interaction'},
        'tracking consent granted': {icon: 'fa-check', class:'typeemailconsentgranted', title:'Tracking Consent Granted', type:'interaction'},
        'tracking consent revoked': {icon: 'fa-xmark', class:'typeemailconsentrevoked', title:'Tracking Consent Revoked', type:'interaction'}
      }
    
    const activities = {
        'Interactions': [{
          name:'Ad Campaign Click',
            value: 'typeadcampaign'
          },{
          name: 'Asset Download',
            value: 'typedownload'
          },{
          name: 'Consent Change',
            value: 'typeemailconsent'
          },{
          name: 'Event Attendance',
            value: 'typeeventatt'
          },{
          name: 'Event Registration',
            value: 'typeeventreg'
          },{
          name: 'Form Submission',
            value: 'typeformsubmit'
          },{
          name: 'Visit',
            value: 'typevisit'
          }]
        ,
      'Touches': 
       [ {
          name: 'Email Sent' ,
          value: 'typemailout'
        }
      ],
      'Updates': [{
          name:  'Campaign Member',
          value: 'typecampaign'
        },{
          name: 'Missed Event' ,
          value: 'typeeventmiss'
        }]
      
    }
    
    

    const showOnlyInteractions = () => {
      loading2.value = true
      if (selectedType.value == 'interactions' ) {
        selectedType.value = ''
        selectedActivities.value = ['typeadcampaign', 'typedownload','typeemailconsent', 'typeeventatt','typeeventreg', 'typeformsubmit', 'typevisit', 'typemailout', 'typecampaign', 'typeeventmiss' ]
      } else {
        selectedType.value = 'interactions'
        selectedActivities.value = activities['Interactions'].map(item => item.value)
      }
      loading2.value = false
    }

    const showOnlyTouches = () => {
      loading2.value = true
      if (selectedType.value == 'touches' ) {
        selectedType.value = ''
        selectedActivities.value = ['typeadcampaign', 'typedownload','typeemailconsent', 'typeeventatt','typeeventreg', 'typeformsubmit', 'typevisit', 'typemailout', 'typecampaign', 'typeeventmiss' ]
      } else {
        selectedType.value = 'touches'
        selectedActivities.value = activities['Touches'].map(item => item.value)
      }
      loading2.value = false
    }

    const showOnlyUpdates = () => {
      loading2.value = true
      if (selectedType.value == 'updates' ) {
        selectedType.value = ''
        selectedActivities.value = ['typeadcampaign', 'typedownload','typeemailconsent', 'typeeventatt','typeeventreg', 'typeformsubmit', 'typevisit', 'typemailout', 'typecampaign', 'typeeventmiss' ]
      } else {
        selectedType.value = 'updates'
        selectedActivities.value = activities['Updates'].map(item => item.value)
      }
      loading2.value = false
    }

   


    onMounted(() => {
      
      getActivityHistory()
      
                
      //activityHistory.value = allActivities.value
    })

    const getActivityHistory = () => {
      loading.value = true
      let formData = new FormData()
      formData.append(csrfTknNam.value, csrfTknVal.value )
      formData.append('custid', fetchLeadId.value)
      formData.append('srv', 'jservice')
      const request = {
              method: 'POST',
              body: formData
            }

      fetch(`/service/prospect/getactivityhistory`, request)
          .then(async response => {
              const data = await response.json()
              // check for error response
              if (!response.ok) {
              // get error message from body or default to response status
              const error = (data && data.message) || response.status
              return Promise.reject(error)
              }
                allActivities.value = data.o
                activityHistory.value = allActivities.value
                loading.value = false
              })
          .catch(error => {
              //toast.add({severity:'error', summary:'Error', detail: error, life: 3000})
              return error;
          })
      }

      const dateFormatter = (date) => {
       let convertedDate = new Date(date)
       return convertedDate.toLocaleString('en-US', {
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit
            month: 'long', // numeric, 2-digit, long, short, narrow
          
        })
      }

      const equalArrays = (a, b) => {
        if (a.length !== b.length) return false;
        const uniqueValues = new Set([...a, ...b]);
        for (const v of uniqueValues) {
          const aCount = a.filter(e => e === v).length;
          const bCount = b.filter(e => e === v).length;
          if (aCount !== bCount) return false;
        }
        return true;
      }

    watch(selectedActivities, (newValue) => {
        const touchesArray = ['typemailout']
        const updatesArray = ['typecampaign', 'typeeventmiss']
        const interactionsArray = ['typeadcampaign', 'typedownload','typeemailconsent', 'typeeventatt','typeeventreg', 'typeformsubmit', 'typevisit']
        console.log(equalArrays(interactionsArray, newValue))
        console.log(equalArrays(updatesArray, newValue))
        console.log(equalArrays(touchesArray, newValue))
        if (equalArrays(interactionsArray, newValue)) {
          selectedType.value = 'interactions'
        } else if (equalArrays(updatesArray, newValue)) {
          selectedType.value = 'updates'
        } else if (equalArrays(touchesArray, newValue)) {
          selectedType.value = 'touches'
        } else {
          selectedType.value =''
        }
      

    }) 


    return {
       touches, interactions, updates, fetchLeadId, csrfTknNam, csrfTknVal, getActivityHistory, activityHistory, dateFormatter, activitydispatcher,
        showOnlyInteractions, showOnlyTouches, showOnlyUpdates, selectedType, allActivities, loading,loading2, error, activities, selectedActivities,
        filteredActivities

    }
  }

}
</script>
<style lang="scss" scoped>
  .checkbox-filters {
    font-size: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
   ul {
     margin:12px 0;
     li {
       margin-bottom: 8px;
       &:last-child {
         margin-bottom: 0;
       }
     }
   }
  }
  
  .activity-summary-boxes {
    display: flex;
    width: 100%;
    margin-bottom: 24px;
    justify-content: space-between;
    > div {
      cursor: pointer;
      flex: 1;
      padding: 16px;
      border: 1px solid transparent;
      &.active {
        border: 1px solid #1499D6;
        background: #ECF8FD;
      }
      &:hover {
        border: 1px solid #1499D6;
        background: #ECF8FD;
      }
    }
  }
  .loading {
      text-align: center;
      margin: auto;
      height: 56px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
  }
  h3 span {
    font-size: 12px;
  }
  p, small {
    font-size: 14px;
    line-height: 20px;
    font-weight: 300;
  }

  b {
    font-weight: 400;
  }
</style>


