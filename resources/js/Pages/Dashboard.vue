<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import MetricCard from '@/Components/MetricCard.vue'
import SalesChart from '@/Components/SalesChart.vue'
import InventoryChart from '@/Components/InventoryChart.vue'
import AlertsList from '@/Components/AlertsList.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { 
  DollarSign, 
  Package, 
  TrendingUp,
  ArrowRight,
  Factory
} from 'lucide-vue-next'

interface Props {
  metrics?: {
    monthlySales: number
    stockAtRisk: number
    averageCost: number
    efficiency: number
  }
  alerts?: any[]
  salesData?: {
    labels: string[]
    sales: number[]
    production: number[]
  }
  inventoryData?: {
    labels: string[]
    actual: number[]
    optimal: number[]
  }
  productionData?: {
    labels: string[]
    planned: number[]
    actual: number[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  metrics: () => ({
    monthlySales: 0,
    stockAtRisk: 0,
    averageCost: 0,
    efficiency: 92.0
  }),
  alerts: () => [],
  salesData: () => ({
    labels: [],
    sales: [],
    production: []
  }),
  inventoryData: () => ({
    labels: [],
    actual: [],
    optimal: []
  }),
  productionData: () => ({
    labels: [],
    planned: [],
    actual: []
  })
})
</script>

<template>
  <Head title="Dashboard" />

  <AppLayout>
    <template #header>Panel Principal</template>
    <template #subtitle>Sistema de Análisis Empresarial</template>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <MetricCard
        title="Ventas del Mes"
        :value="`Bs ${metrics.monthlySales.toLocaleString('es-BO')}`"
        :trend="12.5"
        :icon="DollarSign"
      />
      <MetricCard
        title="Producción Actual"
        :value="`${(salesData.production.reduce((a, b) => a + b, 0) / 1000).toFixed(0)}k unid.`"
        :trend="5.2"
        :icon="Factory"
      />
      <MetricCard
        title="Costo Promedio"
        :value="`Bs ${metrics.averageCost.toFixed(2)}/unid`"
        :trend="3.1"
        :icon="TrendingUp"
      />
      <MetricCard
        title="Eficiencia"
        :value="`${metrics.efficiency}%`"
        :trend="-1.5"
        :icon="Package"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Sales vs Production Chart -->
      <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
        <CardHeader>
          <CardTitle class="text-white">Ventas vs Producción</CardTitle>
          <p class="text-sm text-eco-lightest/80">Últimos 6 meses</p>
        </CardHeader>
        <CardContent class="h-80">
          <SalesChart 
            :labels="salesData.labels"
            :sales="salesData.sales"
            :production="salesData.production"
          />
        </CardContent>
      </Card>

      <!-- Inventory Status Chart -->
      <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
        <CardHeader>
          <CardTitle class="text-white">Estado de Inventario</CardTitle>
          <p class="text-sm text-eco-lightest/80">Stock Actual vs Óptimo</p>
        </CardHeader>
        <CardContent class="h-80">
          <InventoryChart 
            :labels="inventoryData.labels"
            :actual="inventoryData.actual"
            :optimal="inventoryData.optimal"
          />
        </CardContent>
      </Card>
    </div>

    <!-- Recent Alerts -->
    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20 mb-6">
      <CardHeader>
        <CardTitle class="text-white">Alertas Recientes</CardTitle>
        <p class="text-sm text-eco-lightest/80">Notificaciones del sistema</p>
      </CardHeader>
      <CardContent class="max-h-80 overflow-y-auto">
        <AlertsList :alerts="props.alerts" />
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
      <CardHeader>
        <CardTitle class="text-white">Accesos Rápidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button 
            as="a" 
            href="/inventario"
            variant="outline"
            class="h-auto py-4 flex-col space-y-2 border-eco-primary/30 hover:bg-eco-primary/10 hover:border-eco-primary/50 text-eco-lightest hover:text-white"
          >
            <Package class="w-6 h-6" />
            <span>Inventario</span>
          </Button>
          
          <Button 
            as="a" 
            href="/ventas"
            variant="outline"
            class="h-auto py-4 flex-col space-y-2 border-eco-primary/30 hover:bg-eco-primary/10 hover:border-eco-primary/50 text-eco-lightest hover:text-white"
          >
            <DollarSign class="w-6 h-6" />
            <span>Ventas</span>
          </Button>
          
          <Button 
            as="a" 
            href="/empleados"
            variant="outline"
            class="h-auto py-4 flex-col space-y-2 border-eco-primary/30 hover:bg-eco-primary/10 hover:border-eco-primary/50 text-eco-lightest hover:text-white"
          >
            <TrendingUp class="w-6 h-6" />
            <span>Empleados</span>
          </Button>
          
          <Button 
            as="a" 
            href="/alertas"
            variant="outline"
            class="h-auto py-4 flex-col space-y-2 border-eco-primary/30 hover:bg-eco-primary/10 hover:border-eco-primary/50 text-eco-lightest hover:text-white"
          >
            <ArrowRight class="w-6 h-6" />
            <span>Alertas</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </AppLayout>
</template>
