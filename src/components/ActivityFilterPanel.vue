<template>
    <div>
        <Panel :toggleable="true">
            <template #icons>
                <button @click="toggle">
                   <i class="fa-solid fa-sliders"></i>
                </button>
            </template>
            
        </Panel>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        
        const collapsed = ref(true);
        
        

        return {  collapsed }
    }
}
</script>

<style lang="scss" scoped>
.p-panel p {
    line-height: 1.5;
    margin: 0;
}
</style>