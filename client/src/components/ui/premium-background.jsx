import React from "react";

/**
 * PremiumBackground v2
 * ─────────────────────────────────────────────────────────────
 * Layered pure-CSS dark SaaS background.
 * Inspired by Upsell.ai / Linear / Vercel aesthetics.
 *
 * Layer order (bottom → top):
 *  1. Base deep navy gradient  (top slightly lighter, bottom pitch)
 *  2. 40px grid overlay        (white at 3–4% — barely visible)
 *  3. Central blue radial glow (soft, feathered, not a spotlight)
 *  4. Top-right indigo accent  (depth, asymmetry)
 *  5. Bottom vignette fade     (grounds the page)
 *  6. SVG fractal noise grain  (premium texture at <2% opacity)
 *
 * Usage:
 *   Place as first child inside a `relative` wrapper.
 *   The component uses `fixed` so it always covers the viewport.
 */
const PremiumBackground = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -10,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* ── 1. Base gradient: navy top → near-black bottom ────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #0a1628 0%, #020617 45%, #010410 100%)",
        }}
      />

      {/* ── 2. Grid overlay (horizontal + vertical, 40px) ────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
          /* Soft mask so grid fades at edges and doesn't feel sharp */
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* ── 3. Primary glow: centre-top, wide blue ellipse ────── */}
      {/* Very large and soft so it never looks like a spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              ellipse 100% 60% at 50% -5%,
              rgba(59,130,246,0.13) 0%,
              rgba(59,130,246,0.05) 40%,
              transparent 70%
            )
          `,
        }}
      />

      {/* ── 4. Secondary glow: upper-right indigo accent ─────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              ellipse 55% 40% at 85% 8%,
              rgba(99,102,241,0.09) 0%,
              transparent 65%
            )
          `,
        }}
      />

      {/* ── 5. Tertiary glow: lower-left cool accent ─────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(
              ellipse 50% 35% at -5% 90%,
              rgba(37,99,235,0.07) 0%,
              transparent 60%
            )
          `,
        }}
      />

      {/* ── 6. Bottom vignette: grounds page, hides hard cut ─── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "220px",
          background:
            "linear-gradient(to bottom, transparent, rgba(1,4,16,0.85))",
        }}
      />

      {/* ── 7. Noise grain (SVG feTurbulence — GPU composited) ── */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.016,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="pb-noise" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
            result="noiseOut"
          />
          <feColorMatrix
            in="noiseOut"
            type="saturate"
            values="0"
            result="grayNoise"
          />
          <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pb-noise)" />
      </svg>
    </div>
  );
};

export default PremiumBackground;
