<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Empresa;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:Usuarios,Email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'empresa_nombre' => 'required|string|max:150',
            'ruc_nit' => 'required|string|max:20|unique:Empresas,RUC_o_NIT',
        ]);

        try {
            DB::beginTransaction();

            // Crear empresa primero
            $empresa = Empresa::create([
                'Nombre' => trim($validated['empresa_nombre']),
                'RUC_o_NIT' => trim($validated['ruc_nit']),
                'Ciudad' => null,
            ]);

            // Crear usuario
            $user = User::create([
                'ID_Empresa' => $empresa->ID_Empresa,
                'Nombre' => trim($validated['name']),
                'Email' => strtolower(trim($validated['email'])),
                'Hash_Password' => Hash::make($validated['password']),
                'Rol' => 'Administrador',
            ]);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            return redirect()->route('dashboard')->with('success', '¡Registro exitoso! Bienvenido a ECO300.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error al registrar usuario: ' . $e->getMessage());
            return back()->withErrors(['email' => 'Error al crear la cuenta. Por favor, intenta nuevamente.']);
        }
    }
}
