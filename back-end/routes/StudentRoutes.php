<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentAuth\NewPasswordController;
use App\Http\Controllers\StudentAuth\VerifyEmailController;
use App\Http\Controllers\StudentAuth\RegisteredUserController;
use App\Http\Controllers\StudentAuth\PasswordResetLinkController;
use App\Http\Controllers\StudentAuth\AuthenticatedSessionController;
use App\Http\Controllers\StudentAuth\EmailVerificationNotificationController;



Route::middleware(['guest:admin,student'])->group(function () {

    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']); // hdi katsift link lli fih _token, email mn ba3d makatwrak 3la lien kiddik l page f react katkon m9adha

    Route::post('/reset-password', [NewPasswordController::class, 'store']); // dik l page fiha form katsift request lhad route, dak request fih password, confirmation_password, email, _token
});



Route::middleware(['auth:student'])->group(function () {

    Route::get('/profile', [StudentController::class, 'index']);


    Route::post('/add-email', [StudentController::class, 'add_email']);
    Route::post('/change-password', [StudentController::class, 'change_pass']);

    // Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class);

    // Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});
