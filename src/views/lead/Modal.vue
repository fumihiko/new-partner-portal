<template>
    <div v-if="lead">
     <Toast />
        <Dialog v-model:visible="displayModal" :dismissableMask="true" :style="{width: '645px'}"  class="lead-modal" :modal="true">
            <div class="modal">
                <ul class="tab">
                <li class="tab-nav">
                    <router-link :to="{ name: 'Details' }">Lead</router-link>       
                </li>
                <li class="tab-nav">
                    <router-link :to="{ name: 'Activity' }">Activity</router-link>
                </li>
                <li class="tab-nav">
                    <router-link :to="{ name: 'Response' }">Response</router-link>
                </li>
            </ul>
            <router-view v-if="!loading && lead && csrfTknValue" :lead="lead" :leadsId="leadsId" @get-lead="getLead" @close="closeModal" :csrfTknName="csrfTknName" :csrfTknValue="csrfTknValue"  :displayModal="displayModal" />
            <div v-if="loading" class="loading">
                <i class="fa-solid fa-sync fa-spin"></i>
            </div>
            <p v-if="error">
                {{ error }}
            </p>
            <!-- <router-view  :lead="lead" :leadsId="leadsId" @close="closeModal"  :displayModal="displayModal" /> -->
            
            </div>
        </Dialog>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRouter,
//useRoute    
        } from 'vue-router'
import { useToast } from 'primevue/usetoast'

export default {

    
    props: ['leadsId'],


    setup(props) {
        const router = useRouter()
        const toast = useToast()
        //const route = useRoute()
        const displayModal = ref(true)
        const loading = ref(false)
        const error = ref(null)
        const thisLeadId = ref(props.leadsId)
        const lead = ref({})
        const csrfTknValue = ref()
        const csrfTknName = ref()

        // For local testing
       // const csrfTknValue = ref('value')
       
        
        // const lead = ref({
        //   id:127,
        //   prospectFirstName:'Steve',
        //   prospectLastName: 'Sanders',
        //   prospectEmail: 'steve.sanders@bh.com',
        //   phone: 4154567890,
        //   companyName: 'Hearty House Hearty House Hearty House ',
        //   title: 'Marketing Director Marketing Director Marketing Director',
        //   state: 'CA',
        //   sales_rep: 'John Doe',
        //   sales_rep_email: 'john.doe@etrigue.com',
        //   status: 3,
        //   response:2,
        //   mql_type: 'Engaged Visitor',
        //   ownerUserId:64
        // })
        
        const position = ref('center')
        
        const getLead = () => {
            loading.value = true
            const request = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            accountId: `${window.u.aid}`,
                            prospectId: thisLeadId.value
                        })
                    }

            fetch(`/api/leadservice?uri=leadservice/api/getProspectDetails`, request)
                .then(async response => {
                    const data = await response.json()
                    // check for error response
                    if (!response.ok) {
                        // get error message from body or default to response status
                        const error = (data && data.message) || response.status
                        return Promise.reject(error)
                    }
                    lead.value = data.o.leadAlerts
                    loading.value = false
                })
                .catch(error => {
                    toast.add({severity:'error', summary:'Error', detail: error, life: 3000})
                    return error;
                })
        }
       
        
        const openModal = () => {
            displayModal.value = true;
        }

        const closeModal = () => {
            displayModal.value = false
            setTimeout(() => {
                router.push({name: 'Leads'})
            }, 1000);
            
        }

        const submitResponse = () => {
            displayModal.value = false
            setTimeout(() => {
                router.push({name: 'Leads'})
            }, 1000);
            
        }
       

       
       onMounted( () => {
        getLead()
        loading.value = true
        axios.get(`/prospects/details/${thisLeadId.value}`)
            .then(async response => {
            const data = response.data
            
            let parser = new DOMParser()
            const doc = parser.parseFromString(data, 'text/html')
            const scripts = doc.getElementsByTagName('script')
            const script = scripts[scripts.length-3]
            const scriptArray = script.text.substring(script.text.indexOf('var csrfTknName'), script.text.lastIndexOf('";')).split('"')
            csrfTknName.value = scriptArray[1]
            csrfTknValue.value = scriptArray[3]
            loading.value = false
            })

        })

    watch(displayModal, (newValue) => {
        if(newValue == false) {
            setTimeout(() => {
                router.push({name: 'Leads'})
            }, 1000);
        }
       
    })

        
       
        // const openPosition = (pos) => {
        //     position.value = pos;
        //     displayPosition.value = true;
        // };
        // const closePosition = () => {
        //     displayPosition.value = false;
        // };

        return {  
            displayModal, 
            position, 
            openModal, 
            closeModal,
            submitResponse,
            thisLeadId,
            getLead,
            lead,
            loading,
            error,
            csrfTknValue,
            csrfTknName,
    
            }
    }
}
</script>

<style scoped lang="scss">
 @import '../../assets/sass/_variables.scss';
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
    .modal, .lead-modal {
        z-index: 99;
        background-color: #ffffff;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        margin: 0;
        width: 100%;
        max-width: 645px;
        height: auto;
        border-radius: 4px;
        transition-property: top;
        transition-duration: 900ms;
        min-height: 480px;
    }

    .tab {
        display: flex;
        border-bottom: 1px solid $border-color;
        padding: 0 32px;
        .tab-nav {
            a {
                text-decoration: none;
                color: inherit;
                display: block;
                padding: 32px;
                opacity: .5;
                &.router-link-exact-active {
                    color: #323232;
                    border-bottom: 1px solid $primary-color;
                }
            }
        }
    }

    // .modal:not(.open) {
    //     /* display: none; */
    // }

    .modal.open {
        animation: fadeup 250ms;
    }
     .tab-content {
        padding: 32px;
    }
    @keyframes fadeup {
        from { opacity: 0; top: 53%; }
        to { opacity: 1; top: 50%; }
    }

    .modal .actions {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
@media (prefers-color-scheme: dark) {
  .modal {
    background-color: $dark-background-color;
  }

  .tab {
      .tab-nav {
          a {
              &.router-link-exact-active {
                  color: $dark-body-text-color;
              }
          }
      }
  }

}
</style>