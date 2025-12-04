<script setup lang="ts">
import { ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  labels?: string[]
  actual?: number[]
  optimal?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => [],
  actual: () => [],
  optimal: () => []
})

const chartData = ref({
  labels: props.labels.length > 0 ? props.labels : ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
  datasets: [
    {
      label: 'Stock Actual',
      data: props.actual.length > 0 ? props.actual : [0, 0, 0, 0],
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      borderWidth: 1,
    },
    {
      label: 'Stock Óptimo',
      data: props.optimal.length > 0 ? props.optimal : [0, 0, 0, 0],
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      borderWidth: 1,
    }
  ]
})

watch(() => [props.labels, props.actual, props.optimal], () => {
  chartData.value = {
    labels: props.labels.length > 0 ? props.labels : ['Producto A', 'Producto B', 'Producto C', 'Producto D'],
    datasets: [
      {
        label: 'Stock Actual',
        data: props.actual.length > 0 ? props.actual : [0, 0, 0, 0],
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
      },
      {
        label: 'Stock Óptimo',
        data: props.optimal.length > 0 ? props.optimal : [0, 0, 0, 0],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1,
      }
    ]
  }
}, { deep: true })

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: '#A3F4FF',
        font: {
          family: 'Inter',
          size: 12
        },
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(10, 31, 61, 0.9)',
      titleColor: '#A3F4FF',
      bodyColor: '#fff',
      borderColor: '#3B82F6',
      borderWidth: 1,
      padding: 12,
      displayColors: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(59, 130, 246, 0.1)',
        drawBorder: false
      },
      ticks: {
        color: '#A3F4FF',
        font: {
          family: 'Inter',
          size: 11
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(59, 130, 246, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#A3F4FF',
        font: {
          family: 'Inter',
          size: 11
        }
      }
    }
  }
})
</script>

<template>
  <div class="w-full h-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

