<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Arr;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    public function assertArraySubset(array $expected, array $actual): void
    {
        $this->assertEquals($expected, Arr::only($actual, array_keys($expected)));
    }
}
