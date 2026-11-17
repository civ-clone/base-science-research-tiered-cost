import Advance from '@civ-clone/core-science/Advance';
import Requirement from '@civ-clone/core-requirement/Requirement';
/**
 * How many advances each of `advances` needs before it can be researched: every advance in its tree of prerequisites,
 * each counted once, however many paths lead to it. That is the fewest a player can know when they start on it.
 *
 * Read from the ruleset's `requires` entries whose subject is an advance. Only entries that need all their targets
 * can be counted: an entry that needs any one of them (`mode: 'any'`) has no one tree, so it is refused rather than
 * guessed at. A target that isn't an advance (a `Condition`) has no tree and isn't counted. An advance with no entry
 * needs nothing.
 */
export declare const prerequisiteCounts: (
  advances: (typeof Advance)[],
  requirements: readonly Requirement[]
) => Map<typeof Advance, number>;
export default prerequisiteCounts;
