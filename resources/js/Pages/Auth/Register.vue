<script setup lang="ts">
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    empresa_nombre: '',
    ruc_nit: '',
});

const submit = () => {
    form.post(route('register'), {
        onSuccess: () => {
            // La redirección se maneja automáticamente por el servidor
        },
        onFinish: () => {
            form.reset('password', 'password_confirmation');
        },
        onError: (errors) => {
            console.error('Errores de validación:', errors);
        },
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Registro" />

        <div class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">Crear Cuenta</h2>
            <p class="text-sm text-eco-lightest/70">Completa los datos para registrarte</p>
        </div>

        <form @submit.prevent="submit" class="space-y-5">
            <div>
                <InputLabel for="name" value="Nombre" class="text-eco-lightest" />

                <TextInput
                    id="name"
                    type="text"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                    placeholder="Ingresa tu nombre"
                />

                <InputError class="mt-2" :message="form.errors.name" />
            </div>

            <div>
                <InputLabel for="empresa_nombre" value="Nombre de la Empresa" class="text-eco-lightest" />

                <TextInput
                    id="empresa_nombre"
                    type="text"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.empresa_nombre"
                    required
                    placeholder="Nombre de tu empresa"
                />

                <InputError class="mt-2" :message="form.errors.empresa_nombre" />
            </div>

            <div>
                <InputLabel for="ruc_nit" value="RUC o NIT" class="text-eco-lightest" />

                <TextInput
                    id="ruc_nit"
                    type="text"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.ruc_nit"
                    required
                    placeholder="1234567890"
                />

                <InputError class="mt-2" :message="form.errors.ruc_nit" />
            </div>

            <div>
                <InputLabel for="email" value="Email" class="text-eco-lightest" />

                <TextInput
                    id="email"
                    type="email"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.email"
                    required
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
                    autocomplete="new-password"
                    placeholder="••••••••"
                />

                <InputError class="mt-2" :message="form.errors.password" />
            </div>

            <div>
                <InputLabel
                    for="password_confirmation"
                    value="Confirmar Contraseña"
                    class="text-eco-lightest"
                />

                <TextInput
                    id="password_confirmation"
                    type="password"
                    class="mt-1 block w-full bg-eco-darkest/50 border-eco-primary/30 text-white placeholder-eco-lightest/40 focus:border-eco-primary focus:ring-eco-primary/20"
                    v-model="form.password_confirmation"
                    required
                    autocomplete="new-password"
                    placeholder="••••••••"
                />

                <InputError
                    class="mt-2"
                    :message="form.errors.password_confirmation"
                />
            </div>

            <div class="flex items-center justify-between pt-2">
                <Link
                    :href="route('login')"
                    class="text-sm text-eco-lightest/70 hover:text-eco-accent transition-colors underline underline-offset-2"
                >
                    ¿Ya tienes cuenta?
                </Link>

                <PrimaryButton
                    class="bg-gradient-to-r from-eco-primary to-eco-accent hover:from-eco-primary/90 hover:to-eco-accent/90 text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    :class="{ 'opacity-50 cursor-not-allowed': form.processing }"
                    :disabled="form.processing"
                >
                    <span v-if="!form.processing">REGISTRAR</span>
                    <span v-else>Registrando...</span>
                </PrimaryButton>
            </div>
        </form>
    </GuestLayout>
</template>
