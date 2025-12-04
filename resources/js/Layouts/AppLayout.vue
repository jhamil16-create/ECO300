<script setup lang="ts">
import { ref } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Bell,
  Menu,
  X
} from 'lucide-vue-next'

const sidebarOpen = ref(true)
const page = usePage()

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Ventas', href: '/ventas', icon: ShoppingCart },
  { name: 'Empleados', href: '/empleados', icon: Users },
  { name: 'Alertas', href: '/alertas', icon: Bell },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-eco-darkest via-eco-dark to-eco-darkest">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
      class="bg-eco-darkest/90 backdrop-blur-sm border-r border-eco-primary/20"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-between px-4 border-b border-eco-primary/20">
        <div v-if="sidebarOpen" class="flex items-center space-x-2">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-primary to-eco-accent flex items-center justify-center">
            <span class="text-white font-bold text-sm">E</span>
          </div>
          <span class="text-white font-semibold text-lg">ECO300</span>
        </div>
        <button 
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 rounded-lg hover:bg-eco-primary/10 transition-colors"
        >
          <Menu v-if="!sidebarOpen" class="w-5 h-5 text-eco-lightest" />
          <X v-else class="w-5 h-5 text-eco-lightest" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1">
        <Link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200',
            page.url === item.href
              ? 'bg-eco-primary text-white shadow-lg shadow-eco-primary/50'
              : 'text-eco-lightest hover:bg-eco-primary/10 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span 
            v-if="sidebarOpen" 
            class="ml-3 font-medium"
          >
            {{ item.name }}
          </span>
        </Link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-eco-primary/20">
        <div v-if="sidebarOpen" class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-eco-accent to-eco-primary flex items-center justify-center">
            <span class="text-white font-semibold">{{ page.props.auth?.user?.Nombre?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">
              {{ page.props.auth?.user?.Nombre || 'Usuario' }}
            </p>
            <Link 
              href="/logout" 
              method="post" 
              as="button"
              class="text-xs text-eco-accent hover:text-eco-lightest transition-colors"
            >
              Cerrar sesión
            </Link>
          </div>
        </div>
        <div v-else class="flex justify-center">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-eco-accent to-eco-primary flex items-center justify-center">
            <span class="text-white font-semibold">{{ page.props.auth?.user?.Nombre?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div 
      :class="[
        'transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      ]"
    >
      <!-- Top Navbar -->
      <header class="sticky top-0 z-40 bg-eco-dark/80 backdrop-blur-md border-b border-eco-primary/20">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white">
                <slot name="header">Dashboard</slot>
              </h1>
              <p class="text-sm text-eco-lightest mt-1">
                <slot name="subtitle">Sistema de Gestión de Mercado</slot>
              </p>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Notifications -->
              <button class="relative p-2 rounded-lg hover:bg-eco-primary/10 transition-colors">
                <Bell class="w-5 h-5 text-eco-lightest" />
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
