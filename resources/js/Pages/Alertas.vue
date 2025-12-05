<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import AlertsList from '@/Components/AlertsList.vue'
import { Bell, Trash2, AlertTriangle, TrendingDown, Package, XCircle } from 'lucide-vue-next'

interface Alerta {
  ID_Alerta: number
  Mensaje: string
  Tipo: string
  Fecha_Hora: string
  Categoria: string
  Accion_Recomendada: string
}

interface Props {
  alertas: Alerta[]
}

const props = defineProps<Props>()

function deleteAlerta(id: number) {
  if (confirm('¿Estás seguro de eliminar esta alerta?')) {
    router.delete(`/alertas/${id}`, {
      preserveScroll: true
    })
  }
}

const getAlertIcon = (tipo: string) => {
  switch (tipo) {
    case 'Sobreproducción':
      return Package
    case 'Stock Crítico':
    case 'Stock Agotado':
      return AlertTriangle
    case 'Tendencia Baja':
      return TrendingDown
    default:
      return Bell
  }
}

const getAlertCount = (tipo: string) => {
  return props.alertas.filter(a => a.Tipo === tipo).length
}

const alertTypes = [
  { tipo: 'Stock Crítico', color: 'text-red-400' },
  { tipo: 'Stock Agotado', color: 'text-red-500' },
  { tipo: 'Sobreproducción', color: 'text-yellow-400' },
  { tipo: 'Tendencia Baja', color: 'text-blue-400' }
]
</script>

<template>
  <Head title="Alertas" />

  <AppLayout>
    <template #header>Alertas del Sistema</template>
    <template #subtitle>Notificaciones y advertencias</template>

    <!-- Alert Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card 
        v-for="alertType in alertTypes" 
        :key="alertType.tipo"
        class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20"
      >
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-eco-lightest/60 mb-1">{{ alertType.tipo }}</p>
              <p class="text-2xl font-bold text-white">{{ getAlertCount(alertType.tipo) }}</p>
            </div>
            <component 
              :is="getAlertIcon(alertType.tipo)" 
              :class="['w-8 h-8', alertType.color]"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Alerts List -->
    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-white">Todas las Alertas</CardTitle>
            <p class="text-sm text-eco-lightest/80 mt-1">
              {{ alertas.length }} alerta{{ alertas.length !== 1 ? 's' : '' }} en total
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="alertas && alertas.length > 0" class="space-y-3">
          <div
            v-for="alerta in alertas"
            :key="alerta.ID_Alerta"
            class="group relative overflow-hidden rounded-lg border border-eco-primary/20 bg-gradient-to-br from-eco-dark/30 to-eco-darkest/30 backdrop-blur-sm p-4 hover:border-eco-primary/40 transition-all duration-300"
          >
            <!-- Alert Header -->
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <component 
                  :is="getAlertIcon(alerta.Tipo)" 
                  class="w-5 h-5 text-eco-accent flex-shrink-0"
                />
                <Badge 
                  :variant="alerta.Tipo === 'Stock Crítico' || alerta.Tipo === 'Stock Agotado' ? 'destructive' : 'default'" 
                  class="text-xs"
                >
                  {{ alerta.Tipo }}
                </Badge>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-xs text-eco-lightest/60">
                  {{ new Date(alerta.Fecha_Hora).toLocaleString('es-BO', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) }}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="deleteAlerta(alerta.ID_Alerta)"
                  class="h-8 w-8 p-0 text-eco-lightest/60 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- Alert Message -->
            <p class="text-sm text-eco-lightest leading-relaxed font-medium">
              {{ alerta.Mensaje }}
            </p>
            
            <!-- Recommendation -->
            <p v-if="alerta.Accion_Recomendada" class="text-xs text-eco-primary mt-2 flex items-center">
              <span class="font-bold mr-1">Recomendación:</span> {{ alerta.Accion_Recomendada }}
            </p>

            <!-- Gradient overlay on hover -->
            <div class="absolute inset-0 bg-gradient-to-r from-eco-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>
        
        <div v-else class="text-center py-12">
          <XCircle class="w-16 h-16 text-eco-lightest/30 mx-auto mb-4" />
          <p class="text-eco-lightest/60 text-lg mb-2">No hay alertas</p>
          <p class="text-eco-lightest/40 text-sm">El sistema generará alertas automáticamente cuando sea necesario</p>
        </div>
      </CardContent>
    </Card>
  </AppLayout>
</template>

