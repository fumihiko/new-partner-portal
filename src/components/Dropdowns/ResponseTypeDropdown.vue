<template>
    <Dropdown v-model="selectedResponseType" @change="updateResponseType" :options="responseType" optionLabel="name" optionValue="value"  />
    
</template>

<script>

import { ref } from 'vue';

export default {
    
    setup(props, {emit}) {
        const selectedResponseType = ref();
        const loading = ref(false);
        const meetingTime = ref()
        const responseType = ref([
            {name: 'Meeting', value: 'Meeting'},
            {name: 'Conversation', value: 'Conversation'},
            {name: 'Left Local Voicemail', value: 'Left Local Voicemail'},
            {name: 'Spoke to Admin', value: 'Spoke to Admin'},
            {name: 'Referral', value: 'Referral'},
            {name: 'No Interest', value: 'No Interest'},
            {name: 'Bad Phone Number', value: 'Bad Phone Number'},
            {name: 'Other', value: 'Other'}
                   
            
        ]);

        const updateResponseType = () => {
            emit('changeResponseType', selectedResponseType)
        }

        const updateMeetingTime = () => {
            emit('changeMeetingTime', meetingTime)
        }
       
        // const items = ref(Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })));
        // const lazyItems = ref(Array.from({ length: 100000 }));

        return { selectedResponseType, responseType, loading, updateResponseType, meetingTime, updateMeetingTime}
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
