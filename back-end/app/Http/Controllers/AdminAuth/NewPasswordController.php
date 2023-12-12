<?php

namespace App\Http\Controllers\AdminAuth;

use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $tokenInfo = DB::table('password_resets')
            ->where('email', $request->email)
            ->first();

        if (!$tokenInfo || !Hash::check($request->token, $tokenInfo->token)) {
            return response()->json([
                "message" => "Invalid or expired token",
                "errors" => [
                    "password" => [
                        "Invalid or expired token"
                    ]
                ]
            ], 422);
        }

        // Check if the token is expired
        if (Carbon::parse($tokenInfo->created_at)->addMinutes(1)->isPast()) {
            return response()->json([
                "message" => "Invalid or expired token",
                "errors" => [
                    "password" => [
                        "Invalid or expired token"
                    ]
                ]
            ], 422);
        }

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::broker('admins')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status != Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['status' => __($status), "type" => "success"]);
    }
}
