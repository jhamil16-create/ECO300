<?php

namespace App\Http\Controllers;

use App\Models\Alerta;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AlertaController extends Controller
{
    public function index()
    {
        $empresaId = auth()->user()->ID_Empresa ?? 1;
        
        $alertas = Alerta::where('ID_Empresa', $empresaId)
            ->orderBy('Fecha_Hora', 'desc')
            ->get()
            ->map(function ($alerta) {
                return [
                    'ID_Alerta' => $alerta->ID_Alerta,
                    'Mensaje' => $alerta->Mensaje,
                    'Tipo' => $alerta->Tipo,
                    'Categoria' => $alerta->Categoria,
                    'Fecha_Hora' => $alerta->Fecha_Hora,
                    'Accion_Recomendada' => $alerta->Accion_Recomendada,
                    'Leida' => $alerta->Leida,
                ];
            });
        
        return Inertia::render('Alertas', [
            'alertas' => $alertas
        ]);
    }

    public function destroy($id)
    {
        $alerta = Alerta::findOrFail($id);
        $alerta->delete();

        return redirect()->back()->with('success', 'Alerta eliminada exitosamente');
    }
}

