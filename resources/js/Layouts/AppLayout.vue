<script setup lang="ts">
import { ref } from 'vue'
import { Link, usePage, router } from '@inertiajs/vue3'
import PageSkeleton from '@/Components/PageSkeleton.vue'
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
const loading = ref(false)

router.on('start', () => loading.value = true)
router.on('finish', () => loading.value = false)

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventario', href: '/inventario', icon: Package },
  { name: 'Ventas', href: '/ventas', icon: ShoppingCart },
  { name: 'Alertas', href: '/alertas', icon: Bell },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-eco-darkest via-eco-dark to-eco-darkest pb-24 md:pb-0">
    <!-- Mobile Sidebar Backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/50 z-40 md:hidden"
      @click="sidebarOpen = false"
    ></div>
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 hidden md:flex flex-col transition-all duration-300 bg-eco-darkest/90 backdrop-blur-sm border-r border-eco-primary/20',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-between px-4 border-b border-eco-primary/20">
        <div class="flex items-center space-x-2 overflow-hidden">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-eco-primary to-eco-accent flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-sm">E</span>
          </div>
          <span :class="['text-white font-semibold text-lg transition-opacity duration-300', sidebarOpen ? 'opacity-100' : 'opacity-0']">
            ECO300
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <Link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group',
            page.url === item.href
              ? 'bg-eco-primary text-white shadow-lg shadow-eco-primary/50'
              : 'text-eco-lightest hover:bg-eco-primary/10 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span 
            :class="['ml-3 font-medium transition-opacity duration-200', sidebarOpen ? 'opacity-100' : 'opacity-0']"
          >
            {{ item.name }}
          </span>
          <!-- Tooltip for collapsed state -->
          <div v-if="!sidebarOpen" class="absolute left-16 bg-eco-darkest px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-eco-primary/20">
            {{ item.name }}
          </div>
        </Link>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-eco-primary/20">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-eco-accent to-eco-primary flex items-center justify-center flex-shrink-0">
            <span class="text-white font-semibold">{{ page.props.auth?.user?.Nombre?.charAt(0).toUpperCase() || 'U' }}</span>
          </div>
          <div :class="['flex-1 min-w-0 transition-opacity duration-200', sidebarOpen ? 'opacity-100' : 'opacity-0']">
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
      </div>
    </aside>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div class="bg-eco-darkest/90 backdrop-blur-md border border-eco-primary/20 rounded-2xl shadow-lg shadow-black/50 px-6 py-3 flex justify-between items-center">
        <Link
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200',
            page.url === item.href
              ? 'text-eco-primary bg-eco-primary/10 scale-110'
              : 'text-eco-lightest/60 hover:text-eco-lightest'
          ]"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <!-- Optional: Show label if needed, but icons are cleaner -->
          <!-- <span class="text-[10px] mt-1 font-medium">{{ item.name }}</span> -->
        </Link>
        
        <!-- Mobile User Menu / Logout -->
        <Link 
          href="/logout" 
          method="post" 
          as="button"
          class="flex flex-col items-center justify-center p-2 rounded-xl text-eco-lightest/60 hover:text-red-400 transition-colors"
        >
          <div class="w-6 h-6 rounded-full bg-gradient-to-br from-eco-accent to-eco-primary flex items-center justify-center text-[10px] text-white font-bold">
            {{ page.props.auth?.user?.Nombre?.charAt(0).toUpperCase() || 'U' }}
          </div>
        </Link>
      </div>
    </nav>

    <!-- Main Content -->
    <div 
      :class="[
        'transition-all duration-300 min-h-screen flex flex-col',
        sidebarOpen ? 'md:ml-64' : 'md:ml-20'
      ]"
    >
      <!-- Top Navbar -->
      <header class="sticky top-0 z-40 bg-eco-dark/80 backdrop-blur-md border-b border-eco-primary/20">
        <div class="px-4 sm:px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Toggle Button (Desktop Only) -->
              <button 
                @click="sidebarOpen = !sidebarOpen"
                class="hidden md:block p-2 rounded-lg hover:bg-eco-primary/10 transition-colors text-eco-lightest"
              >
                <Menu class="w-6 h-6" />
              </button>

              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl sm:text-2xl font-bold text-white" v-motion-slide-visible-once-top>
                    <slot name="header">Dashboard</slot>
                  </h1>
                  <span class="hidden sm:inline-block text-eco-primary/50 text-xl">|</span>
                  <span class="hidden sm:inline-block text-eco-lightest font-semibold text-lg" v-motion-slide-visible-once-top :delay="50">ECO300</span>
                </div>
              </div>
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
      <main class="flex-1 p-4 sm:p-6 overflow-x-hidden">
        <PageSkeleton v-if="loading" />
        <slot v-else />
      </main>
    </div>
  </div>
</template>
