<script setup lang="ts">
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps<{
    canResetPassword?: boolean;
    status?: string;
}>();

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => {
            form.reset('password');
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Iniciar Sesión" />

        <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">Bienvenido</h2>
            <p class="text-sm text-eco-lightest/70">Inicia sesión en tu cuenta</p>
        </div>

        <div v-if="status" class="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-sm text-green-400">
            {{ status }}
        </div>

        <form @submit.prevent="submit" class="space-y-5">
            <div>
                <InputLabel for="email" value="Email" class="text-eco-lightest" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                    placeholder="tu@email.com"
                />

                <InputError class="mt-2" :message="form.errors.email" />
            </div>

            <div>
                <InputLabel for="password" value="Contraseña" class="text-eco-lightest" />

                <TextInput
                    id="password"
                    type="password"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                    placeholder="••••••••"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div class="flex items-center justify-between">
                <label class="flex items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span class="ms-2 text-sm text-eco-lightest/70">Recordarme</span>
                </label>

                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="text-sm text-eco-lightest/70 hover:text-eco-accent transition-colors underline underline-offset-2"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            <div class="flex items-center justify-between pt-2">
                <Link
                    :href="route('register')"
                    class="text-sm text-eco-lightest/70 hover:text-eco-accent transition-colors underline underline-offset-2"
                >
                    ¿No tienes cuenta? Regístrate
                </Link>

                <PrimaryButton
                    class="bg-gradient-to-r from-eco-primary to-eco-accent hover:from-eco-primary/90 hover:to-eco-accent/90 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                    :disabled="form.processing"
                >
                    <span v-if="!form.processing">INICIAR SESIÓN</span>
                    <span v-else>Iniciando...</span>
                </PrimaryButton>
            </div>
        </form>
    </GuestLayout>
</template>
