<script setup lang="ts">
import { Badge } from '@/Components/ui/badge'
import { AlertTriangle, TrendingDown, Package } from 'lucide-vue-next'

interface Alert {
  ID_Alerta?: number
  id?: number
  Mensaje?: string
  mensaje?: string
  Tipo?: string
  tipo?: string
  Fecha_Hora?: string
  fecha?: string
  Categoria?: string
  Accion_Recomendada?: string
}

interface Props {
  alerts?: Alert[]
}

const props = withDefaults(defineProps<Props>(), {
  alerts: () => [
    {
      id: 1,
      mensaje: 'El stock de Manzanas Rojas supera en 30% la demanda promedio de los últimos 2 meses.',
      tipo: 'Sobreproducción',
      fecha: '2025-12-03 14:30:00'
    },
    {
      id: 2,
      mensaje: 'Tomates tiene un stock de 5 unidades. Se agotará en 2 días al ritmo de venta actual.',
      tipo: 'Stock Crítico',
      fecha: '2025-12-03 12:15:00'
    },
    {
      id: 3,
      mensaje: 'La venta de Papas ha caído un 15% esta semana sin cambio en factores externos.',
      tipo: 'Tendencia a la Baja',
      fecha: '2025-12-03 10:00:00'
    }
  ]
})

const getAlertIcon = (tipo: string) => {
  switch (tipo) {
    case 'Sobreproducción':
      return Package
    case 'Stock Crítico':
      return AlertTriangle
    case 'Tendencia a la Baja':
      return TrendingDown
    default:
      return AlertTriangle
  }
}

const getAlertVariant = (tipo: string) => {
  switch (tipo) {
    case 'Sobreproducción':
      return 'default'
    case 'Stock Crítico':
      return 'destructive'
    case 'Tendencia a la Baja':
      return 'secondary'
    default:
      return 'outline'
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 60) {
    return `Hace ${diffMins} min`
  } else if (diffHours < 24) {
    return `Hace ${diffHours}h`
  } else {
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
  }
}

const getAlertId = (alert: Alert) => {
  return alert.ID_Alerta || alert.id || 0
}

const getAlertMessage = (alert: Alert) => {
  return alert.Mensaje || alert.mensaje || ''
}

const getAlertType = (alert: Alert) => {
  return alert.Tipo || alert.tipo || 'Información'
}

const getAlertDate = (alert: Alert) => {
  return alert.Fecha_Hora || alert.fecha || ''
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="alert in alerts"
      :key="getAlertId(alert)"
      class="group relative overflow-hidden rounded-lg border border-eco-primary/20 bg-gradient-to-br from-eco-dark/30 to-eco-darkest/30 backdrop-blur-sm p-4 hover:border-eco-primary/40 transition-all duration-300"
    >
      <!-- Alert Header -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center space-x-2">
          <component 
            :is="getAlertIcon(getAlertType(alert))" 
            class="w-5 h-5 text-eco-accent flex-shrink-0"
          />
          <Badge :variant="getAlertVariant(getAlertType(alert))" class="text-xs">
            {{ getAlertType(alert) }}
          </Badge>
        </div>
        <span class="text-xs text-eco-lightest/60">
          {{ formatDate(getAlertDate(alert)) }}
        </span>
      </div>

      <!-- Alert Message -->
      <p class="text-sm text-eco-lightest leading-relaxed">
        {{ getAlertMessage(alert) }}
      </p>

      <!-- Recommended Action -->
      <p v-if="alert.Accion_Recomendada" class="text-xs text-eco-accent/80 mt-2 italic">
        {{ alert.Accion_Recomendada }}
      </p>

      <!-- Gradient overlay on hover -->
      <div class="absolute inset-0 bg-gradient-to-r from-eco-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>

    <div v-if="!alerts || alerts.length === 0" class="text-center py-8">
      <p class="text-eco-lightest/60 text-sm">No hay alertas recientes</p>
    </div>
  </div>
</template>
