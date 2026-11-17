import { StepCost, Tier } from './tiers';
import Advance from '@civ-clone/core-science/Advance';
import Requirement from '@civ-clone/core-requirement/Requirement';
/** How `check` measures the total: by a ruleset's own `stepCost`, and within `tolerance` (a fraction) of it. */
export interface CheckOptions {
  stepCost?: StepCost;
  tolerance?: number;
}
/**
 * What is wrong with a ruleset's tiers, as sentences: none when every advance has a tier, the tiers rise, the weights
 * add up to what learning every advance in turn costs (`steps`: 1 + 2 + … + their number unless told otherwise, and
 * exactly unless given a `tolerance`), and no advance is cheaper than one it needs. For a ruleset's tests.
 */
export declare const check: (
  advances: (typeof Advance)[],
  requirements: readonly Requirement[],
  tiers: readonly Tier[],
  { stepCost, tolerance }?: CheckOptions
) => string[];
export default check;
