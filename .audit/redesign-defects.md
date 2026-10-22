# Redesign defects

All closed before handoff.

- P2 calendar hit regions overlapped at1100px. Reproduced28px targets at23.77px spacing; repaired to28.49px. Independent recheck passed.
- P2 valid long titles overflowed mobile reader. Reproduced1516px document inside390px viewport; repaired to375px. Independent recheck passed.
- P2 controls followed filtered notes. Controls now precede cards in DOM and occupy upper canvas/mobile before notes. Independent recheck passed.
- Cosmetic SVG dash entrance displayed only a segment. Removed failing dash entrance and confirmed full path. Dots retain positive opacity and reduced motion disables animations.
