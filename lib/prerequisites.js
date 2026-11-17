"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prerequisiteCounts = void 0;
/**
 * How many advances each of `advances` needs before it can be researched: every advance in its tree of prerequisites,
 * each counted once, however many paths lead to it. That is the fewest a player can know when they start on it.
 *
 * Read from the ruleset's `requires` entries whose subject is an advance. Only entries that need all their targets
 * can be counted: an entry that needs any one of them (`mode: 'any'`) has no one tree, so it is refused rather than
 * guessed at. A target that isn't an advance (a `Condition`) has no tree and isn't counted. An advance with no entry
 * needs nothing.
 */
const prerequisiteCounts = (advances, requirements) => {
    const needs = new Map();
    requirements
        .filter((entry) => entry.relation === 'requires' &&
        advances.includes(entry.subject))
        .forEach((entry) => {
        var _a;
        if (entry.mode !== 'all') {
            throw new TypeError(`'${entry.id}' needs any one of its advances, so its prerequisites can't be counted.`);
        }
        const Subject = entry.subject;
        needs.set(Subject, [
            ...((_a = needs.get(Subject)) !== null && _a !== void 0 ? _a : []),
            ...entry.targets.filter((target) => typeof target === 'function'),
        ]);
    });
    const trees = new Map(), treeOf = (AdvanceType, visiting = []) => {
        var _a;
        const known = trees.get(AdvanceType);
        if (known) {
            return known;
        }
        if (visiting.includes(AdvanceType)) {
            throw new TypeError(`${[...visiting, AdvanceType]
                .map((Item) => Item.name)
                .join(' → ')}: an advance can't need itself.`);
        }
        const tree = new Set();
        ((_a = needs.get(AdvanceType)) !== null && _a !== void 0 ? _a : []).forEach((Required) => {
            tree.add(Required);
            treeOf(Required, [...visiting, AdvanceType]).forEach((Earlier) => tree.add(Earlier));
        });
        trees.set(AdvanceType, tree);
        return tree;
    };
    return new Map(advances.map((AdvanceType) => [
        AdvanceType,
        treeOf(AdvanceType).size,
    ]));
};
exports.prerequisiteCounts = prerequisiteCounts;
exports.default = exports.prerequisiteCounts;
//# sourceMappingURL=prerequisites.js.map