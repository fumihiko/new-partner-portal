<template>
  <div class="tab-content">
    <transition name="p-message" tag="div">
      <Message  v-if="v$.$invalid && submitted"  severity="error">
        <p v-if="v$.responseType.$invalid">Response Type is required.</p>
        <p v-if="state.responseType && state.responseType == 'Meeting'">
          <span v-if="v$.meetingTime.$invalid">Meeting Time is required.</span>
        </p>
        <p v-if="v$.opportunityLevel.$invalid">Opportunity Level is required.</p>
      </Message>
    </transition>
    <Toast />
    <div id="response-form">
        <h3>Add a Sales Rep Response for <strong>{{ lead.prospectFirstName }} {{ lead.prospectLastName }}</strong></h3>
        <form class="form-group" @submit.prevent="handleSubmit(!v$.$invalid)">
          <div id="response-type" class="input-group">
            <label for="responseType" :class="{'p-error':v$.responseType.$invalid && submitted}">Response Type</label>
            <Dropdown id="responseType" :class="{'p-invalid':v$.responseType.$invalid && submitted}" v-model="v$.responseType.$model" :options="responseTypes" @change="changeResponseType" optionLabel="name" optionValue="value"  />
          </div>
          <div id="meeting-time">
            <div v-if="state.responseType && state.responseType == 'Meeting'" class="input-group">
              <label for="meetingTime" :class="{'p-error':v$.meetingTime.$invalid && submitted}">Meeting Time</label>
              <Calendar id="meetingTime" :class="{'p-invalid':v$.meetingTime.$invalid && submitted}" v-model="v$.meetingTime.$model" :showTime="true" :showSeconds="false" />
              
            </div>
          </div>
          
          <div id="opportunity-level" class="input-group">
            <label for="opportunityLevel" :class="{'p-error':v$.opportunityLevel.$invalid && submitted}">Opportunity Level</label>
            <Dropdown id="opportunityLevel" :class="{'p-invalid':v$.opportunityLevel.$invalid && submitted}" v-model="v$.opportunityLevel.$model" :options="opportunityLevels" @change="changeOpportunityLevel" optionLabel="name" optionValue="value"  />
          </div>
          <div id="notes-wrapper" class="input-group">
            <label for="notes">Add Notes</label>
            <Textarea id="notes"  v-model="notes" />
          </div>

          <div class="btn-group">
            <button class="btn" type="button" @click="close">Cancel</button>
            <button type="submit" class="btn btn-primary" >Submit</button> 
          </div>  
        </form>  
      </div>
    </div>
    <hr>
    <div id="response-history">
      <h3>Sales Rep Responses</h3>
      <div v-if="loading" class="loading">
          <i class="fa-solid fa-sync fa-spin"></i>
      </div>

      <ScrollPanel style="width: 100%; height: 140px">
         <Timeline v-if="!loading && leadResponses" :value="leadResponses" align="left" class="customized-timeline">
                <template>
                    <span class="custom-marker shadow-2">
                       <i class="fa-solid fa-reply"></i>
                    </span>
                </template>
                <template #connector>
                  <div class="p-timeline-event-connector"></div>
                </template>
                <template #content="slotProps">
                    <p>{{slotProps.item}}: <b>{{slotProps.item}}</b></p>
                    <small>{{slotProps.item}} 
                     
                    </small>
                    
                </template>
            </Timeline>
      </ScrollPanel>
    </div> 
    
</template>

<script>
import { reactive, computed, ref, onMounted } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useToast } from 'primevue/usetoast'

export default {
  props: ['lead', 'leadsId'],
  setup(props, {emit}) {
    const leadData = ref(props.lead)
    const fetchLeadId = ref(props.leadsId)
    const submitted = ref(false)
    const toast = useToast()
    const notes = ref(null)
    const leadResponses = ref([])
    const loading = ref(false)
    // const meetingTime = ref(null)
    const responseTypes = ref([
            {name: 'Meeting', value: 'Meeting'},
            {name: 'Conversation', value: 'Conversation'},
            {name: 'Left Voicemail 1', value: 'Left Voicemail 1'},
            {name: 'Left Voicemail 2', value: 'Left Voicemail 2'},
            {name: 'Spoke to Admin', value: 'Spoke to Admin'},
            {name: 'Referral', value: 'Referral'},
            {name: 'No Interest', value: 'No Interest'},
            {name: 'Bad Phone Number', value: 'Bad Phone Number'},
            {name: 'Other', value: 'Other'}
                   
            
        ])

    const opportunityLevels = ref([
            {name: '$5K', value: 5000},
            {name: '$10K', value: 10000},
            {name: '$50K', value: 50000},
            {name: '$75K', value: 75000},
            {name: '$100K', value: 100000},
            {name: '$250K', value: 250000},
            {name: '$500K', value: 500000},
            {name: '$1M+', value: 1000000}
        ])

    const state = reactive({
            responseType: '',
            opportunityLevel: '',
            meetingTime: ''
        })

    const rules = computed(() => {
      const localRules = {
        responseType: { required },
        opportunityLevel: { required }
      }
      if (state.responseType == 'Meeting') {
        localRules.meetingTime = {
          required
        }
      }
      return localRules
    })

    const v$ = useVuelidate(rules, state)

    const changeOpportunityLevel = ($event) => {
      state.opportunityLevel = $event.value
    }

    const changeResponseType = ($event) => {
      state.responseType = $event.value
    }

    
    const close = () => {
        emit('close')
    }

     const getLeadResponses = async () => {
            loading.value = true
            const request = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            accountId: `${window.u.aid}`,
                            leadId: leadData.value.id
                        })
                    }

            fetch(`/api/leadservice?uri=leadservice/api/getLead`, request)
                .then(async response => {
                    const data = await response.json()
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status
                        return Promise.reject(error)
                    }
                    leadResponses.value = data.o.leadAlerts.leadResponses
                    loading.value = false
                })
                .catch(error => {
                    toast.add({severity:'error', summary:'Error', detail: error, life: 3000})
                    return error;
                })
        }

    const submitResponseLead = () => {
  
      const localtimeNow = new Date().toISOString()  
  
      const request = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
              {
                accountId: `${window.u.aid}`,
                userId:`${window.u.uid}`,
                partnerId: `${window.u.at}`,
                ownerId:`${ window.u.uid }`,
                prospectId: fetchLeadId.value,
                startDate: localtimeNow,
                endDate: localtimeNow,
                response:{
                  responseType: state.responseType,
                  meetingTime: `${state.meetingTime ? new Date(state.meetingTime).toISOString() : ''}`,
                  opportunity: state.opportunityLevel,
                  notes: notes.value,
                  submitted: localtimeNow
                }
              }
            )
          }

      fetch(`/api/leadservice?uri=leadservice/api/submitResponseLead`, request)
      .then(async response => {
        const data = await response.json()
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status
          return Promise.reject(error)
        }
        toast.add({severity:'success', summary:'Response sent', detail:`Response was submitted sucessfully`, life: 3000})
        emit('close')

        
      })
      .catch(error => {
        toast.add({severity:'error', summary:'Error', detail: error, life: 3000})
        return error;

      })
}

    const handleSubmit = (isFormValid) => {
            submitted.value = true

            if (!isFormValid) {
                return
            }

            
        submitResponseLead()
    }

    

    onMounted(() => {
      getLeadResponses()
    })

    return {
      state, v$, leadData, close,loading, handleSubmit, submitted, fetchLeadId, changeOpportunityLevel,changeResponseType, submitResponseLead, responseTypes, opportunityLevels, notes, getLeadResponses, leadResponses
    }
  }
   
}
</script>
<style lang="scss" scoped>
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
  h3 {
    margin-bottom: 24px;
  }
  strong {
    font-weight: 400;
  }
  #response-form {
    padding: 32px 32px 0 ;
  }
  #response-history {
    padding: 32px;
  }
  .form-group {
    display: grid;
    
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 32px;
    div#response-type {
      grid-area: ResponseType;
    }

    div#meeting-time {
      grid-area: MeetingTime;
    }

    div#opportunity-level {
      grid-area: OpportunityLevel;
    }
    div#notes-wrapper {
      grid-area: Notes;
    }

    .btn-group {
      grid-area: ButtonGroup;
    }
    grid-template-areas:
      "ResponseType MeetingTime"
      "OpportunityLevel OpportunityLevel"
      "Notes Notes"
      "ButtonGroup ButtonGroup"
      
      ;

      label {
        margin-bottom: 8px;
      }
  }
</style>