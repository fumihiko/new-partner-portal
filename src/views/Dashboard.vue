<template>
  <main id="dashboard">
    <header>
      <h1 class="page-title">Dashboard</h1>
      <TimeFrameDropdown :custom-time-frame="customTimeFrame" :time-frame="timeFrame" @changeTimeFrame="changeTimeFrame" @changeCustomTimeFrame="changeCustomTimeFrame" />
    </header>
    <PartnerReachSection :time-frame="timeFrame" :custom-time-frame="customTimeFrame" />
    <MarketingQualifiedLeadsSection :time-frame="timeFrame" :custom-time-frame="customTimeFrame" />
    <OverallPerformanceSection :time-frame="timeFrame" :custom-time-frame="customTimeFrame" />
    <Leaderboard  :user-role="userRole" :time-frame="timeFrame" :custom-time-frame="customTimeFrame" />
  </main>
  <!-- <Modal @close="toggleModal" :modalActive="modalActive">
    <div class="modal-content">
      <h1>This is a modal.</h1>
      <p>This is p</p>
    </div>
  </Modal>
  <button @click="toggleModal" type="button">Open Modal</button> -->
</template>

<script>

//import ResponsivePieChart from '@/components/ResponsivePieChart.vue'
import Leaderboard from '@/components/Leaderboard.vue'
import TimeFrameDropdown from '@/components/Dropdowns/TimeFrameDropdown.vue'
//import fetchPPdata from '@/use/fetch'

// import MetricCard from '@/components/MetricCard.vue'
//import Modal from '@/components/Modal.vue'
import { ref, onMounted } from 'vue'
import PartnerReachSection from '../components/PartnerReachSection.vue'
import MarketingQualifiedLeadsSection from '../components/MarketingQualifiedLeadsSection.vue'
import OverallPerformanceSection from '../components/OverallPerformanceSection.vue'

export default {
  name: "Dashboard",
  components: {
   //  ResponsivePieChart,
   Leaderboard,
   TimeFrameDropdown,
    PartnerReachSection,
    MarketingQualifiedLeadsSection,
    OverallPerformanceSection
 },
 setup() {
  const modalActive = ref(false)
  const timeFrame = ref(90)
  const customTimeFrame = ref([])
  const userRole = ref()
   const toggleModal = () => {
     modalActive.value = !modalActive.value;
   }

   const changeTimeFrame = ($event) => {
     timeFrame.value = $event.value
   }

  const changeCustomTimeFrame = ($event) => {
    customTimeFrame.value = $event.value
  }
  
  const determineRole = () => {
    const featuresList = window.u.f
    userRole.value = featuresList.indexOf(100) > 0 ? 'partnerManager' : 'salesRep'
  }

  onMounted(() => {
            
            determineRole()
        })
  

   return { modalActive, toggleModal, timeFrame, changeTimeFrame, customTimeFrame, changeCustomTimeFrame, determineRole, userRole
   }
 }
};
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
      
      font-weight: 500;
    }
    &.metric-card {
      padding: 0;
    }
  }
  dl {
    display: grid;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 12px 24px 2fr 1fr 1fr 1fr 1fr 1fr;
     grid-gap: 2%;
    dt {
      display: block;;
    }
    dd {
      display: flex;
      flex-direction: column;
    }
  } 
  
  
  
</style>
