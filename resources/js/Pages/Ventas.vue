<script setup lang="ts">
import { ref, computed } from 'vue'
import { Head, useForm } from '@inertiajs/vue3'
import AppLayout from '@/Layouts/AppLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { Plus, Trash2, ShoppingCart } from 'lucide-vue-next'

interface Producto {
  ID_Producto: number
  Nombre: string
  Stock_Actual: number
}

interface Venta {
  ID_Venta: number
  Fecha_Venta: string
  Total_Venta: number
  detalles?: Array<{
    ID_Detalle: number
    producto?: { ID_Producto: number; Nombre: string }
    Cantidad: number
    Precio_Unit: number
    Total: number
  }>
}

interface Props {
  productos: Producto[]
  ventas?: Venta[]
}

const props = defineProps<Props>()

const cart = ref<Array<{ producto: Producto; cantidad: number; precioUnit: number }>>([])
const searchQuery = ref('')

const ventaForm = useForm({
  items: [] as Array<{ ID_Producto: number; Cantidad: number; Precio_Unit: number }>
})

const filteredProductos = computed(() => {
  if (!searchQuery.value) return props.productos
  return props.productos.filter(p => 
    p.Nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const total = computed(() => {
  return cart.value.reduce((sum, item) => 
    sum + (item.precioUnit * item.cantidad), 0
  )
})

function addToCart(producto: Producto) {
  const existing = cart.value.find(item => item.producto.ID_Producto === producto.ID_Producto)
  if (existing) {
    if (existing.cantidad < producto.Stock_Actual) {
      existing.cantidad++
    }
  } else {
    // Pedir precio al usuario
    const precio = prompt(`Ingresa el precio unitario para ${producto.Nombre}:`)
    if (precio && !isNaN(parseFloat(precio))) {
      cart.value.push({ 
        producto, 
        cantidad: 1,
        precioUnit: parseFloat(precio)
      })
    }
  }
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1)
}

function updateQuantity(index: number, cantidad: number) {
  if (cantidad > 0 && cantidad <= cart.value[index].producto.Stock_Actual) {
    cart.value[index].cantidad = cantidad
  }
}

function updatePrice(index: number, precio: number) {
  if (precio > 0) {
    cart.value[index].precioUnit = precio
  }
}

function submitSale() {
  if (cart.value.length === 0) {
    alert('Agrega productos al carrito')
    return
  }

  ventaForm.items = cart.value.map(item => ({
    ID_Producto: item.producto.ID_Producto,
    Cantidad: item.cantidad,
    Precio_Unit: item.precioUnit
  }))

  ventaForm.post('/ventas', {
    onSuccess: () => {
      cart.value = []
      ventaForm.reset()
      searchQuery.value = ''
    }
  })
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-BO', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <Head title="Ventas" />

  <AppLayout>
    <template #header>Ventas</template>
    <template #subtitle>Registro de Ventas</template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Products Selection -->
      <div class="lg:col-span-2 space-y-4">
        <!-- Search -->
        <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
          <CardContent class="pt-6">
            <input 
              v-model="searchQuery"
              type="text"
              placeholder="Buscar productos..."
              class="w-full px-4 py-3 bg-eco-darkest border border-eco-primary/20 rounded-lg text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-2 focus:ring-eco-primary/50"
            />
          </CardContent>
        </Card>

        <!-- Products Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            v-for="producto in filteredProductos"
            :key="producto.ID_Producto"
            @click="addToCart(producto)"
            :disabled="producto.Stock_Actual === 0"
            class="group relative overflow-hidden rounded-xl border border-eco-primary/20 bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 p-4 text-left transition-all hover:border-eco-primary/50 hover:shadow-lg hover:shadow-eco-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex flex-col h-full">
              <h3 class="font-semibold text-white mb-2 line-clamp-2">{{ producto.Nombre }}</h3>
              <div class="mt-auto">
                <p class="text-sm text-eco-lightest/60 mt-1">
                  Stock: {{ producto.Stock_Actual }}
                </p>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-eco-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </button>
        </div>
      </div>

      <!-- Shopping Cart -->
      <div class="space-y-4">
        <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
          <CardHeader>
            <CardTitle class="text-white flex items-center">
              <ShoppingCart class="w-5 h-5 mr-2" />
              Carrito
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Cart Items -->
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="(item, index) in cart"
                :key="index"
                class="flex flex-col p-3 rounded-lg bg-eco-darkest/50 border border-eco-primary/10 space-y-2"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0 mr-2">
                    <p class="text-sm font-medium text-white truncate">{{ item.producto.Nombre }}</p>
                  </div>
                  <button
                    @click="removeFromCart(index)"
                    class="p-1 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-eco-lightest/60">Cantidad:</label>
                  <input
                    type="number"
                    :value="item.cantidad"
                    @input="updateQuantity(index, parseInt(($event.target as HTMLInputElement).value))"
                    min="1"
                    :max="item.producto.Stock_Actual"
                    class="w-16 px-2 py-1 text-center bg-eco-darkest border border-eco-primary/20 rounded text-white text-sm"
                  />
                  <label class="text-xs text-eco-lightest/60">Precio:</label>
                  <input
                    type="number"
                    step="0.01"
                    :value="item.precioUnit"
                    @input="updatePrice(index, parseFloat(($event.target as HTMLInputElement).value))"
                    min="0"
                    class="w-20 px-2 py-1 text-center bg-eco-darkest border border-eco-primary/20 rounded text-white text-sm"
                  />
                </div>
                <p class="text-xs text-eco-accent font-medium">
                  Subtotal: Bs {{ (item.precioUnit * item.cantidad).toFixed(2) }}
                </p>
              </div>
              <div v-if="cart.length === 0" class="text-center py-8 text-eco-lightest/60">
                <ShoppingCart class="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p class="text-sm">Carrito vacío</p>
              </div>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t border-eco-primary/20">
              <div class="flex justify-between items-center mb-4">
                <span class="text-lg font-medium text-eco-lightest">Total:</span>
                <span class="text-3xl font-bold text-white">Bs {{ total.toFixed(2) }}</span>
              </div>
              
              <Button
                @click="submitSale"
                :disabled="cart.length === 0 || ventaForm.processing"
                class="w-full bg-eco-primary hover:bg-eco-primary/90 text-white font-semibold py-3"
              >
                <ShoppingCart class="w-5 h-5 mr-2" />
                Completar Venta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Sales History -->
    <Card class="bg-gradient-to-br from-eco-dark/50 to-eco-darkest/50 border-eco-primary/20">
      <CardHeader>
        <CardTitle class="text-white">Registro de Ventas</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-eco-primary/20">
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Fecha</th>
                <th class="text-left py-3 px-4 text-eco-lightest font-medium">Producto</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Cantidad</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Precio Unit.</th>
                <th class="text-right py-3 px-4 text-eco-lightest font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="venta in ventas" :key="venta.ID_Venta">
                <tr 
                  v-for="(detalle, idx) in venta.detalles" 
                  :key="detalle.ID_Detalle"
                  class="border-b border-eco-primary/10 hover:bg-eco-primary/5 transition-colors"
                >
                  <td v-if="idx === 0" :rowspan="venta.detalles?.length || 1" class="py-3 px-4 text-eco-lightest">
                    {{ formatDate(venta.Fecha_Venta) }}
                  </td>
                  <td class="py-3 px-4 text-white">
                    {{ detalle.producto?.Nombre || 'N/A' }}
                  </td>
                  <td class="py-3 px-4 text-right text-eco-lightest">
                    {{ detalle.Cantidad }}
                  </td>
                  <td class="py-3 px-4 text-right text-eco-lightest">
                    Bs {{ detalle.Precio_Unit.toFixed(2) }}
                  </td>
                  <td class="py-3 px-4 text-right text-white font-medium">
                    Bs {{ detalle.Total.toFixed(2) }}
                  </td>
                </tr>
              </template>
              <tr v-if="!ventas || ventas.length === 0">
                <td colspan="5" class="py-8 text-center text-eco-lightest/60">
                  <ShoppingCart class="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No hay ventas registradas</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </AppLayout>
</template>
