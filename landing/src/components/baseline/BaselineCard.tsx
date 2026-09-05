import { useEffect, useRef, useState } from "react";
import { CARD_BUTTON, CARD_REF, isOnShareButton, type CardModel, type CardSlot } from "../../lib/baseline-card";
import { BASELINE_CARD_UI } from "../../lib/baseline-copy";

/**
 * The share card (KK 12_ONDA_Watch).
 *
 * A bar on a page does not travel into a chat; a picture does. So the same figures the page already
 * shows are drawn onto a canvas and handed to the OS share sheet as a PNG.
 *
 * RENDERED ENTIRELY ON THE DEVICE, and that is not a performance choice. The whole bridge exists so
 * the figures never reach a server: they ride in the URL fragment, which browsers do not send. A
 * server-side image renderer would have to be told the numbers, and would rebuild exactly the
 * database this design refuses to create. There is no endpoint here, no upload, no preview call.
 *
 * Drawn in the reference frame the design was composed in (941x1672) and scaled to the output size,
 * so every coordinate matches the approved reference render rather than being re-derived.
 *
 * FIREWALL (app_baseline_spec 7): no colour means good or bad. The green is one accent used for
 * every figure; the hero is red because it is the hero, not because it is a warning.
 */

/** The composition's own pixel space. Every coordinate below is in these units. */
const REF_W = CARD_REF.w;
const REF_H = CARD_REF.h;
/** What the exported PNG is. Same aspect, twice the detail. */
const OUT_W = 1080;
const OUT_H = 1920;

const COLOR = {
  accent: "#4ade80",
  hero: "#e8534f",
  text: "#f0f5fc",
  caption: "#92a1ba",
  dim: "#707e96",
  rail: "#324a62",
  dark: "#0a1018",
  buttonInk: "#080c16",
};

/** Vertical anchors for the four column slots, bottom-first: a missing figure lets the rest sit low. */
const SLOT_Y = [750, 560, 370, 190];



export function BaselineCard({ model, onShare }: { model: CardModel; onShare: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // The figure and the font first: drawing before the face has loaded renders the card in a
      // fallback and never repaints it.
      //
      // Waited for with load/error events and a deadline, NOT with decode(). A backgrounded tab does
      // not decode images - and a person who taps the shortcut and switches apps while it runs comes
      // back to exactly that tab. decode() there never settles, and the card would hang forever
      // behind an invisible canvas. The deadline is the same argument once more: a card without its
      // figure beats a card that never appears.
      const bg = new Image();
      const loaded = new Promise<void>((resolve) => {
        bg.onload = () => resolve();
        bg.onerror = () => resolve();
      });
      bg.src = "/tools/baseline/card-bg.jpg";
      const deadline = new Promise<void>((resolve) => setTimeout(resolve, 4000));
      await Promise.race([
        Promise.all([loaded, (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve()]),
        deadline,
      ]);
      if (cancelled) return;

      bgRef.current = bg;
      drawCard(ctx, bg, model, true);
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [model]);

  /**
   * A tap on the drawn button. Mapped back into reference units from the same rectangle the drawing
   * uses, so the pressable area is exactly what the eye sees however wide the card is rendered.
   */
  function onCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas || !ready || busy) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (isOnShareButton((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)) void share();
  }

  async function share() {
    const canvas = canvasRef.current;
    if (!canvas || busy) return;
    setBusy(true);
    onShare();
    try {
      // The picture that travels is redrawn WITHOUT the Share button. On the page that button is the
      // control; in someone's chat it is a green lozenge that does nothing, sitting over the closing
      // line. The person receiving it shares by opening the link, not by tapping a picture.
      const flat = document.createElement("canvas");
      flat.width = OUT_W;
      flat.height = OUT_H;
      const flatCtx = flat.getContext("2d");
      if (flatCtx && bgRef.current) drawCard(flatCtx, bgRef.current, model, false);
      const source = flatCtx && bgRef.current ? flat : canvas;
      const blob = await new Promise<Blob | null>((res) => source.toBlob(res, "image/png"));
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "my-baseline.png", { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };

      // The card carries no address by design, so the link MUST travel beside it - otherwise the
      // person receiving the picture has no way back. Some apps drop the text; that is the accepted
      // risk, but the text is always in the call.
      if (nav.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: BASELINE_CARD_UI.shareText });
      } else if (navigator.share) {
        await navigator.share({ text: BASELINE_CARD_UI.shareText, url: window.location.href });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-baseline.png";
        a.click();
        URL.revokeObjectURL(url);
        setFallbackNote(BASELINE_CARD_UI.savedNote);
      }
    } catch {
      // A cancelled share sheet throws too. Nothing to report: the person simply changed their mind.
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ margin: "0 0 30px" }}>
      <h2 style={{ fontSize: "clamp(19px, 5vw, 24px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 14px" }}>
        {BASELINE_CARD_UI.pageHeading}
      </h2>
      {/* The button drawn on the card IS the button. A second one underneath said the same thing
          twice, and the drawn one has to exist regardless - it travels with the picture. */}
      <canvas
        ref={canvasRef}
        width={OUT_W}
        height={OUT_H}
        aria-label={BASELINE_CARD_UI.canvasAlt}
        onClick={onCanvasClick}
        style={{
          width: "100%", height: "auto", display: "block", borderRadius: 14,
          background: COLOR.dark, opacity: ready ? 1 : 0, transition: "opacity .2s ease",
          cursor: ready && !busy ? "pointer" : "default",
        }}
      />
      {/* A canvas cannot be reached by keyboard or announced by a screen reader, so the real control
          still exists - it is simply invisible. Removing the visible duplicate must not remove the
          only way in for someone not using a pointer. */}
      <button type="button" onClick={share} disabled={!ready || busy} style={SR_ONLY}>
        {BASELINE_CARD_UI.shareButton}
      </button>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, color: COLOR.dim, margin: 0 }}>
          {fallbackNote ?? BASELINE_CARD_UI.shareHint}
        </p>
      </div>
    </section>
  );
}

const SR_ONLY: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

// ---------------------------------------------------------------------------
// Drawing. Everything below works in the 941x1672 reference frame.
// ---------------------------------------------------------------------------

/** The family the page actually loaded, read back so the canvas uses the same face as the page. */
function monoFamily(): string {
  if (typeof window === "undefined") return "monospace";
  const probe = document.createElement("span");
  probe.style.fontFamily = '"JetBrains Mono", var(--font-mono), monospace';
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || "monospace";
  probe.remove();
  return family;
}

function drawCard(ctx: CanvasRenderingContext2D, bg: HTMLImageElement, m: CardModel, withButton: boolean) {
  const family = monoFamily();
  ctx.save();
  ctx.scale(OUT_W / REF_W, OUT_H / REF_H);
  ctx.clearRect(0, 0, REF_W, REF_H);
  ctx.fillStyle = COLOR.dark;
  ctx.fillRect(0, 0, REF_W, REF_H);
  if (bg.complete && bg.naturalWidth) ctx.drawImage(bg, 0, 0, REF_W, REF_H);

  // ONE even veil over the whole artwork before any text is placed. The local clouds alone were
  // enough on a full-size screen and not enough in a chat, where the card arrives a few hundred
  // pixels wide and the figure's own glow competes with every glyph. Dimming the picture evenly
  // costs the artwork some brilliance and buys every number its legibility back.
  ctx.fillStyle = "rgba(10,16,24,0.42)";
  ctx.fillRect(0, 0, REF_W, REF_H);

  // Bands top and bottom: the figure is bright at the crown and at the feet, and text sitting
  // straight on it loses its edges.
  // Softer than the reference render's, on purpose: that one was composed over a darker source, and
  // the same strengths over this artwork buried the figure instead of seating the text on it.
  // Measured rather than eyeballed - the cloud keeps ~0.6 of its surroundings, the reference ~0.5.
  band(ctx, 0, 150, 0.52, true);
  band(ctx, REF_H - 700, REF_H, 0.74, false);

  const font = (weight: number, size: number) => `${weight} ${size}px ${family}`;

  // Hero, optically centred: the figure's axis by brightness is 473, and a 7 reads as shifted left,
  // so the number sits five pixels right of it (design note, measured not guessed).
  if (m.hero) {
    ctx.font = font(800, 104);
    const w = ctx.measureText(m.hero.value).width;
    const x = 473 - w / 2 + 5;
    // The hero sits on the brightest part of the whole figure (the chest), so its shadow is the
    // largest and is laid twice - a wide soft pool, then a tighter denser one right under the digits.
    cloud(ctx, 473, 404, 150, 78);
    cloud(ctx, 473, 400, 96, 52);
    glow(ctx, m.hero.value, x, 352, font(800, 104), "rgba(232,83,79,0.45)");
    text(ctx, m.hero.value, x, 352, font(800, 104), COLOR.hero);
    cloud(ctx, 473, 472, 118, 20);
    cloud(ctx, 473, 496, 128, 20);
    centred(ctx, m.hero.label, 464, font(500, 20), COLOR.caption);
    centred(ctx, m.hero.sub, 489, font(400, 18), COLOR.dim);
  }

  m.left.forEach((slot, i) => i < SLOT_Y.length && stack(ctx, slot, 56, SLOT_Y[i], "left", family));
  m.right.forEach((slot, i) => i < SLOT_Y.length && stack(ctx, slot, REF_W - 56, SLOT_Y[i], "right", family));

  // The variability bar, and after it the breathing lines. When HRV never arrived the whole block is
  // gone and breathing moves up into its place, rather than leaving a gap where a bar should be.
  let y = 1010;
  if (m.variability) {
    const v = m.variability;
    // The centre block sits over the brightest pelvic wireframe, so both its lines get a wider, taller
    // pool than a column caption would - it was the last text still fighting the figure.
    cloud(ctx, 470, y + 8, 168, 26);
    cloud(ctx, 470, y + 40, 210, 30);
    centred(ctx, "VARIABILITY", y, font(500, 20), COLOR.caption);
    centred(ctx, v.caption, y + 30, font(400, 19), COLOR.accent);

    const bar = y + 96;
    const x0 = 170;
    const x1 = REF_W - 170;
    ctx.strokeStyle = COLOR.rail;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, bar);
    ctx.lineTo(x1, bar);
    ctx.stroke();

    const mid = x0 + (x1 - x0) * Math.min(Math.max(v.position, 0), 1);
    ctx.fillStyle = COLOR.accent;
    ctx.beginPath();
    ctx.arc(mid, bar, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = font(700, 44);
    text(ctx, v.min, x0 - 20 - ctx.measureText(v.min).width, bar - 26, font(700, 44), COLOR.text);
    text(ctx, v.max, x1 + 18, bar - 26, font(700, 44), COLOR.text);
    centred(ctx, v.lineOne, bar + 58, font(400, 23), COLOR.text);
    centred(ctx, v.lineTwo, bar + 94, font(400, 23), COLOR.text);
    y = bar + 94;
  } else {
    y = 1010;
  }

  if (m.breathing) {
    const by = m.variability ? y + 100 : y + 40;
    centred(ctx, m.breathing.lineOne, by, font(400, 23), COLOR.text);
    centred(ctx, m.breathing.lineTwo, by + 40, font(400, 23), COLOR.accent);
    centred(ctx, m.breathing.lineThree, by + 76, font(400, 23), COLOR.accent);
  }

  // The button is part of the picture: the card travels without an address, and a visible Share
  // control is what tells the person receiving it that this came from something they can also run.
  if (withButton) {
    ctx.fillStyle = COLOR.accent;
    roundRect(ctx, CARD_BUTTON.x, CARD_BUTTON.y, CARD_BUTTON.w, CARD_BUTTON.h, CARD_BUTTON.r);
    ctx.fill();
    const label = font(700, 32);
    ctx.font = label;
    const tw = ctx.measureText(BASELINE_CARD_UI.cardButton).width;
    text(ctx, BASELINE_CARD_UI.cardButton, CARD_BUTTON.x + (CARD_BUTTON.w - tw) / 2, CARD_BUTTON.y + 22, label, COLOR.buttonInk);
  }
  // The closing line sits where the button was when there is no button, so the shared picture ends
  // on a sentence rather than on a hole.
  const footerY = withButton ? CARD_BUTTON.y + CARD_BUTTON.h + 34 : CARD_BUTTON.y + 30;
  centred(ctx, BASELINE_CARD_UI.cardFooter, footerY, font(400, 21), COLOR.caption);

  ctx.restore();
}

/** One column entry: figure, then its caption 70px below, aligned to the column's outer edge. */
function stack(ctx: CanvasRenderingContext2D, slot: CardSlot, x: number, y: number, side: "left" | "right", family: string) {
  const numFont = `700 54px ${family}`;
  const capFont = `400 18px ${family}`;
  ctx.font = numFont;
  const nw = ctx.measureText(slot.value).width;
  ctx.font = capFont;
  const cw = ctx.measureText(slot.caption).width;

  // A cloud per LINE, not per block: one shadow covering both drifts, because the number and the
  // caption do not share a centre of gravity (design note, learned across twenty-one iterations).
  const nx = side === "left" ? x : x - nw;
  const cx = side === "left" ? x : x - cw;
  cloud(ctx, nx + nw / 2, y + 34, Math.max(nw / 2 + 34, 58), 46);
  cloud(ctx, cx + cw / 2, y + 78, cw / 2 + 32, 26);

  text(ctx, slot.value, nx, y, numFont, COLOR.accent);
  text(ctx, slot.caption, cx, y + 70, capFont, COLOR.caption);
}

function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, fill: string) {
  ctx.font = font;
  ctx.textBaseline = "top";
  ctx.fillStyle = fill;
  ctx.fillText(s, x, y);
}

function centred(ctx: CanvasRenderingContext2D, s: string, y: number, font: string, fill: string) {
  ctx.font = font;
  const w = ctx.measureText(s).width;
  text(ctx, s, (REF_W - w) / 2, y, font, fill);
}

/** The hero's own halo, drawn under it so the red does not sit flat on the blue figure. */
function glow(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, font: string, colour: string) {
  ctx.save();
  ctx.shadowColor = colour;
  ctx.shadowBlur = 46;
  text(ctx, s, x, y, font, colour);
  text(ctx, s, x, y, font, colour);
  ctx.restore();
}

/**
 * A soft elliptical shadow under one line of text.
 *
 * Deliberately NOT a rectangle: flat plates read as patches stuck over the artwork, which is why the
 * design moved to clouds after the early iterations.
 */
function cloud(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number) {
  ctx.save();
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
  // Softened from the reference render's strengths: that one was composed over a darker source, and
  // the same values over this artwork buried the figure. Column captions still keep 11x to 32x their
  // background, measured on the canvas rather than judged by eye.
  // Raised over the torso: the figure is at its brightest across the chest, and the hero, the
  // variability block and the mid columns all sit there, so the core is darker and holds its density
  // further out before fading. Still an ellipse that fades to nothing at the rim, so it reads as a
  // shadow under the text, not a plate stuck over the artwork.
  g.addColorStop(0, "rgba(10,16,24,0.9)");
  g.addColorStop(0.55, "rgba(10,16,24,0.66)");
  g.addColorStop(1, "rgba(10,16,24,0)");
  ctx.fillStyle = g;
  ctx.translate(cx, cy);
  ctx.scale(1, ry / Math.max(rx, ry));
  ctx.beginPath();
  ctx.arc(0, 0, Math.max(rx, ry), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A vertical fade at the top or bottom edge, where the artwork is brightest. */
function band(ctx: CanvasRenderingContext2D, from: number, to: number, strength: number, downwards: boolean) {
  const g = ctx.createLinearGradient(0, from, 0, to);
  g.addColorStop(0, downwards ? `rgba(10,16,24,${strength})` : "rgba(10,16,24,0)");
  g.addColorStop(1, downwards ? "rgba(10,16,24,0)" : `rgba(10,16,24,${strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, from, REF_W, to - from);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
