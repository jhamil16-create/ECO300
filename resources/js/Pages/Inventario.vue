<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, useForm, router } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle } from 'lucide-vue-next'

interface Producto {
  ID_Producto: number
  Nombre: string
  Descripcion: string | null
  Unidad_Medida: string | null
  Stock_Actual: number
  Nivel_Optimo: number
  Punto_Reorden: number
}

interface Props {
  productos: Producto[]
}

const props = defineProps<Props>()

const showProductForm = ref(false)
const editingProduct = ref<Producto | null>(null)

const productForm = useForm({
  Nombre: '',
  Descripcion: '',
  Unidad_Medida: '',
  Stock_Actual: 0,
  Nivel_Optimo: 0,
  Punto_Reorden: 0,
})

function openProductForm(product: Producto | null = null) {
  if (product) {
    editingProduct.value = product
    productForm.Nombre = product.Nombre
    productForm.Descripcion = product.Descripcion || ''
    productForm.Unidad_Medida = product.Unidad_Medida || ''
    productForm.Stock_Actual = product.Stock_Actual
    productForm.Nivel_Optimo = product.Nivel_Optimo
    productForm.Punto_Reorden = product.Punto_Reorden
  } else {
    editingProduct.value = null
    productForm.reset()
  }
  showProductForm.value = true
}

function submitProduct() {
  if (editingProduct.value) {
    productForm.patch(`/productos/${editingProduct.value.ID_Producto}`, {
      onSuccess: () => {
        showProductForm.value = false
        productForm.reset()
      }
    })
  } else {
    productForm.post('/productos', {
      onSuccess: () => {
        showProductForm.value = false
        productForm.reset()
      }
    })
  }
}

function deleteProduct(id: number) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    router.delete(`/productos/${id}`)
  }
}

function getStockStatus(stock: number, optimal: number, reorder: number) {
  if (stock === 0) {
    return { variant: 'destructive' as const, text: 'Agotado', icon: AlertTriangle, color: 'text-red-400' }
  }
  if (stock < reorder) {
    return { variant: 'destructive' as const, text: 'Crítico', icon: AlertTriangle, color: 'text-red-400' }
  }
  if (stock < optimal * 0.7) {
    return { variant: 'secondary' as const, text: 'Bajo', icon: AlertTriangle, color: 'text-yellow-400' }
  }
  if (stock > optimal * 1.3) {
    return { variant: 'default' as const, text: 'Exceso', icon: Package, color: 'text-orange-400' }
  }
  return { variant: 'default' as const, text: 'Óptimo', icon: CheckCircle, color: 'text-green-400' }
}

const productosConEstado = computed(() => {
  return props.productos.map(p => ({
    ...p,
    estado: getStockStatus(p.Stock_Actual, p.Nivel_Optimo, p.Punto_Reorden)
  }))
})
</script>

<template>
  <Head title="Inventario" />

  <AppLayout>
    <template #header>Inventario</template>
    <template #subtitle>Gestión de Productos y Stock</template>

    <!-- Products Table -->
    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle class="text-white">Productos</CardTitle>
          <Button @click="openProductForm()" class="bg-eco-primary hover:bg-eco-primary/90">
            <Plus class="w-4 h-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-eco-primary/20">
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Producto</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Stock Actual</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Nivel Óptimo</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Punto Reorden</th>
                <th class="text-center py-3 px-4 text-eco-lightest font-medium">Estado</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="producto in productosConEstado" 
                :key="producto.ID_Producto"
                class="border-b border-eco-primary/10 hover:bg-eco-primary/5 transition-colors"
              >
                <td class="py-3 px-4">
                  <div>
                    <p class="text-white font-medium">{{ producto.Nombre }}</p>
                    <p v-if="producto.Descripcion" class="text-sm text-eco-lightest/60">
                      {{ producto.Descripcion }}
                    </p>
                    <p v-if="producto.Unidad_Medida" class="text-xs text-eco-lightest/40 mt-1">
                      Unidad: {{ producto.Unidad_Medida }}
                    </p>
                  </div>
                </td>
                <td class="py-3 px-4 text-right text-white font-medium">
                  {{ producto.Stock_Actual }}
                </td>
                <td class="py-3 px-4 text-right text-eco-lightest">
                  {{ producto.Nivel_Optimo }}
                </td>
                <td class="py-3 px-4 text-right text-eco-lightest">
                  {{ producto.Punto_Reorden }}
                </td>
                <td class="py-3 px-4 text-center">
                  <Badge :variant="producto.estado.variant" class="flex items-center justify-center gap-1 w-fit mx-auto">
                    <component :is="producto.estado.icon" :class="['w-3 h-3', producto.estado.color]" />
                    {{ producto.estado.text }}
                  </Badge>
                </td>
                <td class="py-3 px-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <Button 
                      @click="openProductForm(producto)" 
                      variant="ghost" 
                      size="icon"
                      class="text-eco-accent hover:text-eco-lightest"
                    >
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button 
                      @click="deleteProduct(producto.ID_Producto)" 
                      variant="ghost" 
                      size="icon"
                      class="text-red-400 hover:text-red-300"
                    >
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="!productos || productos.length === 0">
                <td colspan="6" class="py-8 text-center text-eco-lightest/60">
                  <Package class="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay productos registrados</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Product Form Modal -->
    <div 
      v-if="showProductForm"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showProductForm = false"
    >
      <Card class="w-full max-w-md bg-eco-dark border-eco-primary/30">
        <CardHeader>
          <CardTitle class="text-white">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitProduct" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Nombre</label>
              <input 
                v-model="productForm.Nombre"
                type="text"
                required
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Descripción</label>
              <textarea 
                v-model="productForm.Descripcion"
                rows="2"
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-eco-lightest mb-1">Unidad de Medida</label>
              <input 
                v-model="productForm.Unidad_Medida"
                type="text"
                placeholder="kg, unidades, etc."
                class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
              />
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-eco-lightest mb-1">Stock Actual</label>
                <input 
                  v-model.number="productForm.Stock_Actual"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-eco-lightest mb-1">Nivel Óptimo</label>
                <input 
                  v-model.number="productForm.Nivel_Optimo"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-eco-lightest mb-1">Punto Reorden</label>
                <input 
                  v-model.number="productForm.Punto_Reorden"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white focus:border-eco-primary focus:ring-1 focus:ring-eco-primary"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                @click="showProductForm = false" 
                variant="outline"
                class="border-eco-primary/30 text-eco-lightest hover:bg-eco-primary/10"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                :disabled="productForm.processing"
                class="bg-eco-primary hover:bg-eco-primary/90"
              >
                {{ editingProduct ? 'Actualizar' : 'Crear' }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
</template>
