import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
/** What a ruleset's `Cost` rule is given: the advance about to be researched and the player researching it. */
export type CostOf = (
  AdvanceType: typeof Advance,
  playerResearch: PlayerResearch
) => number;
/**
 * A `Cost` effect where each advance costs its own weight times the ruleset's `rate` (its difficulty, era and the like,
 * for this player now), whatever else the player knows. An advance with no weight, such as one that can be repeated,
 * costs what `otherwise` says.
 */
export declare const tieredCost: (
  weights: ReadonlyMap<typeof Advance, number>,
  rate: (playerResearch: PlayerResearch) => number,
  otherwise: CostOf
) => CostOf;
export default tieredCost;
