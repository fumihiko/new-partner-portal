<template>
    <div>
        <div class="card">
            <h5>Basic</h5>
            <Chart type="line" :data="basicData" :options="basicOptions" />
        </div>

        
    </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
    props: ['data'],
    setup(props) {
        const fetchedData = ref()
        const basicData =  ref({})

        

        

        const basicOptions = ref(
            {   
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#495057'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#495057'
                        },
                        grid: {
                            color: '#ebedef'
                        }
                    }
                }
            }
        )

        
        onMounted(() => {
            fetchedData.value= props.data

            basicData.value = {
                labels: [...fetchedData.value.map(item => item.date)],
                datasets: [
                    {
                        label: 'Alerts sent',
                        data: [...fetchedData.value.map(item => item.value)],
                        fill: false,
                        borderColor: '#42A5F5',
                        tension: 0.5
                    }
                ]
            }
        })
		return {  basicData, fetchedData,  basicOptions }
    }
}
</script>

<style lang="scss" scoped>
    

</style>