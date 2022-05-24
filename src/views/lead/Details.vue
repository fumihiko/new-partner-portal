<template>
    
    <div class="tab-content">
        <Toast />
        <ConfirmDialog></ConfirmDialog>
         <!-- <Dialog v-model:visible="displayConfirmation">
             <div class="confirmation-content modal">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Are you sure you want to opt-out {{ lead.first_name }} {{ lead.last_name }}?</span>
            </div>
             <template #footer>
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="btn p-button-text"/>
                <Button label="Yes" icon="pi pi-check" @click="closeConfirmation" class="btn p-button-text" autofocus />
            </template>
         </Dialog> -->
         <ScrollPanel style="width: 100%; height: 264px">
            <div class="detail-header">
                <div  class="profile-pic">
                    <i class="fa-solid fa-circle-user"></i>
                </div>
                <div class="basic-info">
                    <h2>{{ lead.prospectFirstName }} {{ lead.prospectLastName }}</h2>
                    <p><span v-if="lead.title">{{ lead.title}},</span> <span v-if="lead.companyName">{{ lead.companyName }}</span></p>
                    <p><pill :class="leadStatus">{{ leadStatus }}</pill>
                    <pill v-show="leadStatus != 'opted-out'" class="button" @click="optoutConfirm">Opt-out</pill></p>
                </div>
            </div>
            
            <div class="contact-info">
                <div>
                    <i class="fa-solid fa-envelope"></i> <a :href="makeEmailLink(lead.prospectEmail)"><span>{{ lead.prospectEmail }}</span></a>
                </div>
                <div>
                    <span v-if="lead.phone"><i class="fa-solid fa-phone-rotary"></i><a :href="makePhoneLink(lead.phone)"> {{ lead.phone }}</a></span> <br>
                    <span v-if="lead.phone2"><i class="fa-solid fa-phone-rotary"></i> <a :href="makePhoneLink(lead.phone2)">{{ lead.phone2 }}</a></span> 
                    
                </div>
                <div  class="address">
                    <div>
                        <i class="fa-solid fa-building"></i> 
                    </div>
                    <div>
                        <span v-if="lead.address">{{ lead.address }}<br></span> 
                        <span v-if="lead.address2">{{ lead.address2 }}<br></span> 
                        <span v-if="lead.address3">{{ lead.address3 }}<br></span>
                        <span v-if="lead.city">{{ lead.city }},</span> <span v-if="lead.state">{{ lead.state }}</span> <span v-if="lead.zip">{{ lead.zip }}</span><span v-if="lead.city || lead.state || lead.zip"><br></span>
                        <span v-if="lead.country">{{ lead.country }}</span>
                    </div>
                    
                        
                    
                </div>
            </div>
            <template v-for="(customField, index) in lead.customFields" :key="index">
                <div v-if="customField.value" class="additional-info" >
                    <label>{{ customField.label }}</label>
                    <p>{{ customField.type == 'Date' ? convertedDate(customField.value) : customField.value }}</p> 
                </div>
            </template>
        </ScrollPanel>
        
        <div class="btn-group">
            <button type="button" class="btn" @click="close">Close</button> 
        </div>

            
    </div>
   
</template>

<script>

import { ref,  } from 'vue'

import Pill from '@/components/Pill.vue'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

export default {
    components: {
        Pill
        
    },
    props: ['lead', 'displayModal', 'leadsId' ],
    setup(props, {emit}) {
        const confirm = useConfirm()
        const toast = useToast()
        
        const fetchLeadId = ref(props.leadsId)
        const leadStatus = ref(props.lead.prospectStatus == 0 ? 'inactive' : props.lead.prospectStatus == 1 ? 'active' : props.lead.prospectStatus == 2 ? 'bad-email' : 'opted-out')
        const makeEmailLink = (email => {
            return `mailto:${email}`
        })

        const makePhoneLink = (phone => {
            return `tel:+1${phone}`
        })

         const convertedDate = (str) => {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
            const d = new Date(str)
            const year = d.getFullYear() 
            const date = d.getDate() 
            const monthIndex = d.getMonth()
            const month = months[monthIndex]
            return `${month} ${date}, ${year}`                   
                
            
        }

        const optoutConfirm = () => {
            confirm.require({
                message: `Are you sure you want to opt-out ${ props.lead.prospectFirstName } ${ props.lead.prospectLastName }?`,
                header: 'Opt-out Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    optOutLead()
                },
                reject: () => {
                    toast.add({severity:'warn', summary:'Canceled', detail:'Opt-out canceled', life: 3000})
                }
            });
        }

        const optOutLead = () => {
  
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
                        ownerId:0,
                        prospectId: fetchLeadId.value,
                        startDate: localtimeNow,
                        endDate: localtimeNow
                    }
                    )
                }

                    fetch(`/api/leadservice?uri=leadservice/api/optOutLead`, request)
                    .then(async response => {
                        const data = await response.json()
                        // check for error response
                        if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status
                        return Promise.reject(error)
                        }
                        toast.add({severity:'success', summary:'Opted-Out', detail:`${props.lead.prospectFirstName} ${props.lead.prospectLastName} was opted-out sucessfully`, life: 3000})
                        console.log(data.o) 
                        emit('getLead')
                    })
                    .catch(error => {
                        toast.add({severity:'error', summary:'Error', detail:'Opt-out failed', life: 3000})
                        return error;
                        // debugging
                    // console.error('There was an error!', error)
                        //
                    })
                }
               

            const close = () => {
                emit('close');
       }

    //   watch(() => props.lead, (newValue) => {
            
    //     })  

        return { optOutLead, optoutConfirm, close, leadStatus, fetchLeadId, makeEmailLink, makePhoneLink, convertedDate}
        
    }  
}
</script>

<style lang="scss" scoped>
    .detail-header {
        margin-bottom: 24px;
        grid-gap: 24px;
        display: grid;
        grid-template-columns: 80px 1fr;
        grid-template-areas: 
        "pp bi"
        ;
    }
    
    .profile-pic {
      grid-area: pp; 
      svg {
          font-size: 80px;
      line-height: 80px; 
      height: 80px;
      }
      
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    .basic-info {
        grid-area: bi;
    }

    .contact-info {
        margin-bottom: 24px;
        line-height: 28px;
        svg.svg-inline--fa {
            margin-right: 16px;
            width: 16px;
        }
        
    }

    .address {
        display: flex;

        
    }

    .additional-info {
        margin-bottom: 24px;
        label {
            font-size: 12px;
        }
    }

    .btn-group {
        grid-area: bg;
        justify-content: end;
        display: flex;
    }
    
    .tab-content {
        padding: 32px;
        h2, p {
            text-transform: unset;
            line-height: 30px;
            margin: 0;
        }
    }
    .confirmation-content {
        padding: 32px;
    }
</style>