"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steps = exports.positionWeights = exports.byPosition = exports.weightsFor = exports.tierOf = void 0;
/** The index of the tier an advance with `count` prerequisites falls in: the first whose `upTo` reaches it. */
const tierOf = (count, tiers) => {
    const index = tiers.findIndex((tier) => count <= tier.upTo);
    if (index === -1) {
        throw new RangeError(`No tier reaches ${count} prerequisites: the last tier's \`upTo\` should be Infinity.`);
    }
    return index;
};
exports.tierOf = tierOf;
/** Each advance's weight: its tier's. */
const weightsFor = (counts, tiers) => new Map([...counts].map(([AdvanceType, count]) => [
    AdvanceType,
    tiers[(0, exports.tierOf)(count, tiers)].weight,
]));
exports.weightsFor = weightsFor;
/** n: the n-th advance costs n steps. */
const byPosition = (n) => n;
exports.byPosition = byPosition;
/**
 * The weight each band would have to cost as much as learning steadily does: sort the advances by their number of
 * prerequisites, number them 1, 2, 3… in that order, and average the cost of each number (`stepCost`, n unless told
 * otherwise) in each band. Advances with the same count are in the same band, so the order among them doesn't matter.
 *
 * Unrounded, they add up to exactly what learning every advance in turn costs (`steps`), as today's cost does. A
 * ruleset rounds them to whole numbers that keep that total, or near it, and `check` confirms it.
 */
const positionWeights = (counts, bands, stepCost = exports.byPosition) => {
    const sorted = [...counts.values()].sort((a, b) => a - b), sums = bands.map(() => 0), sizes = bands.map(() => 0);
    sorted.forEach((count, index) => {
        const band = (0, exports.tierOf)(count, bands.map((upTo) => ({ upTo, weight: 0 })));
        sums[band] += stepCost(index + 1);
        sizes[band]++;
    });
    return sums.map((sum, band) => sizes[band] === 0 ? 0 : sum / sizes[band]);
};
exports.positionWeights = positionWeights;
/**
 * What learning that many advances in turn costs, in steps: 1 + 2 + … + `advances` when the n-th costs n, or the sum
 * of `stepCost` over them.
 */
const steps = (advances, stepCost = exports.byPosition) => stepCost === exports.byPosition
    ? (advances * (advances + 1)) / 2
    : Array.from({ length: advances }, (_, index) => stepCost(index + 1)).reduce((sum, step) => sum + step, 0);
exports.steps = steps;
//# sourceMappingURL=tiers.js.map