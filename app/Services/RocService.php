<?php

namespace App\Services;

/**
 * Rank Order Centroid (ROC) criteria weighting.
 *
 * Given a priority/rank for each criterion (1 = most important), the ROC
 * weight of the criterion ranked at position k out of n is:
 *
 *     w_k = (1 / n) * Σ_{i=k}^{n} (1 / i)
 *
 * This implementation derives the weight directly from each criterion's
 * `prioritas` value, matching the behaviour of the original application:
 *
 *     w_x = (1 / n) * Σ_{ y : prioritas(y) >= prioritas(x) } (1 / prioritas(y))
 */
class RocService
{
    /**
     * Compute ROC weights.
     *
     * @param  array<int|string, int>  $priorities  Map of identifier => priority rank.
     * @return array<int|string, float>  Map of identifier => weight (sums to ~1).
     */
    public function computeWeights(array $priorities): array
    {
        $count = count($priorities);

        if ($count === 0) {
            return [];
        }

        $weights = [];

        foreach ($priorities as $key => $priority) {
            $sum = 0.0;

            foreach ($priorities as $otherPriority) {
                if ($otherPriority >= $priority) {
                    $sum += 1 / $otherPriority;
                }
            }

            $weights[$key] = $sum / $count;
        }

        return $weights;
    }
}
