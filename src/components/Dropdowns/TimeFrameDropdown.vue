<template>
    <div class="stack">
        <Dropdown v-model="selectedTimeFrame" @change="updateTimeFramne" :options="options" optionLabel="name" optionValue="value" placeholder="Select" />
        <Calendar v-if="selectedTimeFrame < 0" id="customTimeFrame" @date-select="updateCustomTimeFrame" v-model="selectedCustomTimeFrame" selectionMode="range" :manualInput="false" />
    </div>
</template>

<script>

import { ref } from 'vue'


export default {
    props: ['timeFrame', 'customTimeFrame'],
    setup(props, { emit }) {
        const selectedTimeFrame = ref(props.timeFrame);
        const loading = ref(false);
        const options = ref([
           // {name: 'All Sales Reps', id: null},
            {name: 'Today', value: 0},
            {name: 'Last 1 Day', value: 1},
            {name: 'Last 7 Days', value: 7},
            {name: 'Last 14 Days', value: 14},
            {name: 'Last 30 Days', value: 30},
            {name: 'Last 3 Months', value: 90},
            {name: 'Last 6 Months', value: 180},
            {name: 'Last Year', value: 365},
            {name: 'All Time', value: 30000},
            {name: 'Custom Date Range', value: -1}
        ]);
        const selectedCustomTimeFrame = ref(props.customTimeFrame)

        const updateTimeFramne = () => {
            emit('changeTimeFrame', selectedTimeFrame)
        }

        const updateCustomTimeFrame = () => {
            
            if (selectedCustomTimeFrame.value.length == 2) {
                // console.log(selectedCustomTimeFrame.value[0] +' '+  selectedCustomTimeFrame.value[1])
                // let start = new Date(selectedCustomTimeFrame.value[0])
                //     start = start.toISOString().substring(0,10)
                // let end = new Date(selectedCustomTimeFrame.value[1])
                //     end = end.toISOString().substring(0,10)
                emit('changeCustomTimeFrame', selectedCustomTimeFrame)
            }
            
        }
        

        // const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })));
        // const lazyItems = ref(Array.from({ length: 100000 }));

        return { selectedTimeFrame, options, loading,  selectedCustomTimeFrame, updateTimeFramne, updateCustomTimeFrame}
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
    .stack {
        display: flex;
        flex-direction: row;
        position: relative;
        .p-calendar {
            position: relative;
            border-bottom: 1px solid rgba(0, 0, 0, 0.38);
            margin-left: 16px;
        }

    }
</style>

