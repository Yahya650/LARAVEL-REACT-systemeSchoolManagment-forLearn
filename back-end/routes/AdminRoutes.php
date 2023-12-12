<?php




use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use App\Http\Controllers\AdminAuth\NewPasswordController;
use App\Http\Controllers\AdminAuth\VerifyEmailController;
use App\Http\Controllers\AdminAuth\RegisteredUserController;
use App\Http\Controllers\AdminAuth\PasswordResetLinkController;
use App\Http\Controllers\AdminAuth\AuthenticatedSessionController;
use App\Http\Controllers\AdminAuth\EmailVerificationNotificationController;
use App\Http\Controllers\AdminController;




Route::middleware(['guest:admin,student'])->group(function () {

    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);

    Route::post('/reset-password', [NewPasswordController::class, 'store']);
});

Route::middleware(['auth:admin'])->group(function () {

    Route::get('/profile', [AdminController::class, 'index']);

    Route::middleware(['isAdminAuth'])->group(function () {

        Route::get('/all-students', [StudentController::class, 'get_all_students'])->withoutMiddleware('isAdminAuth');
        Route::get('/generate-username', [StudentController::class, 'generate_userName'])->withoutMiddleware('isAdminAuth');
        Route::put('/reset-password-student/{id}', [StudentController::class, 'resetPassword']);
        Route::delete('/delete-student/{id}', [StudentController::class, 'destroy']);
        Route::put('/update-student/{id}', [StudentController::class, 'update']);
        Route::get('/show-student/{id}', [StudentController::class, 'show']);
        Route::post('/create-student', [StudentController::class, 'store'])->withoutMiddleware('isAdminAuth');
    });


    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class);

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store']);

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});
