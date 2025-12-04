<script setup lang="ts">
import { ref } from 'vue'
import { Head, useForm, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Plus, Edit, Trash2, Users } from 'lucide-vue-next'

interface Empleado {
  id: number
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  cargo: string | null
  fechaContratacion: string | null
}

interface Props {
  empleados: Empleado[]
}

const props = defineProps<Props>()

const showForm = ref(false)
const editingEmpleado = ref<Empleado | null>(null)

const empleadoForm = useForm({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  cargo: '',
  fechaContratacion: ''
})

function openForm(empleado: Empleado | null = null) {
  if (empleado) {
    editingEmpleado.value = empleado
    empleadoForm.nombre = empleado.nombre
    empleadoForm.apellido = empleado.apellido
    empleadoForm.email = empleado.email || ''
    empleadoForm.telefono = empleado.telefono || ''
    empleadoForm.cargo = empleado.cargo || ''
    empleadoForm.fechaContratacion = empleado.fechaContratacion || ''
  } else {
    editingEmpleado.value = null
    empleadoForm.reset()
  }
  showForm.value = true
}

function submitForm() {
  if (editingEmpleado.value) {
    empleadoForm.patch(`/empleados/${editingEmpleado.value.id}`, {
      onSuccess: () => {
        showForm.value = false
        empleadoForm.reset()
      }
    })
  } else {
    empleadoForm.post('/empleados', {
      onSuccess: () => {
        showForm.value = false
        empleadoForm.reset()
      }
    })
  }
}

function deleteEmpleado(id: number) {
  if (confirm('¿Estás seguro de eliminar este empleado?')) {
    router.delete(`/empleados/${id}`)
  }
}
</script>

<template>
  <Head title="Empleados" />

  <AppLayout>
    <template #header>Empleados</template>
    <template #subtitle>Gestión de Personal</template>

    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-white">Lista de Empleados</CardTitle>
          <Button @click="openForm()" class="bg-eco-primary hover:bg-eco-primary/90">
            <Plus class="w-4 h-4 mr-2" />
            Nuevo Empleado
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-eco-primary/20">
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Nombre</th>
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Contacto</th>
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Cargo</th>
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Fecha Contratación</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="empleado in empleados"
                :key="empleado.id"
                class="border-b border-eco-primary/10 hover:bg-eco-primary/5 transition-colors"
              >
                <td class="py-3 px-4">
                  <p class="text-white font-medium">{{ empleado.nombre }} {{ empleado.apellido }}</p>
                </td>
                <td class="py-3 px-4">
                  <div class="text-sm">
                    <p v-if="empleado.email" class="text-eco-lightest">{{ empleado.email }}</p>
                    <p v-if="empleado.telefono" class="text-eco-lightest/60">{{ empleado.telefono }}</p>
                    <p v-if="!empleado.email && !empleado.telefono" class="text-eco-lightest/40">Sin contacto</p>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <Badge v-if="empleado.cargo" variant="outline">
                    {{ empleado.cargo }}
                  </Badge>
                  <span v-else class="text-eco-lightest/40 text-sm">Sin cargo</span>
                </td>
                <td class="py-3 px-4 text-eco-lightest">
                  {{ empleado.fechaContratacion ? new Date(empleado.fechaContratacion).toLocaleDateString('es-BO') : '-' }}
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <Button
                      @click="openForm(empleado)"
                      variant="ghost"
                      size="icon"
                      class="text-eco-accent hover:text-eco-lightest"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button
                      @click="deleteEmpleado(empleado.id)"
                      variant="ghost"
                      size="icon"
                      class="text-red-400 hover:text-red-300"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="!empleados || empleados.length === 0">
                <td colspan="5" class="py-8 text-center text-eco-lightest/60">
                  <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay empleados registrados</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Employee Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showForm = false"
    >
      <Card class="w-full max-w-md bg-eco-dark border-eco-primary/30">
        <CardHeader>
          <CardTitle class="text-white">
            {{ editingEmpleado ? 'Editar Empleado' : 'Nuevo Empleado' }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-eco-lightest mb-1">Nombre</label>
                <input
                  v-model="empleadoForm.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-eco-lightest mb-1">Apellido</label>
                <input
                  v-model="empleadoForm.apellido"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Email</label>
              <input
                v-model="empleadoForm.email"
                type="email"
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Teléfono</label>
              <input
                v-model="empleadoForm.telefono"
                type="tel"
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Cargo</label>
              <input
                v-model="empleadoForm.cargo"
                type="text"
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Fecha de Contratación</label>
              <input
                v-model="empleadoForm.fechaContratacion"
                type="date"
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                @click="showForm = false"
                variant="outline"
                class="border-eco-primary/30 text-eco-lightest hover:bg-eco-primary/10"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                :disabled="empleadoForm.processing"
                class="bg-eco-primary hover:bg-eco-primary/90"
              >
                {{ editingEmpleado ? 'Actualizar' : 'Crear' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
