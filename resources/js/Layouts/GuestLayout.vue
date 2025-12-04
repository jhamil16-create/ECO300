<script setup lang="ts">
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
</script>

<template>
    <div class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-eco-darkest via-eco-dark to-eco-darkest pt-6 sm:pt-0">
        <div class="mb-8">
            <Link href="/">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-eco-primary to-eco-accent flex items-center justify-center shadow-lg">
                        <span class="text-white font-bold text-xl">E</span>
                    </div>
                    <span class="text-white font-semibold text-2xl">ECO300</span>
                </div>
            </Link>
        </div>

        <div class="w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-eco-dark/90 to-eco-darkest/90 backdrop-blur-sm border border-eco-primary/20 shadow-2xl px-8 py-8 sm:px-10 sm:py-10">
            <slot />
        </div>
        
        <div class="mt-6 text-center">
            <p class="text-sm text-eco-lightest/60">
                Sistema de Gestión Empresarial
            </p>
        </div>
    </div>
</template>
