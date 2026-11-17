import { StepCost, Tier, steps, tierOf } from './tiers';
import Advance from '@civ-clone/core-science/Advance';
import Requirement from '@civ-clone/core-requirement/Requirement';
import prerequisiteCounts from './prerequisites';

/** How `check` measures the total: by a ruleset's own `stepCost`, and within `tolerance` (a fraction) of it. */
export interface CheckOptions {
  stepCost?: StepCost;
  tolerance?: number;
}

/**
 * What is wrong with a ruleset's tiers, as sentences: none when every advance has a tier, the tiers rise, the weights
 * add up to what learning every advance in turn costs (`steps`: 1 + 2 + … + their number unless told otherwise, and
 * exactly unless given a `tolerance`), and no advance is cheaper than one it needs. For a ruleset's tests.
 */
export const check = (
  advances: (typeof Advance)[],
  requirements: readonly Requirement[],
  tiers: readonly Tier[],
  { stepCost, tolerance = 0 }: CheckOptions = {}
): string[] => {
  const problems: string[] = [],
    counts = prerequisiteCounts(advances, requirements);

  tiers.forEach((tier: Tier, index: number): void => {
    if (
      index > 0 &&
      (tier.upTo <= tiers[index - 1].upTo ||
        tier.weight < tiers[index - 1].weight)
    ) {
      problems.push(`Tier ${index + 1} doesn't rise above tier ${index}.`);
    }
  });

  if (tiers.length === 0 || tiers[tiers.length - 1].upTo !== Infinity) {
    problems.push("The last tier's `upTo` isn't Infinity.");

    return problems;
  }

  const total = [...counts.values()].reduce(
      (sum: number, count: number): number =>
        sum + tiers[tierOf(count, tiers)].weight,
      0
    ),
    expected = steps(advances.length, stepCost);

  if (Math.abs(total - expected) > tolerance * expected) {
    problems.push(
      `The weights add up to ${total} steps, not the ${expected} of learning each advance in turn.`
    );
  }

  requirements
    .filter(
      (entry: Requirement): boolean =>
        entry.relation === 'requires' &&
        counts.has(entry.subject as typeof Advance)
    )
    .forEach((entry: Requirement): void =>
      entry.targets
        .filter((target): target is typeof Advance =>
          counts.has(target as typeof Advance)
        )
        .forEach((Required: typeof Advance): void => {
          const Subject = entry.subject as typeof Advance;

          if (
            tiers[tierOf(counts.get(Subject)!, tiers)].weight <
            tiers[tierOf(counts.get(Required)!, tiers)].weight
          ) {
            problems.push(
              `${Subject.name} costs less than ${Required.name}, which it needs.`
            );
          }
        })
    );

  return problems;
};

export default check;
