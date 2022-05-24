<template>
    <Dropdown v-model="selectedOpportunityLevel" :options="opportunityLevel" @change="updateOpportunityLevel" optionLabel="name" optionValue="value"  />
</template>

<script>

import { ref } from 'vue';

export default {
    
    setup(prlops, {emit}) {
        const selectedOpportunityLevel = ref();
        const loading = ref(false);
        const opportunityLevel = ref([
            {name: '$5K', value: 5000},
            {name: '$10K', value: 10000},
            {name: '$50K', value: 50000},
            {name: '$75K', value: 75000},
            {name: '$100K', value: 100000},
            {name: '$250K', value: 250000},
            {name: '$500K+', value: 500000}
        ]);
        
        const updateOpportunityLevel = () => {
            emit('changeOpportunityLevel', selectedOpportunityLevel)
        }
        
    
        

        // const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })));
        // const lazyItems = ref(Array.from({ length: 100000 }));

        return { selectedOpportunityLevel, opportunityLevel, loading, updateOpportunityLevel}
    },
    // loadLazyTimeout: null,
    // methods: {
    //     onLazyLoad(event) {
    //         this.loading = true;

    //         if (this.loadLazyTimeout) {
    //             clearTimeout(this.loadLazyTimeout);
    //         }

    //         //imitate delay of a backend call
    //         this.loadLazyTimeout = setTimeout(() => {
    //             const { first, last } = event;
    //             const lazyItems = [...this.lazyItems];

    //             for (let i = first; i < last; i++) {
    //                 lazyItems[i] = { label: `Item #${i}`, value: i };
    //             }

    //             this.lazyItems = lazyItems;
    //             this.loading = false;
    //         }, Math.random() * 1000 + 250);
    //     }
    // }
}

</script>

<style lang="scss" scoped>
    @import '../../assets/sass/_variables.scss';
    
    
</style>
