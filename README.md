# base-science-research-tiered-cost

Research costs fixed per advance by tier, for a ruleset to offer as an alternative to a cost that grows with the
number of advances known (civ-clone/web-renderer#1072). An advance costs the same however a player reaches it, so a
beeline that skips the dead ends costs what learning steadily does, while learning everything costs what it always
did.

- `lib/prerequisites`: `prerequisiteCounts(advances, requirements)`, how many advances each one needs in its whole
  tree, read from the ruleset's `requires` entries (`core-requirement`).
- `lib/tiers`: `Tier` (`upTo` prerequisites, `weight`), `tierOf`, `weightsFor` (each advance's weight), and
  `positionWeights(counts, bands)`: each band's weight when the advances are numbered 1, 2, 3… in order of their
  prerequisites, and each band costs the mean of its numbers. Those add up to 1 + 2 + … + the number of advances
  (`steps`), the cost of learning each in turn when the n-th costs n.
- `lib/cost`: `tieredCost(weights, rate, otherwise)`, a `Cost` effect: weight × the ruleset's rate for the player,
  and `otherwise` for an advance with no weight (one that can be repeated).
- `lib/check`: `check(advances, requirements, tiers)`, what is wrong with a ruleset's tiers, for its tests: tiers that
  don't rise, weights that don't add up to `steps`, an advance cheaper than one it needs.

## Making a ruleset's tiers

1. Count each advance's prerequisites with `prerequisiteCounts`.
2. Choose bands of counts, a handful, so each holds advances of a similar age.
3. Take `positionWeights` for those bands and round them to whole numbers that keep the total.
4. Assert `check` finds nothing.

A library: it registers no rules. See `civ1-enhanced` for Civilization's tiers and the rule set that uses them.
