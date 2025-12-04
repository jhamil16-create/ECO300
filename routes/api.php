<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnalyticsController;

Route::middleware(['auth'])->group(function () {
    Route::get('/analytics/product/{id}', [AnalyticsController::class, 'getProductAnalysis']);
});
