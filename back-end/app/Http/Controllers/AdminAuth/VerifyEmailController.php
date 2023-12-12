<?php

namespace App\Http\Controllers\AdminAuth;

use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {

        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(
                config('app.frontend_url') . '/admin/dashboard' . '?verified=1'
            );
        }
        
        if (!$request->user()->email_verified_at && Carbon::now()->diffInMinutes($request->user()->email_verified_at) > 1) {
            return redirect()->intended(
                config('app.frontend_url') . '/admin/dashboard' . '?token_expired=1'
            );
        }


        if ($request->user()->markEmailAsVerified()) {      
            event(new Verified($request->user()));
        }

        return redirect()->intended(
            config('app.frontend_url') . '/admin/dashboard' . '?verified=1'
        );
    }
}
