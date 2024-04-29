<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $connection = 'mongodb';

    protected $fillable = [
        'foods',
        'user_id',
    ];
}
