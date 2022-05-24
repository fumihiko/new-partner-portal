<template>
  <li class="sales-rep-card">
    <div class="row">
      
      <span>
        <i v-if="sales.total==1" class="fa-solid fa-trophy-star"></i>
        {{sales.total}}
      </span>
      <span>
        <div  class="profile-pic">
          <i class="fa-solid fa-circle-user"></i>
        </div>
      </span>
      <span v-if="userRole == 'partnerManager'">
        <router-link  :to="{ name: 'Leads', query: { timeFrame: fetchTimeFrame, salesRep: sales.userId } }"> {{sales.salesRep}}</router-link>
      </span>
      <span v-else>
         {{sales.salesRep}}
      </span>
      <span>
        <span>{{sales.totalLeads}}</span>
      </span>
      <span>
        <span>{{sales.pendingLeads}}</span>
      </span>
      <span>
        <span>{{sales.leadsResponded}}</span>
      </span>
      <span>
        <span>{{formattedValue}}</span>
      </span>
      <span>
        <span>{{convertMsToHM}}</span>
      </span>
    </div>
    <!-- <div v-if="index == 0" class="gold-shimmer"></div> -->
  </li>
</template>

<script>
import { ref } from 'vue'
export default {
  name: "salesCard",
  
  props: {
    sales: Object,
    index: Number,
    timeFrame: Number,
    userRole: String
  },
  setup(props) {
    const fetchTimeFrame = ref(props.timeFrame)
    const thisUserRole = ref(props.userRole)

    return { fetchTimeFrame, thisUserRole }
  },
  computed: {

    

    convertMsToHM() {
      let milliseconds = this.sales.avgResponseTime
      if (milliseconds === 0) {
        return '0 minute'
      }
      let seconds = Math.floor(milliseconds / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);

      seconds = seconds % 60;
      // 👇️ if seconds are greater than 30, round minutes up (optional)
      minutes = seconds >= 30 ? minutes + 1 : minutes;

      minutes = minutes % 60;

      
      // hours = hours % 24;

      return `${hours > 1 ? hours + ' hours': hours == 1 ? '1 hour' : '' } ${minutes > 1 ? minutes + ' minutes' : minutes == 1 ? '1 minute' : '0 minutes'}`;
    },

    formattedValue() {
      return `$${this.sales.opportunityValues.toLocaleString()}`
    }, 

    formattedTime() {
      return `${this.sales.avgResponseTime} mins`
    }, 
  }
};
</script>

<style lang="scss" scoped>
@import '../assets/sass/_variables.scss';
  li {
    border: 1px solid $border-color;
    border-radius: 4px;
    padding: 8px 32px;
    margin: 0 0 16px 0;
    box-shadow: 0px 1px 2px 0px #BFBFBF;
    font-weight: 100;
    &:nth-child(odd) {
      background-color: $list-background-color-even;
    }
  }
  .row {
    display: grid;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    grid-template-columns: 12px 24px 2fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 2%;
    a {
      text-decoration: none;
      color: inherit;
    }
    > span {
      display: flex;
      flex-direction: column;
      position: relative;
      svg {
        position: absolute;
        left: -24px;
        top: 1px;
      }
      
    }
  } 

  .gold-shimmer {
  position: absolute;
  display: block;
  top: -50%;
  left: -50%;
  z-index: -9;
  display: block;
  height: 200%;
  width: 200%;
  transform: rotate(-45deg);
  overflow: hidden;
  background: linear-gradient(to right, #fff 20%, #fff 40%, #ECD08C 50%, #ECD08C 55%, #fff 70%, #fff 100%);
  background-size: 200% auto;
  
  animation: shine 3s linear infinite;
}

/*Begin shimmer code*/

@keyframes shine {
    to {
      background-position: 200% center;
    }
  }
  @media (prefers-color-scheme: dark) {
  li:nth-child(odd) {
    background-color: $dark-list-background-color-even;
  }

 

}
</style>
