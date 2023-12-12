<?php

namespace App\Http\Controllers\StudentAuth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Student;
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
        $request->validate([
            'email_or_username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $credentials = $request->only('email_or_username', 'password');

        // Check if the login attempt with email is successful
        if (Auth::guard('student')->attempt(['email' => $credentials['email_or_username'], 'password' => $credentials['password']])) {
            // Authentication successful
            return response()->noContent();
        }

        // If the email attempt fails, try with the username
        if (Auth::guard('student')->attempt(['user_name' => $credentials['email_or_username'], 'password' => $credentials['password']])) {
            // Authentication successful
            return response()->noContent();
        }

        // Both attempts failed, return an error response
        return response()->json([
            'errors'  => ['email_or_username' => ["Invalid email/username or password"]],
            'message' => "Invalid email/username or password"
        ], 422);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('student')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
