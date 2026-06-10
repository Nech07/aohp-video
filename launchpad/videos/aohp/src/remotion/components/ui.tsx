import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { AOHP, FONTS } from "../lib/theme";

/** Subtle dotted grid + radial green glow used across scenes. */
export const GridBackground: React.FC<{
  opacity?: number;
  glow?: boolean;
}> = ({ opacity = 0.5, glow = true }) => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity,
          backgroundImage: `linear-gradient(${AOHP.border} 1px, transparent 1px), linear-gradient(90deg, ${AOHP.border} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 85%)",
        }}
      />
      {glow && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 55% 45% at 50% 42%, ${AOHP.green}22 0%, transparent 70%)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

/** Floating particles drifting upward (seeded, deterministic). */
const seeded = (s: number) => {
  const x = Math.sin(s * 9999) * 10000;
  return x - Math.floor(x);
};

export const Particles: React.FC<{ count?: number; color?: string }> = ({
  count = 26,
  color = AOHP.green,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const baseX = seeded(i + 1) * width;
        const baseY = seeded(i + 7.3) * height;
        const speed = 0.25 + seeded(i + 3.1) * 0.7;
        const size = 1.5 + seeded(i + 5.5) * 2.5;
        const y = (baseY - frame * speed) % height;
        const wy = y < 0 ? y + height : y;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 20) / 25));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: baseX,
              top: wy,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: 0.12 + tw * 0.3,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Wraps scene content with a fade + scale entry and fade-out exit. */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  background?: string;
  grid?: boolean;
  glow?: boolean;
  inFrames?: number;
  outFrames?: number;
}> = ({
  children,
  durationInFrames,
  background = AOHP.bg,
  grid = false,
  glow = false,
  inFrames = 16,
  outFrames = 14,
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, inFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const exit = interpolate(
    frame,
    [durationInFrames - outFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
  );
  const opacity = enter * exit;
  const scale = interpolate(enter, [0, 1], [0.965, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: background, fontFamily: FONTS.body }}>
      {(grid || glow) && <GridBackground glow={glow} opacity={grid ? 0.5 : 0} />}
      <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Small section eyebrow label. */
export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      fontFamily: FONTS.mono,
      fontSize: 13,
      letterSpacing: 3,
      textTransform: "uppercase",
      color: AOHP.green,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Android-style phone frame with status bar. */
export const PhoneFrame: React.FC<{
  width?: number;
  height?: number;
  title?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ width = 300, height = 600, title = "AOHP", children, style }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 34,
        backgroundColor: AOHP.surface,
        border: `2px solid ${AOHP.border}`,
        padding: 10,
        boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(61,220,132,0.08)`,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 26,
          backgroundColor: AOHP.bgDeep,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* status bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 18px 6px",
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: AOHP.muted,
          }}
        >
          <span style={{ color: AOHP.green, fontWeight: 600 }}>{title}</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span>9:41</span>
            <div
              style={{
                width: 16,
                height: 8,
                borderRadius: 2,
                border: `1px solid ${AOHP.dim}`,
              }}
            >
              <div
                style={{
                  width: "70%",
                  height: "100%",
                  backgroundColor: AOHP.green,
                  borderRadius: 1,
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>{children}</div>
      </div>
      {/* notch */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 90,
          height: 18,
          backgroundColor: AOHP.bgDeep,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      />
    </div>
  );
};

/** Generic word-by-word reveal row. */
export const WordReveal: React.FC<{
  words: string[];
  startFrame?: number;
  gap?: number;
  fontSize?: number;
  color?: string;
  accentIndex?: number[];
  accentColor?: string;
  fontWeight?: number;
  perWord?: number;
}> = ({
  words,
  startFrame = 0,
  gap = 14,
  fontSize = 44,
  color = AOHP.white,
  accentIndex = [],
  accentColor = AOHP.green,
  fontWeight = 700,
  perWord = 6,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap,
        fontFamily: FONTS.heading,
      }}
    >
      {words.map((w, i) => {
        const appear = startFrame + i * perWord;
        const since = frame - appear;
        const slide = interpolate(since, [0, 8], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const ty = interpolate(slide, [0, 1], [26, 0]);
        const op = interpolate(since, [0, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={i}
            style={{
              fontSize,
              fontWeight,
              color: accentIndex.includes(i) ? accentColor : color,
              transform: `translateY(${ty}px)`,
              opacity: op,
              whiteSpace: "nowrap",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
