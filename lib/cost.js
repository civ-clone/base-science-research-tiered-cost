"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tieredCost = void 0;
/**
 * A `Cost` effect where each advance costs its own weight times the ruleset's `rate` (its difficulty, era and the like,
 * for this player now), whatever else the player knows. An advance with no weight, such as one that can be repeated,
 * costs what `otherwise` says.
 */
const tieredCost = (weights, rate, otherwise) => (AdvanceType, playerResearch) => {
    const weight = weights.get(AdvanceType);
    if (weight === undefined) {
        return otherwise(AdvanceType, playerResearch);
    }
    return weight * rate(playerResearch);
};
exports.tieredCost = tieredCost;
exports.default = exports.tieredCost;
//# sourceMappingURL=cost.js.map