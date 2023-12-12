<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


// Routes Admin
// Route::middleware(['auth:admin'])->prefix('admin')->group(function () {
    
// });

// Routes Admin
Route::prefix('admin')->group(function () {
    require __DIR__.'/AdminRoutes.php';
});



// Routes User
Route::prefix('student')->group(function () {
    require __DIR__.'/StudentRoutes.php';
});


// baghi nrad ga3 les route v Api wjrab csrf token




// Routes student
// Route::middleware(['auth:student'])->prefix('student')->group(function () {
    
// });



