<template>
    <div>
        <!-- <Button label="Show" icon="pi pi-external-link" @click="openModal" /> -->
        <Dialog header="Header" v-model:visible="displayModal" :style="{width: '50vw'}" :modal="true">
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
            <router-view :lead="lead" />
        </Dialog>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
     props: ['leadId'],
   data() {
    return {
      lead: {
          id:127,
          first_name: 'Steve',
          last_name: 'Sanders',
          email: 'steve.sanders@bh.com',
          phone: 4154567890,
          company: 'Hearty House',
          joib_title: 'Marketing Director',
          state: 'CA',
          sales_rep: 'John Doe',
          sales_rep_email: 'john.doe@etrigue.com',
          status: 'active',
          response:2,
          mql_type: 'Engaged Visitor'
        }
    };
  },
    setup() {
        
        const displayModal = ref(true);
       
        
        
        const position = ref('center');

        const openModal = () => {
            displayModal.value = true;
        };
        const closeModal = () => {
            displayModal.value = false;
        }
       
       
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
            closeModal
            }
    }
}
</script>

<style scoped lang="scss">
.p-button {
    margin: 0.3rem .5rem;
    min-width: 10rem;
}

p {
    margin: 0;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-dialog .p-button {
    min-width: 6rem;
}
</style>