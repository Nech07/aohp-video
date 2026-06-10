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
import { SceneShell, Particles } from "../components/ui";

export const CTA_SCENE_DURATION = 160;

const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const GITHUB_PATH =
  "M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.438 9.61 8.205 11.16.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.42-1.305.762-1.605-2.665-.305-5.467-1.334-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.323 3.301 1.23A11.5 11.5 0 0 1 12 5.8c1.02.005 2.047.138 3.006.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.479 5.92.43.372.823 1.103.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .32.216.694.825.576C20.565 21.896 24 17.49 24 12.29 24 5.78 18.627.5 12 .5z";

const CHIPS = ["Apache-2.0", "Built on AOSP", "AIR · Tsinghua University"];

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();

  const labelPulse = 0.85 + 0.15 * Math.sin(frame / 10);
  const ghSpin = interpolate(frame, [20, 44], [-180, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const ghScale = interpolate(frame, [20, 44], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });

  return (
    <SceneShell durationInFrames={CTA_SCENE_DURATION} background={AOHP.bgDeep} grid glow outFrames={20}>
      <Particles count={30} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* open source label */}
        <div
          style={{
            opacity: fade(frame, 6, 18) * labelPulse,
            fontFamily: FONTS.mono,
            fontSize: 14,
            letterSpacing: 4,
            color: AOHP.green,
            padding: "6px 14px",
            border: `1px solid ${AOHP.green}55`,
            borderRadius: 999,
            marginBottom: 26,
          }}
        >
          100% OPEN SOURCE
        </div>

        {/* logo + github */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: fade(frame, 14, 28) }}>
          <span
            style={{
              fontFamily: FONTS.heading,
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: 4,
              color: AOHP.green,
              textShadow: `0 0 36px ${AOHP.green}66`,
            }}
          >
            AOHP
          </span>
          <svg
            width={70}
            height={70}
            viewBox="0 0 24 24"
            style={{ transform: `rotate(${ghSpin}deg) scale(${ghScale})` }}
          >
            <path d={GITHUB_PATH} fill={AOHP.white} />
          </svg>
        </div>

        {/* headline */}
        <div
          style={{
            fontFamily: FONTS.heading,
            fontSize: 30,
            fontWeight: 700,
            color: AOHP.white,
            marginTop: 22,
            opacity: fade(frame, 40, 52),
          }}
        >
          Fork it on GitHub
        </div>

        {/* url card */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 22px",
            borderRadius: 12,
            backgroundColor: AOHP.surface,
            border: `1px solid ${AOHP.border}`,
            fontFamily: FONTS.mono,
            fontSize: 20,
            color: AOHP.greenLight,
            opacity: fade(frame, 54, 66),
            transform: `translateY(${interpolate(fade(frame, 54, 66), [0, 1], [14, 0])}px)`,
          }}
        >
          github.com/aohp-os/aohp
        </div>

        {/* chips */}
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          {CHIPS.map((c, i) => {
            const appear = 70 + i * 7;
            const op = fade(frame, appear, appear + 10);
            return (
              <div
                key={c}
                style={{
                  padding: "6px 14px",
                  borderRadius: 999,
                  backgroundColor: AOHP.surfaceAlt,
                  border: `1px solid ${AOHP.border}`,
                  fontFamily: FONTS.body,
                  fontSize: 13,
                  color: AOHP.muted,
                  opacity: op,
                  transform: `translateY(${interpolate(op, [0, 1], [12, 0])}px)`,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>

        {/* final tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            maxWidth: 820,
            textAlign: "center",
            fontFamily: FONTS.body,
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.5,
            color: AOHP.dim,
            opacity: fade(frame, 96, 112),
          }}
        >
          The OS becomes the environment where agents perceive, plan, act, and enforce user intent.
        </div>
      </AbsoluteFill>

      <Sequence from={20}>
        <Audio src={staticFile("whoosh.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={44}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>
      {CHIPS.map((_, i) => (
        <Sequence key={i} from={70 + i * 7}>
          <Audio src={staticFile("pop.wav")} volume={0.3} />
        </Sequence>
      ))}
    </SceneShell>
  );
};
