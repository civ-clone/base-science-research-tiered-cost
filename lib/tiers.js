"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.steps = exports.positionWeights = exports.weightsFor = exports.tierOf = void 0;
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
/**
 * The weight each band would have to cost as much as learning steadily does where the n-th advance costs n: sort the
 * advances by their number of prerequisites, number them 1, 2, 3… in that order, and average the numbers in each band.
 * Advances with the same count are in the same band, so the order among them doesn't matter.
 *
 * Unrounded, they add up to exactly 1 + 2 + … + the number of advances, as today's cost does. A ruleset rounds them
 * to whole numbers that keep that total, and `check` confirms it.
 */
const positionWeights = (counts, bands) => {
    const sorted = [...counts.values()].sort((a, b) => a - b), sums = bands.map(() => 0), sizes = bands.map(() => 0);
    sorted.forEach((count, index) => {
        const band = (0, exports.tierOf)(count, bands.map((upTo) => ({ upTo, weight: 0 })));
        sums[band] += index + 1;
        sizes[band]++;
    });
    return sums.map((sum, band) => sizes[band] === 0 ? 0 : sum / sizes[band]);
};
exports.positionWeights = positionWeights;
/** 1 + 2 + … + `advances`: what learning that many advances costs, in steps, when the n-th costs n. */
const steps = (advances) => (advances * (advances + 1)) / 2;
exports.steps = steps;
//# sourceMappingURL=tiers.js.map