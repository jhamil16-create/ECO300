<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:Categoria,nombre'
        ]);

        Categoria::create($validated);

        return redirect()->back()->with('success', 'Categoría creada exitosamente');
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::findOrFail($id);
        
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:Categoria,nombre,' . $id
        ]);

        $categoria->update($validated);

        return redirect()->back()->with('success', 'Categoría actualizada exitosamente');
    }

    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return redirect()->back()->with('success', 'Categoría eliminada exitosamente');
    }
}
