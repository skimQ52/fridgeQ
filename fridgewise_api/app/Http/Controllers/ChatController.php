<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => "gpt-3.5-turbo",
            "messages" => [
                [
                    "role" => "user",
                    "content" => "Helloo?"
                ]
            ],
//            'prompt' => $request->input('message'),
//            'temperature' => 0.7,
            'max_tokens' => 300,
        ]);

        return response()->json($response->json());
    }
}
