<?php

namespace Tests\Unit;

use App\Services\RocService;
use PHPUnit\Framework\TestCase;

class RocServiceTest extends TestCase
{
    public function test_it_reproduces_the_sample_case_weights(): void
    {
        $service = new RocService;

        // Priorities from the original sample case (1 = most important).
        $weights = $service->computeWeights([
            'K1' => 3,
            'K2' => 1,
            'K3' => 2,
            'K4' => 4,
            'K5' => 5,
        ]);

        $this->assertEqualsWithDelta(0.457, $weights['K2'], 0.001);
        $this->assertEqualsWithDelta(0.257, $weights['K3'], 0.001);
        $this->assertEqualsWithDelta(0.157, $weights['K1'], 0.001);
        $this->assertEqualsWithDelta(0.090, $weights['K4'], 0.001);
        $this->assertEqualsWithDelta(0.040, $weights['K5'], 0.001);
    }

    public function test_weights_sum_to_one(): void
    {
        $service = new RocService;

        $weights = $service->computeWeights([1 => 1, 2 => 2, 3 => 3, 4 => 4]);

        $this->assertEqualsWithDelta(1.0, array_sum($weights), 0.0001);
    }

    public function test_empty_input_returns_empty(): void
    {
        $this->assertSame([], (new RocService)->computeWeights([]));
    }
}
