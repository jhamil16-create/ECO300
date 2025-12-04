<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Inventario;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductoController extends Controller
{
    public function index()
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1;
        
        $productos = Producto::where('ID_Empresa', $empresaId)
            ->with('inventario')
            ->get()
            ->map(function ($producto) {
                return [
                    'ID_Producto' => $producto->ID_Producto,
                    'Nombre' => $producto->Nombre,
                    'Descripcion' => $producto->Descripcion,
                    'Unidad_Medida' => $producto->Unidad_Medida,
                    'Stock_Actual' => $producto->inventario->Stock_Actual ?? 0,
                    'Nivel_Optimo' => $producto->inventario->Nivel_Optimo ?? 0,
                    'Punto_Reorden' => $producto->inventario->Punto_Reorden ?? 0,
                ];
            });
        
        return Inertia::render('Inventario', [
            'productos' => $productos
        ]);
    }

    public function store(Request $request)
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1;
        
        $validated = $request->validate([
            'Nombre' => 'required|string|max:150',
            'Descripcion' => 'nullable|string',
            'Unidad_Medida' => 'nullable|string|max:10',
            'Stock_Actual' => 'required|integer|min:0',
            'Nivel_Optimo' => 'nullable|integer|min:0',
            'Punto_Reorden' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();
        
        try {
            $producto = Producto::create([
                'ID_Empresa' => $empresaId,
                'Nombre' => $validated['Nombre'],
                'Descripcion' => $validated['Descripcion'] ?? null,
                'Unidad_Medida' => $validated['Unidad_Medida'] ?? null,
            ]);

            Inventario::create([
                'ID_Producto' => $producto->ID_Producto,
                'Stock_Actual' => $validated['Stock_Actual'],
                'Nivel_Optimo' => $validated['Nivel_Optimo'] ?? $validated['Stock_Actual'],
                'Punto_Reorden' => $validated['Punto_Reorden'] ?? ($validated['Stock_Actual'] * 0.3),
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Producto creado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al crear el producto: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        
        $validated = $request->validate([
            'Nombre' => 'required|string|max:150',
            'Descripcion' => 'nullable|string',
            'Unidad_Medida' => 'nullable|string|max:10',
            'Stock_Actual' => 'required|integer|min:0',
            'Nivel_Optimo' => 'nullable|integer|min:0',
            'Punto_Reorden' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();
        
        try {
            $producto->update([
                'Nombre' => $validated['Nombre'],
                'Descripcion' => $validated['Descripcion'] ?? null,
                'Unidad_Medida' => $validated['Unidad_Medida'] ?? null,
            ]);

            $inventario = Inventario::where('ID_Producto', $producto->ID_Producto)->first();
            if ($inventario) {
                $inventario->update([
                    'Stock_Actual' => $validated['Stock_Actual'],
                    'Nivel_Optimo' => $validated['Nivel_Optimo'] ?? $inventario->Nivel_Optimo,
                    'Punto_Reorden' => $validated['Punto_Reorden'] ?? $inventario->Punto_Reorden,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Producto actualizado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Error al actualizar el producto: ' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return redirect()->back()->with('success', 'Producto eliminado exitosamente');
    }
}
