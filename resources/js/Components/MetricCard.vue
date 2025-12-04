<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

interface Props {
  title: string
  value: string | number
  trend?: number
  icon?: any
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const trendColor = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? 'text-green-500' : 'text-red-500'
})

const trendIcon = computed(() => {
  if (!props.trend) return null
  return props.trend > 0 ? TrendingUp : TrendingDown
})
</script>

<template>
  <div 
    :class="cn(
      'relative overflow-hidden rounded-xl border border-eco-primary/20 bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 backdrop-blur-sm p-6 shadow-lg hover:shadow-eco-primary/20 transition-all duration-300',
      props.class
    )"
  >
    <!-- Icon -->
    <div v-if="icon" class="absolute top-4 right-4 opacity-10">
      <component :is="icon" class="w-16 h-16 text-eco-lightest" />
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <p class="text-sm font-medium text-eco-lightest/80 mb-2">{{ title }}</p>
      <p class="text-3xl font-bold text-white mb-2">{{ value }}</p>
      
      <!-- Trend -->
      <div v-if="trend !== undefined" class="flex items-center space-x-1">
        <component :is="trendIcon" :class="['w-4 h-4', trendColor]" />
        <span :class="['text-sm font-medium', trendColor]">
          {{ Math.abs(trend) }}%
        </span>
        <span class="text-xs text-eco-lightest/60">vs mes anterior</span>
      </div>
    </div>

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-eco-primary/5 to-transparent pointer-events-none"></div>
  </div>
</template>
