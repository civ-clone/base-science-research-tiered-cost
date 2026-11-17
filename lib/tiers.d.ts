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
 * What the n-th advance a player learns costs, in steps of its rate, by a ruleset's own cost: n, where it costs the
 * advances known times a rate, as Civilization's does. A ruleset whose rate also grows with the advances known gives
 * its own: Civilization II's adds up to three quarters over the first twenty.
 */
export type StepCost = (n: number) => number;
/** n: the n-th advance costs n steps. */
export declare const byPosition: StepCost;
/**
 * The weight each band would have to cost as much as learning steadily does: sort the advances by their number of
 * prerequisites, number them 1, 2, 3… in that order, and average the cost of each number (`stepCost`, n unless told
 * otherwise) in each band. Advances with the same count are in the same band, so the order among them doesn't matter.
 *
 * Unrounded, they add up to exactly what learning every advance in turn costs (`steps`), as today's cost does. A
 * ruleset rounds them to whole numbers that keep that total, or near it, and `check` confirms it.
 */
export declare const positionWeights: (
  counts: ReadonlyMap<typeof Advance, number>,
  bands: readonly number[],
  stepCost?: StepCost
) => number[];
/**
 * What learning that many advances in turn costs, in steps: 1 + 2 + … + `advances` when the n-th costs n, or the sum
 * of `stepCost` over them.
 */
export declare const steps: (advances: number, stepCost?: StepCost) => number;
