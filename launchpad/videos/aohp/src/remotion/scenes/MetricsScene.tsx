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

export const METRICS_SCENE_DURATION = 180;

const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const HERO_START = 34;
const HERO_DUR = 52;
const HERO_END = HERO_START + HERO_DUR;

const SECONDARY = [
  { label: "Tool calls", value: 65.6 },
  { label: "Duration", value: 72.2 },
  { label: "Tokens", value: 73.9 },
];
const SEC_START = 100;
const SEC_DUR = 30;

export const MetricsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const heroProgress = interpolate(frame, [HERO_START, HERO_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const heroValue = 43.3 + heroProgress * (90.0 - 43.3);

  const landed = frame >= HERO_END;
  const bounce = landed
    ? interpolate(frame, [HERO_END, HERO_END + 18], [0, 1], { extrapolateRight: "clamp" })
    : 0;
  const heroScale = landed ? 1 + 0.12 * Math.sin(bounce * Math.PI) * (1 - bounce) : 1;
  const heroGlow = landed ? interpolate(bounce, [0, 0.3, 1], [0, 1, 0.5]) : 0;

  return (
    <SceneShell durationInFrames={METRICS_SCENE_DURATION} background={AOHP.bg} glow>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ marginTop: 56, textAlign: "center", opacity: fade(frame, 6, 20) }}>
          <Eyebrow>Evaluated against stock Android</Eyebrow>
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 15,
              color: AOHP.dim,
              marginTop: 10,
              opacity: fade(frame, 16, 28),
            }}
          >
            OpenClaw agents · 10 representative mobile tasks
          </div>
        </div>

        {/* hero counter */}
        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `scale(${heroScale})`,
            filter: heroGlow > 0 ? `drop-shadow(0 0 ${26 * heroGlow}px ${AOHP.green})` : "none",
            opacity: fade(frame, HERO_START - 6, HERO_START + 6),
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 118,
                fontWeight: 800,
                color: AOHP.green,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {heroValue.toFixed(1)}
            </span>
            <span style={{ fontFamily: FONTS.heading, fontSize: 56, fontWeight: 700, color: AOHP.green, marginLeft: 4 }}>
              %
            </span>
          </div>
          <span style={{ fontFamily: FONTS.body, fontSize: 18, fontWeight: 600, color: AOHP.white, marginTop: 6 }}>
            Task completion rate
          </span>
          <span style={{ fontFamily: FONTS.body, fontSize: 14, color: AOHP.dim, marginTop: 4 }}>
            vs 43.3% on stock Android
          </span>
        </div>

        {/* secondary metrics */}
        <div style={{ display: "flex", gap: 28, marginTop: 44 }}>
          {SECONDARY.map((m, i) => {
            const appear = SEC_START + i * 8;
            const op = fade(frame, appear, appear + 10);
            const prog = interpolate(frame, [appear, appear + SEC_DUR], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const val = prog * m.value;
            return (
              <div
                key={m.label}
                style={{
                  width: 200,
                  padding: "18px 20px",
                  borderRadius: 14,
                  backgroundColor: AOHP.surface,
                  border: `1px solid ${AOHP.border}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: op,
                  transform: `translateY(${interpolate(op, [0, 1], [24, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span style={{ fontFamily: FONTS.heading, fontSize: 18, fontWeight: 700, color: AOHP.green }}>↓</span>
                  <span
                    style={{
                      fontFamily: FONTS.heading,
                      fontSize: 44,
                      fontWeight: 800,
                      color: AOHP.greenLight,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {val.toFixed(1)}
                  </span>
                  <span style={{ fontFamily: FONTS.heading, fontSize: 24, fontWeight: 700, color: AOHP.greenLight }}>
                    %
                  </span>
                </div>
                <span style={{ fontFamily: FONTS.body, fontSize: 15, color: AOHP.muted, marginTop: 6 }}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Sequence from={HERO_START}>
        <Audio src={staticFile("whoosh.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={HERO_END}>
        <Audio src={staticFile("pop.wav")} volume={0.6} playbackRate={1.4} />
      </Sequence>
      {SECONDARY.map((_, i) => (
        <Sequence key={i} from={SEC_START + i * 8}>
          <Audio src={staticFile("pop.wav")} volume={0.35} />
        </Sequence>
      ))}
    </SceneShell>
  );
};
