<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {

        $type = $request->input('type');
        $temperature = $request->input('temperature');
        $ingredients = implode(", ", $request->input('ingredients'));

        $prompt =
            "Can you give me a " . $type . " meal idea with this ingredient list:" .
            $ingredients . "With exclusively output in this format:\nName:\nDescription:\nInstructions:";

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => "gpt-3.5-turbo",
            "messages" => [
                [
                    "role" => "user",
                    "content" => $prompt
                ]
            ],
            'temperature' => $temperature,
            'max_tokens' => 300,
        ]);

        $sections = preg_split('/\bName:|Description:|Instructions:/', $response->json()['choices'][0]['message']['content']);

        $recipe = [
            'name' => trim($sections[1]),
            'description' => trim($sections[2]),
            'recipe' => trim($sections[3]),
        ];

        return response()->json(['data' => $recipe, 'status' => 200]);

    }
}
