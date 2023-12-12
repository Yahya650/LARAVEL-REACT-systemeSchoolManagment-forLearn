<?php

namespace App\Http\Controllers\StudentAuth;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = Student::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['status' => "The Student Email does not exist.", "type" => "error"]);
        }

        $token = Str::random(64);
        DB::delete('delete from password_resets where email = ?', [$request->email]);
        DB::insert('insert into password_resets (email, token, created_at) values (?, ?, ?)', [$request->email, Hash::make($token), now()]);

        Mail::send('Mails.resetPass', ['url' => config('app.frontend_url') . "/student/password-reset/$token?email={$request->email}", "user" => $user], function ($message) use ($request) {
            $message->to($request->email);
            $message->subject('Reset Password');
        });

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        // $status = Password::broker('students')->sendResetLink(
        //     $request->only('email')
        // );

        // if ($status != Password::RESET_LINK_SENT) {
        //     throw ValidationException::withMessages([
        //         'email' => $status,
        //     ]);
        // }

        return response()->json(['status' => "We have emailed your password reset link!", "type" => "success"]);
    }
}
