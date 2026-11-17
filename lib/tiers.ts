import Advance from '@civ-clone/core-science/Advance';

/**
 * One band of advances by how many prerequisites they have: up to and including `upTo`, above the previous tier's.
 * Every advance in it costs `weight` times the ruleset's rate.
 */
export interface Tier {
  upTo: number;
  weight: number;
}

/** The index of the tier an advance with `count` prerequisites falls in: the first whose `upTo` reaches it. */
export const tierOf = (count: number, tiers: readonly Tier[]): number => {
  const index = tiers.findIndex((tier: Tier): boolean => count <= tier.upTo);

  if (index === -1) {
    throw new RangeError(
      `No tier reaches ${count} prerequisites: the last tier's \`upTo\` should be Infinity.`
    );
  }

  return index;
};

/** Each advance's weight: its tier's. */
export const weightsFor = (
  counts: ReadonlyMap<typeof Advance, number>,
  tiers: readonly Tier[]
): Map<typeof Advance, number> =>
  new Map(
    [...counts].map(([AdvanceType, count]): [typeof Advance, number] => [
      AdvanceType,
      tiers[tierOf(count, tiers)].weight,
    ])
  );

/**
 * The weight each band would have to cost as much as learning steadily does where the n-th advance costs n: sort the
 * advances by their number of prerequisites, number them 1, 2, 3… in that order, and average the numbers in each band.
 * Advances with the same count are in the same band, so the order among them doesn't matter.
 *
 * Unrounded, they add up to exactly 1 + 2 + … + the number of advances, as today's cost does. A ruleset rounds them
 * to whole numbers that keep that total, and `check` confirms it.
 */
export const positionWeights = (
  counts: ReadonlyMap<typeof Advance, number>,
  bands: readonly number[]
): number[] => {
  const sorted = [...counts.values()].sort((a, b) => a - b),
    sums = bands.map(() => 0),
    sizes = bands.map(() => 0);

  sorted.forEach((count: number, index: number): void => {
    const band = tierOf(
      count,
      bands.map((upTo: number): Tier => ({ upTo, weight: 0 }))
    );

    sums[band] += index + 1;
    sizes[band]++;
  });

  return sums.map((sum: number, band: number): number =>
    sizes[band] === 0 ? 0 : sum / sizes[band]
  );
};

/** 1 + 2 + … + `advances`: what learning that many advances costs, in steps, when the n-th costs n. */
export const steps = (advances: number): number =>
  (advances * (advances + 1)) / 2;
