<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::all();
        
        return Inertia::render('Empleados', [
            'empleados' => $empleados
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'nullable|email|unique:Empleado,email',
            'telefono' => 'nullable|string|max:50',
            'cargo' => 'nullable|string|max:100',
            'fechaContratacion' => 'nullable|date'
        ]);

        Empleado::create($validated);

        return redirect()->back()->with('success', 'Empleado creado exitosamente');
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::findOrFail($id);
        
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'email' => 'nullable|email|unique:Empleado,email,' . $id,
            'telefono' => 'nullable|string|max:50',
            'cargo' => 'nullable|string|max:100',
            'fechaContratacion' => 'nullable|date'
        ]);

        $empleado->update($validated);

        return redirect()->back()->with('success', 'Empleado actualizado exitosamente');
    }

    public function destroy($id)
    {
        $empleado = Empleado::findOrFail($id);
        $empleado->delete();

        return redirect()->back()->with('success', 'Empleado eliminado exitosamente');
    }
}
