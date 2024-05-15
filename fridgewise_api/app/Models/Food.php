<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class Food extends Model
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'name',
        'type',
        'quantity',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
