<?php

namespace App\Http\Controllers\AdminAuth;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Mail\VerifyEmailAdmin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Mail;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {


        // try {
        //     Mail::to($request->user('admin')->email)->send(new VerifyEmailAdmin($request->user('admin')));
        // } catch (\Throwable $th) {
        //     return response()->json(['status' => 'Verification link not sent!', 'type' => 'error']);
        //     //throw $th;
        // }

        if ($request->user('admin')->hasVerifiedEmail()) {
            return redirect()->intended(RouteServiceProvider::HOME);
        }

        $request->user('admin')->sendEmailVerificationNotification();
 
        return response()->json(['status' => 'Verification link sent!', 'type' => 'success']);
    }
}
