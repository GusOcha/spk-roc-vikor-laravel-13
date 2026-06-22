<?php

namespace App\Services;

/**
 * VIKOR ranking.
 *
 * Ranks alternatives from a weighted decision matrix. Normalisation respects
 * the criterion type:
 *
 *   benefit: best = max, worst = min
 *   cost:    best = min, worst = max
 *
 * For each cell the distance from the ideal is
 *
 *     d_ij = (f*_j - f_ij) / (f*_j - f^-_j)
 *
 * then S_i = Σ_j w_j * d_ij (utility) and R_i = max_j w_j * d_ij (regret).
 * The VIKOR index is
 *
 *     Q_i = v * (S_i - S*) / (S^- - S*) + (1 - v) * (R_i - R*) / (R^- - R*)
 *
 * The best alternative has the smallest Q (ranked #1).
 */
class VikorService
{
    /**
     * @param  array<int|string, array{weight: float, type: string}>  $criteria  Map of criterion key => weight & type.
     * @param  array<int|string, array<int|string, float>>  $scores  Map of alternative key => (criterion key => raw value).
     * @param  float  $v  Weight of the "majority of criteria" strategy (0..1, default 0.5).
     * @return array<string, mixed>  Full computation, including every intermediate step.
     */
    public function calculate(array $criteria, array $scores, float $v = 0.5): array
    {
        $alternativeKeys = array_keys($scores);

        // 1. Best (f*) and worst (f^-) value per criterion.
        $extremes = [];
        foreach ($criteria as $critKey => $criterion) {
            $column = array_map(
                static fn (array $row): float => (float) $row[$critKey],
                $scores,
            );

            $max = max($column);
            $min = min($column);

            $extremes[$critKey] = $criterion['type'] === 'cost'
                ? ['best' => $min, 'worst' => $max]
                : ['best' => $max, 'worst' => $min];
        }

        // 2. Normalised distance from ideal and 3. weighted normalisation.
        $normalized = [];
        $weighted = [];
        foreach ($alternativeKeys as $altKey) {
            foreach ($criteria as $critKey => $criterion) {
                $best = $extremes[$critKey]['best'];
                $worst = $extremes[$critKey]['worst'];
                $range = $best - $worst;

                $distance = $range == 0.0
                    ? 0.0
                    : ($best - (float) $scores[$altKey][$critKey]) / $range;

                $normalized[$altKey][$critKey] = $distance;
                $weighted[$altKey][$critKey] = $criterion['weight'] * $distance;
            }
        }

        // 4. Utility measure S and regret measure R per alternative.
        $s = [];
        $r = [];
        foreach ($alternativeKeys as $altKey) {
            $row = $weighted[$altKey];
            $s[$altKey] = array_sum($row);
            $r[$altKey] = empty($row) ? 0.0 : max($row);
        }

        // 5. VIKOR index Q.
        $sStar = min($s);
        $sMinus = max($s);
        $rStar = min($r);
        $rMinus = max($r);

        $sRange = $sMinus - $sStar;
        $rRange = $rMinus - $rStar;

        $q = [];
        foreach ($alternativeKeys as $altKey) {
            $sTerm = $sRange == 0.0 ? 0.0 : ($s[$altKey] - $sStar) / $sRange;
            $rTerm = $rRange == 0.0 ? 0.0 : ($r[$altKey] - $rStar) / $rRange;

            $q[$altKey] = $v * $sTerm + (1 - $v) * $rTerm;
        }

        // 6. Ranking — smallest Q is best.
        $ranking = [];
        foreach ($alternativeKeys as $altKey) {
            $ranking[] = [
                'key' => $altKey,
                's' => $s[$altKey],
                'r' => $r[$altKey],
                'q' => $q[$altKey],
            ];
        }

        usort($ranking, static fn (array $a, array $b): int => $a['q'] <=> $b['q']);

        foreach ($ranking as $index => &$entry) {
            $entry['rank'] = $index + 1;
        }
        unset($entry);

        return [
            'v' => $v,
            'extremes' => $extremes,
            'normalized' => $normalized,
            'weighted' => $weighted,
            's' => $s,
            'r' => $r,
            'q' => $q,
            's_star' => $sStar,
            's_minus' => $sMinus,
            'r_star' => $rStar,
            'r_minus' => $rMinus,
            'ranking' => $ranking,
        ];
    }
}
