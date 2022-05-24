<template>
    <Dropdown v-model="selectedLeadStatus" @change="updateLeadStatus" :options="leadStatus" optionLabel="name" optionValue="id" placeholder="Select Lead Status" />
</template>

<script>

import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

export default {
    
    setup(props, {emit}) {
        const selectedLeadStatus = ref();
        
        const leadStatus = ref([
            {name: 'All Leads', id: 0},
            {name: 'Pending Leads', id: 1},
            {name: 'Leads Responded', id: 2}
        ]);
        const route = useRoute()
        onMounted(() => {
            selectedLeadStatus.value = route.query.leadStatus ? parseInt(route.query.leadStatus) : 0
        })
        
        
        const updateLeadStatus = () => {
            emit('changeLeadStatus', selectedLeadStatus)
        }

        

        return { selectedLeadStatus, leadStatus, updateLeadStatus}
    },
    
}

</script>

<style lang="scss" scoped>
    @import '../../assets/sass/_variables.scss';
    
    
</style>
