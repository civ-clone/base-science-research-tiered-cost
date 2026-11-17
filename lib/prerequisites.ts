import Advance from '@civ-clone/core-science/Advance';
import Requirement from '@civ-clone/core-requirement/Requirement';

/**
 * How many advances each of `advances` needs before it can be researched: every advance in its tree of prerequisites,
 * each counted once, however many paths lead to it. That is the fewest a player can know when they start on it.
 *
 * Read from the ruleset's `requires` entries whose subject is an advance. Only entries that need all their targets
 * can be counted: an entry that needs any one of them (`mode: 'any'`) has no one tree, so it is refused rather than
 * guessed at. Only targets among `advances` are counted: anything else an entry names (a `Condition`, a unit) has no
 * tree here. Entries are matched to their subject exactly, not through a superclass, and their `range` and `where`
 * are ignored. An advance with no entry needs nothing.
 */
export const prerequisiteCounts = (
  advances: (typeof Advance)[],
  requirements: readonly Requirement[]
): Map<typeof Advance, number> => {
  const needs = new Map<typeof Advance, (typeof Advance)[]>();

  requirements
    .filter(
      (entry: Requirement): boolean =>
        entry.relation === 'requires' &&
        advances.includes(entry.subject as typeof Advance)
    )
    .forEach((entry: Requirement): void => {
      if (entry.mode !== 'all') {
        throw new TypeError(
          `'${entry.id}' needs any one of its advances, so its prerequisites can't be counted.`
        );
      }

      const Subject = entry.subject as typeof Advance;

      needs.set(Subject, [
        ...(needs.get(Subject) ?? []),
        ...entry.targets.filter((target): target is typeof Advance =>
          advances.includes(target as typeof Advance)
        ),
      ]);
    });

  const trees = new Map<typeof Advance, Set<typeof Advance>>(),
    treeOf = (
      AdvanceType: typeof Advance,
      visiting: (typeof Advance)[] = []
    ): Set<typeof Advance> => {
      const known = trees.get(AdvanceType);

      if (known) {
        return known;
      }

      if (visiting.includes(AdvanceType)) {
        throw new TypeError(
          `${[...visiting, AdvanceType]
            .map((Item) => Item.name)
            .join(' → ')}: an advance can't need itself.`
        );
      }

      const tree = new Set<typeof Advance>();

      (needs.get(AdvanceType) ?? []).forEach(
        (Required: typeof Advance): void => {
          tree.add(Required);
          treeOf(Required, [...visiting, AdvanceType]).forEach(
            (Earlier: typeof Advance) => tree.add(Earlier)
          );
        }
      );

      trees.set(AdvanceType, tree);

      return tree;
    };

  return new Map(
    advances.map((AdvanceType: typeof Advance): [typeof Advance, number] => [
      AdvanceType,
      treeOf(AdvanceType).size,
    ])
  );
};

export default prerequisiteCounts;
