import {
  Condition,
  Requirement,
  table,
} from '@civ-clone/core-requirement/Requirement';
import { Tier, positionWeights, steps, tierOf, weightsFor } from '../lib/tiers';
import Advance from '@civ-clone/core-science/Advance';
import AdvanceRegistry from '@civ-clone/core-science/AdvanceRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import check from '../lib/check';
import { expect } from 'chai';
import prerequisiteCounts from '../lib/prerequisites';
import tieredCost from '../lib/cost';

// A small tree: Fire and Stone need nothing; Wheel needs Fire; Bronze needs Fire and Stone; Cart needs Wheel and
//  Bronze, so Fire is in its tree twice and counts once. Song needs nothing and nothing needs it.
class Fire extends Advance {}
class Stone extends Advance {}
class Song extends Advance {}
class Wheel extends Advance {}
class Bronze extends Advance {}
class Cart extends Advance {}
class Beyond extends Advance {
  static readonly repeatable = true;
}

const advances = [Fire, Stone, Song, Wheel, Bronze, Cart],
  requirements = table('test:requires', 'requires', [
    [Wheel, Fire],
    [Bronze, Fire, Stone],
    [Cart, Wheel, Bronze, new Condition('test:a-road')],
  ]),
  // 0: Fire, Stone, Song (positions 1–3, mean 2); 1–2: Wheel, Bronze (4–5, mean 4.5); 3+: Cart (6).
  tiers: Tier[] = [
    { upTo: 0, weight: 2 },
    { upTo: 2, weight: 4.5 },
    { upTo: Infinity, weight: 6 },
  ];

describe('prerequisiteCounts', (): void => {
  it('should count every advance in the tree once', (): void => {
    expect([...prerequisiteCounts(advances, requirements)]).to.eql([
      [Fire, 0],
      [Stone, 0],
      [Song, 0],
      [Wheel, 1],
      [Bronze, 2],
      [Cart, 4],
    ]);
  });

  it('should ignore entries about other things', (): void => {
    expect(
      prerequisiteCounts(
        [Fire, Wheel],
        [
          ...requirements,
          ...table('test:obsolete', 'obsoletedBy', [[Wheel, Cart]]),
        ]
      ).get(Wheel)
    ).to.equal(1);
  });

  it('should count only the advances given, not other things an entry names', (): void => {
    class Barracks {}

    expect(
      prerequisiteCounts(
        [Fire, Wheel],
        table('test:requires', 'requires', [[Wheel, Fire, Barracks]])
      ).get(Wheel)
    ).to.equal(1);
  });

  it('should refuse an entry that needs any one of its advances', (): void => {
    expect(() =>
      prerequisiteCounts(advances, [
        new Requirement({
          id: 'test:either',
          subject: Cart,
          relation: 'requires',
          targets: [Wheel, Bronze],
          mode: 'any',
        }),
      ])
    ).to.throw(TypeError, 'test:either');
  });

  it('should refuse a cycle', (): void => {
    expect(() =>
      prerequisiteCounts(
        [Fire, Wheel],
        table('test:cycle', 'requires', [
          [Wheel, Fire],
          [Fire, Wheel],
        ])
      )
    ).to.throw(TypeError, "can't need itself");
  });
});

describe('tiers', (): void => {
  it('should place a count in the first tier that reaches it', (): void => {
    expect([0, 1, 2, 3, 40].map((count) => tierOf(count, tiers))).to.eql([
      0, 1, 1, 2, 2,
    ]);
  });

  it('should refuse a count no tier reaches', (): void => {
    expect(() => tierOf(5, [{ upTo: 4, weight: 1 }])).to.throw(RangeError);
  });

  it("should weight each band by its advances' mean position, adding up to the steady path's cost", (): void => {
    const counts = prerequisiteCounts(advances, requirements),
      weights = positionWeights(counts, [0, 2, Infinity]);

    expect(weights).to.eql([2, 4.5, 6]);
    expect(3 * weights[0] + 2 * weights[1] + weights[2]).to.equal(steps(6));
  });

  it("should give each advance its tier's weight", (): void => {
    expect(
      weightsFor(prerequisiteCounts(advances, requirements), tiers).get(Bronze)
    ).to.equal(4.5);
  });
});

describe('check', (): void => {
  it('should find nothing wrong with good tiers', (): void => {
    expect(check(advances, requirements, tiers)).to.eql([]);
  });

  it('should report weights that cost more than a steady path', (): void => {
    expect(
      check(advances, requirements, [
        { upTo: 0, weight: 2 },
        { upTo: 2, weight: 5 },
        { upTo: Infinity, weight: 6 },
      ])
    ).to.eql([
      'The weights add up to 22 steps, not the 21 of learning each advance in turn.',
    ]);
  });

  it('should report tiers that fall, and an advance cheaper than one it needs', (): void => {
    expect(
      check(advances, requirements, [
        { upTo: 0, weight: 3 },
        { upTo: 2, weight: 6 },
        { upTo: Infinity, weight: 0 },
      ])
    ).to.eql([
      "Tier 3 doesn't rise above tier 2.",
      'Cart costs less than Wheel, which it needs.',
      'Cart costs less than Bronze, which it needs.',
    ]);
  });

  it('should report a last tier that stops short', (): void => {
    expect(check(advances, requirements, [{ upTo: 9, weight: 1 }])).to.eql([
      "The last tier's `upTo` isn't Infinity.",
    ]);
  });
});

describe('tieredCost', (): void => {
  const ruleRegistry = new RuleRegistry(),
    playerResearch = new PlayerResearch(
      new Player(ruleRegistry),
      new AdvanceRegistry(),
      ruleRegistry
    ),
    cost = tieredCost(
      weightsFor(prerequisiteCounts(advances, requirements), tiers),
      (): number => 10,
      (): number => 999
    );

  it("should cost an advance its weight times the rate, whatever's known", (): void => {
    expect(cost(Song, playerResearch)).to.equal(20);
    expect(cost(Cart, playerResearch)).to.equal(60);
  });

  it('should leave an advance with no weight to the fallback', (): void => {
    expect(cost(Beyond, playerResearch)).to.equal(999);
  });
});
