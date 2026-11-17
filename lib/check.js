"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const tiers_1 = require("./tiers");
const prerequisites_1 = require("./prerequisites");
/**
 * What is wrong with a ruleset's tiers, as sentences: none when every advance has a tier, the tiers rise, the weights
 * add up to what learning every advance in turn costs (1 + 2 + … + their number), and no advance is cheaper than one
 * it needs. For a ruleset's tests.
 */
const check = (advances, requirements, tiers) => {
    const problems = [], counts = (0, prerequisites_1.default)(advances, requirements);
    tiers.forEach((tier, index) => {
        if (index > 0 &&
            (tier.upTo <= tiers[index - 1].upTo ||
                tier.weight < tiers[index - 1].weight)) {
            problems.push(`Tier ${index + 1} doesn't rise above tier ${index}.`);
        }
    });
    if (tiers.length === 0 || tiers[tiers.length - 1].upTo !== Infinity) {
        problems.push("The last tier's `upTo` isn't Infinity.");
        return problems;
    }
    const total = [...counts.values()].reduce((sum, count) => sum + tiers[(0, tiers_1.tierOf)(count, tiers)].weight, 0), expected = (0, tiers_1.steps)(advances.length);
    if (total !== expected) {
        problems.push(`The weights add up to ${total} steps, not the ${expected} of learning each advance in turn.`);
    }
    requirements
        .filter((entry) => entry.relation === 'requires' &&
        counts.has(entry.subject))
        .forEach((entry) => entry.targets
        .filter((target) => counts.has(target))
        .forEach((Required) => {
        const Subject = entry.subject;
        if (tiers[(0, tiers_1.tierOf)(counts.get(Subject), tiers)].weight <
            tiers[(0, tiers_1.tierOf)(counts.get(Required), tiers)].weight) {
            problems.push(`${Subject.name} costs less than ${Required.name}, which it needs.`);
        }
    }));
    return problems;
};
exports.check = check;
exports.default = exports.check;
//# sourceMappingURL=check.js.map