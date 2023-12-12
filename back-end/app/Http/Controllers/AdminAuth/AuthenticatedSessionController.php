<?php

namespace App\Http\Controllers\AdminAuth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {

        // if (Admin::where('email', $request->email)->doesntExist()) {
        //     return response()->json([
        //         'errors'  => ['email' => ["Invalid email or password"]],
        //         'message' => "Invalid email or password"
        //     ], 422);
        // }

        // $admin = Admin::where('email', $request->email)->first();
        // if ($admin->email_verified_at === null) {
        //     return response()->json([
        //         'errors'  => ['email' => ["Your email is not verified"]],
        //         'message' => "Your email is not verified"
        //     ], 422);
        // }


        // if (!Auth::guard('admin')->attempt(['email' => $request->email, 'password' => $request->password])) {
        //     return response()->json([
        //         'errors'  => ['email' => ["Invalid email or password"]],
        //         'message' => "Invalid email or password"
        //     ], 422);
        // }

        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::guard('admin')->attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json([
                'errors'  => ['email' => ["Invalid email or password"]],
                'message' => "Invalid email or password"
            ], 422);



            // RateLimiter::hit($this->throttleKey());

            // throw ValidationException::withMessages([
            //     'email' => __('auth.failed'),
            // ]);
        }
        // $request->authenticate('admin');

        $request->session()->regenerate();

        return response()->noContent();
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
