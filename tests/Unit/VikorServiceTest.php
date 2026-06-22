<?php

namespace Tests\Unit;

use App\Services\VikorService;
use PHPUnit\Framework\TestCase;

class VikorServiceTest extends TestCase
{
    /**
     * @return array{0: array<string, array{weight: float, type: string}>, 1: array<string, array<string, float>>}
     */
    private function sampleCase(): array
    {
        $criteria = [
            'K1' => ['weight' => 0.157, 'type' => 'benefit'],
            'K2' => ['weight' => 0.457, 'type' => 'benefit'],
            'K3' => ['weight' => 0.257, 'type' => 'benefit'],
            'K4' => ['weight' => 0.090, 'type' => 'cost'],
            'K5' => ['weight' => 0.040, 'type' => 'benefit'],
        ];

        $scores = [
            'Shopee' => ['K1' => 43, 'K2' => 41, 'K3' => 40, 'K4' => 44, 'K5' => 41],
            'Lazada' => ['K1' => 42, 'K2' => 44, 'K3' => 43, 'K4' => 41, 'K5' => 36],
            'Bukalapak' => ['K1' => 41, 'K2' => 45, 'K3' => 40, 'K4' => 43, 'K5' => 42],
            'Facebook Marketplace' => ['K1' => 46, 'K2' => 48, 'K3' => 43, 'K4' => 40, 'K5' => 45],
            'Tokopedia' => ['K1' => 41, 'K2' => 47, 'K3' => 38, 'K4' => 41, 'K5' => 42],
        ];

        return [$criteria, $scores];
    }

    public function test_it_ranks_the_sample_case_correctly(): void
    {
        [$criteria, $scores] = $this->sampleCase();

        $result = (new VikorService)->calculate($criteria, $scores);

        $order = array_map(static fn (array $e): string => $e['key'], $result['ranking']);

        $this->assertSame([
            'Facebook Marketplace', // ideal on every criterion → Q = 0
            'Lazada',
            'Bukalapak',
            'Tokopedia',
            'Shopee',
        ], $order);
    }

    public function test_best_alternative_has_smallest_q(): void
    {
        [$criteria, $scores] = $this->sampleCase();

        $result = (new VikorService)->calculate($criteria, $scores);

        $this->assertSame(1, $result['ranking'][0]['rank']);
        $this->assertEqualsWithDelta(0.0, $result['q']['Facebook Marketplace'], 0.0001);
        $this->assertEqualsWithDelta(1.0, $result['q']['Shopee'], 0.0001);
    }

    public function test_cost_criteria_favour_lower_values(): void
    {
        $criteria = ['C' => ['weight' => 1.0, 'type' => 'cost']];
        $scores = ['cheap' => ['C' => 10], 'pricey' => ['C' => 100]];

        $result = (new VikorService)->calculate($criteria, $scores);

        // The cheaper option must win for a cost criterion.
        $this->assertSame('cheap', $result['ranking'][0]['key']);
    }
}
