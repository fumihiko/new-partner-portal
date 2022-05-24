<template>
    <Dropdown v-model="selectedSortBy" @change="updateSortBy" :options="sortBy" optionLabel="name" optionValue="value" placeholder="Sort By" />
</template>

<script>

import { ref } from 'vue'

export default {
    
    setup(props, {emit}) {
        const selectedSortBy = ref()
        const loading = ref(false)
        const sortBy = ref([
            {name: 'Name', value: 'prospectName'},
            {name: 'Email', value: 'prospectEmail'},
            {name: 'Company', value: 'companyName'},
            {name: 'Job Title', value: 'title'},
            {name: 'MQL Type', value: 'mqlType'}
        ])
        
        const updateSortBy = () => {
            emit('changeSortBy', selectedSortBy)
        }
        

        return { selectedSortBy, sortBy, updateSortBy, loading}
    },
    
}

</script>
