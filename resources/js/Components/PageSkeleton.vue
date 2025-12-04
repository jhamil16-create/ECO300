<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/Components/ui/card'
</script>

<template>
  <div class="animate-pulse space-y-6">
    <!-- Metrics Grid Skeleton -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card v-for="i in 4" :key="i" class="bg-eco-dark/30 border-eco-primary/10">
        <CardContent class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div class="h-4 w-24 bg-eco-lightest/10 rounded"></div>
            <div class="h-8 w-8 bg-eco-lightest/10 rounded-lg"></div>
          </div>
          <div class="h-8 w-32 bg-eco-lightest/20 rounded mb-2"></div>
          <div class="h-4 w-20 bg-eco-lightest/10 rounded"></div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card class="bg-eco-dark/30 border-eco-primary/10 h-96">
        <CardHeader>
          <div class="h-6 w-48 bg-eco-lightest/10 rounded"></div>
        </CardHeader>
        <CardContent>
          <div class="h-full w-full bg-eco-lightest/5 rounded-lg"></div>
        </CardContent>
      </Card>
      <Card class="bg-eco-dark/30 border-eco-primary/10 h-96">
        <CardHeader>
          <div class="h-6 w-48 bg-eco-lightest/10 rounded"></div>
        </CardHeader>
        <CardContent>
          <div class="h-full w-full bg-eco-lightest/5 rounded-lg"></div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
