<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Food extends Model
{
    protected $connection = 'mongodb';

    protected $fillable = [
        'name',
        'type',
        'quantity',
        'updated_at',
        'created_at',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
