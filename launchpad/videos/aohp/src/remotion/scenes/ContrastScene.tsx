import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
  Sequence,
  Audio,
  staticFile,
} from "remotion";
import { AOHP, FONTS } from "../lib/theme";
import { SceneShell, Eyebrow } from "../components/ui";

export const CONTRAST_SCENE_DURATION = 240;

const APPS = ["Amazon", "Temu", "eBay", "Browser", "Notes", "Settings"];

// Left grid geometry (relative to a 540x560 panel)
const TILE = 96;
const GAP = 26;
const COLS = 3;
const GRID_W = COLS * TILE + (COLS - 1) * GAP;
const GRID_X = (540 - GRID_W) / 2;
const GRID_Y = 170;
const tileCenter = (i: number) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    x: GRID_X + c * (TILE + GAP) + TILE / 2,
    y: GRID_Y + r * (TILE + GAP) + TILE / 2,
  };
};

const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

// Right panel radial nodes
const RIGHT_NODES = [
  { label: "API", angle: -90 },
  { label: "CLI", angle: -30 },
  { label: "GUI", angle: 30 },
  { label: "UI", angle: 90 },
  { label: "MCP", angle: 150 },
  { label: "App", angle: 210 },
];
const CX = 270;
const CY = 300;
const R = 175;

export const ContrastScene: React.FC = () => {
  const frame = useCurrentFrame();

  const dividerH = interpolate(frame, [12, 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Manual cursor hops across the left tiles (sequential)
  const HOP_START = 78;
  const HOP_EACH = 22;
  const hopT = Math.max(0, frame - HOP_START);
  const hopIdx = Math.floor(hopT / HOP_EACH) % APPS.length;
  const nextIdx = (hopIdx + 1) % APPS.length;
  const within = (hopT % HOP_EACH) / HOP_EACH;
  const ease = Easing.inOut(Easing.cubic)(Math.min(1, within * 1.4));
  const from = tileCenter(hopIdx);
  const to = tileCenter(nextIdx);
  const curX = from.x + (to.x - from.x) * ease;
  const curY = from.y + (to.y - from.y) * ease;
  const showCursor = frame >= HOP_START;

  // Right side connectors fire in parallel
  const fireStart = 80;
  const fireT = interpolate(frame, [fireStart, fireStart + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ringPulse = 1 + 0.06 * Math.sin(frame / 9);

  return (
    <SceneShell durationInFrames={CONTRAST_SCENE_DURATION} background={AOHP.bg}>
      {/* top label */}
      <div
        style={{
          position: "absolute",
          top: 30,
          width: "100%",
          textAlign: "center",
          opacity: fade(frame, 4, 18),
        }}
      >
        <Eyebrow>Two operating models</Eyebrow>
      </div>

      {/* divider */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 76,
          height: 580 * dividerH,
          width: 1,
          background: `linear-gradient(${AOHP.border}, ${AOHP.green}66, ${AOHP.border})`,
          transform: "translateX(-0.5px)",
        }}
      />

      {/* ===== LEFT PANEL: Stock Android ===== */}
      <div style={{ position: "absolute", left: 0, top: 76, width: 540, height: 600 }}>
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            opacity: fade(frame, 18, 32),
          }}
        >
          <div style={{ fontFamily: FONTS.heading, fontSize: 26, fontWeight: 700, color: AOHP.muted }}>
            Stock Android
          </div>
        </div>

        {/* human icon */}
        <div
          style={{
            position: "absolute",
            left: 270,
            top: 116,
            transform: "translateX(-50%)",
            opacity: fade(frame, 26, 40),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: `2px solid ${AOHP.dim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: AOHP.muted,
              fontSize: 22,
            }}
          >
            ☺
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: AOHP.dim }}>human</span>
        </div>

        {/* app tiles */}
        {APPS.map((app, i) => {
          const appear = 34 + i * 6;
          const op = fade(frame, appear, appear + 8);
          const ty = interpolate(op, [0, 1], [16, 0]);
          const { x, y } = tileCenter(i);
          const active = showCursor && hopIdx === i;
          return (
            <div
              key={app}
              style={{
                position: "absolute",
                left: x - TILE / 2,
                top: y - TILE / 2,
                width: TILE,
                height: TILE,
                borderRadius: 18,
                backgroundColor: AOHP.surface,
                border: `1px solid ${active ? AOHP.green : AOHP.border}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: op,
                transform: `translateY(${ty}px)`,
                filter: active ? "none" : "grayscale(0.4)",
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: `linear-gradient(135deg, ${AOHP.dim}, ${AOHP.border})`,
                }}
              />
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: AOHP.muted }}>{app}</span>
            </div>
          );
        })}

        {/* manual cursor */}
        {showCursor && (
          <div
            style={{
              position: "absolute",
              left: curX - 14,
              top: curY - 14,
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `2px solid ${AOHP.amber}`,
              boxShadow: `0 0 14px ${AOHP.amber}aa`,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: 36,
            width: "100%",
            textAlign: "center",
            fontFamily: FONTS.body,
            fontSize: 14,
            color: AOHP.dim,
            opacity: fade(frame, 60, 74),
          }}
        >
          Isolated app silos · manual navigation
        </div>
      </div>

      {/* ===== RIGHT PANEL: AOHP ===== */}
      <div style={{ position: "absolute", left: 540, top: 76, width: 540, height: 600 }}>
        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            opacity: fade(frame, 18, 32),
          }}
        >
          <div style={{ fontFamily: FONTS.heading, fontSize: 26, fontWeight: 700, color: AOHP.green }}>
            AOHP
          </div>
        </div>

        {/* connectors SVG */}
        <svg width={540} height={600} style={{ position: "absolute", left: 0, top: 0 }}>
          {RIGHT_NODES.map((n, i) => {
            const rad = (n.angle * Math.PI) / 180;
            const ex = CX + Math.cos(rad) * R;
            const ey = CY + Math.sin(rad) * R;
            const px = CX + (ex - CX) * fireT;
            const py = CY + (ey - CY) * fireT;
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={px}
                y2={py}
                stroke={AOHP.green}
                strokeWidth={1.5}
                strokeOpacity={0.55}
              />
            );
          })}
        </svg>

        {/* service / app nodes */}
        {RIGHT_NODES.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const ex = CX + Math.cos(rad) * R;
          const ey = CY + Math.sin(rad) * R;
          const op = interpolate(fireT, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={n.label}
              style={{
                position: "absolute",
                left: ex - 30,
                top: ey - 16,
                width: 60,
                height: 32,
                borderRadius: 9,
                backgroundColor: AOHP.surfaceAlt,
                border: `1px solid ${AOHP.green}55`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: AOHP.greenLight,
                opacity: op,
                boxShadow: `0 0 12px ${AOHP.green}22`,
              }}
            >
              {n.label}
            </div>
          );
        })}

        {/* central OS Agent */}
        <div
          style={{
            position: "absolute",
            left: CX,
            top: CY,
            transform: `translate(-50%, -50%) scale(${interpolate(
              fade(frame, 30, 46),
              [0, 1],
              [0.6, 1]
            )})`,
            opacity: fade(frame, 30, 46),
          }}
        >
          {/* pulsing ring */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `1.5px solid ${AOHP.green}55`,
              transform: `translate(-50%, -50%) scale(${ringPulse})`,
            }}
          />
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, ${AOHP.greenLight}, ${AOHP.green})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: AOHP.bgDeep,
              boxShadow: `0 0 30px ${AOHP.green}88`,
            }}
          >
            <span style={{ fontFamily: FONTS.heading, fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>OS</span>
            <span style={{ fontFamily: FONTS.heading, fontSize: 15, fontWeight: 800, lineHeight: 1.1 }}>Agent</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 36,
            width: "100%",
            textAlign: "center",
            fontFamily: FONTS.body,
            fontSize: 14,
            color: AOHP.muted,
            opacity: fade(frame, 90, 104),
          }}
        >
          OS agent orchestrates services in parallel
        </div>
      </div>

      {/* sounds */}
      {APPS.map((_, i) => (
        <Sequence key={`pop-${i}`} from={34 + i * 6}>
          <Audio src={staticFile("pop.wav")} volume={0.32} />
        </Sequence>
      ))}
      <Sequence from={fireStart}>
        <Audio src={staticFile("whoosh.wav")} volume={0.4} />
      </Sequence>
    </SceneShell>
  );
};
