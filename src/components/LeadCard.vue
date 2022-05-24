<template>
    <li>
      <ul>
        <li>
          <div  class="profile-pic" :class="leadStatus">
            <i class="fa-solid fa-circle-user"></i>
          </div>
        </li>
        <li>
          <router-link  :to="`/p/leads/${lead.prospectId}/lead`">
            <b>{{lead.prospectName}}</b>
            <span>{{lead.prospectEmail}}</span>
            <span>{{lead.phone}}</span>
          </router-link>
        </li>
        <li>
          <span>{{lead.companyName}}</span>
          <span>{{lead.title}}</span>
        </li>
        <li>
          <span>{{lead.state}}</span>
        </li>
        <li>
          <span>{{lead.mqlType}}</span>
        </li>
        <li>
          <span v-if="leadsOrAlertsValue.value == 1">{{lead.userName}}</span>
          <span v-if="leadsOrAlertsValue.value == 1">({{lead.userEmail}})</span>
        </li>
        <li>
          <span>{{lead.responses === null ? 0 : lead.responses.length}} {{lead.responses === null ? 'response' : lead.responses.length === 1  ? 'response' : 'responses'}}</span>
        </li>
        <li>
          <router-link  :to="`/p/leads/${lead.prospectId}/response`">
            <i class="fa fa-plus"></i>
          </router-link>
        </li>
      </ul>
    </li>
  
              
 
  
</template>

<script>
import Pill from '@/components/Pill.vue'
import { ref } from 'vue'

export default {
  name: "LeadCard",
  components: {
    Pill
  } , 
  props: ['lead', 'leadsOrAlertsValue'],
  setup(props) {
    const leadStatus = ref(props.lead.status === 0 ? 'inactive' : props.lead.status === 1 ? 'active' : props.lead.status === 2 ? 'bad-email' : 'opted-out')
    
    
    return {
      leadStatus,
     
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';
  b {
    font-weight: 400;
  }
  ul {
    display: grid;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 32px  2fr 2fr 1fr 2fr 2fr 1fr 32px;
    a {
      text-decoration: none;
      color: inherit;
  
         display: flex;
      flex-direction: column;
      
    }
    li {
      display: flex;
      flex-direction: column;
      line-height: 24px;
    }
  }
@media (prefers-color-scheme: dark) {
  li:nth-child(even) {
    background-color: $dark-list-background-color-even;
  }

}
</style>
