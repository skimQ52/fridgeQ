<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

/**
 * @property array $foods
 */
class Meal extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';

    protected $fillable = [
        'foods',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
