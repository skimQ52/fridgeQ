<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class AuthModel
{
    public function handle(Request $request, Closure $next, string $model)
    {
        $classes = [
            'user' => User::class,
        ];

        $modelType = $classes[$model] ?? null;

        $user = auth()->user();
        abort_unless($user instanceof $modelType, 401, 'Access denied based on authenticated model.');

        return $next($request);
    }
}
