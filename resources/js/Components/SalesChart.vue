<script setup lang="ts">
import { ref, watch } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  labels?: string[]
  sales?: number[]
  production?: number[]
}

const props = withDefaults(defineProps<Props>(), {
  labels: () => [],
  sales: () => [],
  production: () => []
})

const chartData = ref({
  labels: props.labels.length > 0 ? props.labels : ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Ventas',
      data: props.sales.length > 0 ? props.sales : [0, 0, 0, 0, 0, 0],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#3B82F6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    },
    {
      label: 'Producción',
      data: props.production.length > 0 ? props.production : [0, 0, 0, 0, 0, 0],
      borderColor: '#9333EA',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: '#9333EA',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }
  ]
})

watch(() => [props.labels, props.sales, props.production], () => {
  chartData.value = {
    labels: props.labels.length > 0 ? props.labels : ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'],
    datasets: [
      {
        label: 'Ventas',
        data: props.sales.length > 0 ? props.sales : [0, 0, 0, 0, 0, 0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Producción',
        data: props.production.length > 0 ? props.production : [0, 0, 0, 0, 0, 0],
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#9333EA',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat('es-BO', {
              style: 'currency',
              currency: 'BOB',
              minimumFractionDigits: 0
            }).format(context.parsed.y)
          }
          return label
        }
      }
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
        },
        callback: function(value: any) {
          return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 0
          }).format(value)
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
  },
  interaction: {
    intersect: false,
    mode: 'index' as const
  }
})
</script>

<template>
  <div class="w-full h-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
