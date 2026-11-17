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
export declare const tierOf: (count: number, tiers: readonly Tier[]) => number;
/** Each advance's weight: its tier's. */
export declare const weightsFor: (
  counts: ReadonlyMap<typeof Advance, number>,
  tiers: readonly Tier[]
) => Map<typeof Advance, number>;
/**
 * The weight each band would have to cost as much as learning steadily does where the n-th advance costs n: sort the
 * advances by their number of prerequisites, number them 1, 2, 3… in that order, and average the numbers in each band.
 * Advances with the same count are in the same band, so the order among them doesn't matter.
 *
 * Unrounded, they add up to exactly 1 + 2 + … + the number of advances, as today's cost does. A ruleset rounds them
 * to whole numbers that keep that total, and `check` confirms it.
 */
export declare const positionWeights: (
  counts: ReadonlyMap<typeof Advance, number>,
  bands: readonly number[]
) => number[];
/** 1 + 2 + … + `advances`: what learning that many advances costs, in steps, when the n-th costs n. */
export declare const steps: (advances: number) => number;
