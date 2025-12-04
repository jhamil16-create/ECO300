<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const target = ref(null)
const { elementX, elementY, isOutside, elementHeight, elementWidth } = useMouseInElement(target)

const cardTransform = computed(() => {
  const MAX_ROTATION = 6

  const rX = (MAX_ROTATION / 2 - (elementY.value / elementHeight.value) * MAX_ROTATION).toFixed(2)
  const rY = ((elementX.value / elementWidth.value) * MAX_ROTATION - MAX_ROTATION / 2).toFixed(2)

  return isOutside.value
    ? ''
    : `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg)`
})
</script>

<template>
  <div
    ref="target"
    :style="{
      transform: cardTransform,
      transition: 'transform 0.1s ease-out'
    }"
    class="h-full w-full"
  >
    <slot />
  </div>
</template>
