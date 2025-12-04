<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { type ButtonVariants, buttonVariants } from '.'
import { cn } from '@/lib/utils'

interface Props {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <component
    :is="as"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </component>
</template>
