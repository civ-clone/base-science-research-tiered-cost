import { Tier } from './tiers';
import Advance from '@civ-clone/core-science/Advance';
import Requirement from '@civ-clone/core-requirement/Requirement';
/**
 * What is wrong with a ruleset's tiers, as sentences: none when every advance has a tier, the tiers rise, the weights
 * add up to what learning every advance in turn costs (1 + 2 + … + their number), and no advance is cheaper than one
 * it needs. For a ruleset's tests.
 */
export declare const check: (
  advances: (typeof Advance)[],
  requirements: readonly Requirement[],
  tiers: readonly Tier[]
) => string[];
export default check;
