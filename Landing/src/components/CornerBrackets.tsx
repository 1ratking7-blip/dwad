/**
 * Four glowing L-shaped corner accents — the "targeting reticle" motif
 * common to AAA-game HUDs. Rendered as siblings of a chamfered panel, not
 * children of it: the panel's clip-path would otherwise cut these off
 * along with everything else in its box. Purely decorative: aria-hidden.
 */
export default function CornerBrackets() {
  return (
    <div aria-hidden="true">
      <span className="hud-corner hud-corner-tl" />
      <span className="hud-corner hud-corner-tr" />
      <span className="hud-corner hud-corner-bl" />
      <span className="hud-corner hud-corner-br" />
    </div>
  );
}
