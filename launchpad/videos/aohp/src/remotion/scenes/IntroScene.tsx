import React, { useMemo } from "react";
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
import { SceneShell, WordReveal, Particles } from "../components/ui";

export const INTRO_SCENE_DURATION = 210;

const LINE1 = ["AI", "agents", "now", "operate", "your", "phone."];
const LINE2 = ["But", "the", "OS", "still", "assumes", "you're", "human."];

const LINE1_START = 10;
const LINE1_OUT = 74;
const LINE2_START = 88;
const LINE2_OUT = 128;
const LOGO_START = 138;

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*<>/";
const seeded = (s: number) => {
  const x = Math.sin(s * 9999) * 10000;
  return x - Math.floor(x);
};
const LOGO = "AOHP";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const line1Exit = interpolate(frame, [LINE1_OUT, LINE1_OUT + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const line1Y = interpolate(frame, [LINE1_OUT, LINE1_OUT + 10], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line2Exit = interpolate(frame, [LINE2_OUT, LINE2_OUT + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const line2Y = interpolate(frame, [LINE2_OUT, LINE2_OUT + 10], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoText = useMemo(() => {
    if (frame < LOGO_START) return "";
    const since = frame - LOGO_START;
    return LOGO.split("")
      .map((ch, i) => {
        const start = i * 2.5;
        const local = since - start;
        if (local >= 9) return ch;
        if (local < 0) return SCRAMBLE[Math.floor(seeded(i * 50 + frame) * SCRAMBLE.length)];
        return SCRAMBLE[Math.floor(seeded(i * 50 + frame) * SCRAMBLE.length)];
      })
      .join("");
  }, [frame]);

  const logoIn = interpolate(frame, [LOGO_START, LOGO_START + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const logoY = interpolate(logoIn, [0, 1], [30, 0]);
  const glow = interpolate(frame, [LOGO_START + 8, LOGO_START + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineStart = LOGO_START + 28;
  const taglineIn = interpolate(frame, [taglineStart, taglineStart + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const underline = interpolate(frame, [taglineStart, taglineStart + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <SceneShell durationInFrames={INTRO_SCENE_DURATION} background={AOHP.bg} glow>
      <Particles count={20} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {/* Line 1 */}
        {frame >= LINE1_START && frame < LINE1_OUT + 12 && (
          <div style={{ position: "absolute", opacity: line1Exit, transform: `translateY(${line1Y}px)` }}>
            <WordReveal words={LINE1} startFrame={LINE1_START} fontSize={46} />
          </div>
        )}

        {/* Line 2 */}
        {frame >= LINE2_START && frame < LINE2_OUT + 12 && (
          <div style={{ position: "absolute", opacity: line2Exit, transform: `translateY(${line2Y}px)` }}>
            <WordReveal
              words={LINE2}
              startFrame={LINE2_START}
              fontSize={46}
              accentIndex={[6]}
              accentColor={AOHP.green}
            />
          </div>
        )}

        {/* Logo */}
        {frame >= LOGO_START && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: logoIn,
              transform: `translateY(${logoY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: FONTS.heading,
                fontSize: 124,
                fontWeight: 800,
                letterSpacing: 6,
                color: AOHP.green,
                textShadow: `0 0 ${40 * glow}px ${AOHP.green}aa`,
              }}
            >
              {logoText}
            </span>
            <div
              style={{
                height: 3,
                width: 260 * underline,
                background: `linear-gradient(90deg, transparent, ${AOHP.green}, transparent)`,
                marginTop: 6,
                borderRadius: 2,
              }}
            />
            <div
              style={{
                marginTop: 22,
                textAlign: "center",
                opacity: taglineIn,
                transform: `translateY(${interpolate(taglineIn, [0, 1], [14, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 15,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  color: AOHP.muted,
                }}
              >
                Android Open Harness Project
              </div>
              <div
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 24,
                  fontWeight: 600,
                  color: AOHP.white,
                  marginTop: 10,
                }}
              >
                An agent-native open fork of Android.
              </div>
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* sounds */}
      {LINE1.map((_, i) => (
        <Sequence key={`s1-${i}`} from={LINE1_START + i * 6}>
          <Audio src={staticFile("whoosh.wav")} volume={0.22} />
        </Sequence>
      ))}
      {LINE2.map((_, i) => (
        <Sequence key={`s2-${i}`} from={LINE2_START + i * 6}>
          <Audio src={staticFile("whoosh.wav")} volume={0.22} />
        </Sequence>
      ))}
      <Sequence from={LOGO_START}>
        <Audio src={staticFile("unscramble.wav")} volume={0.5} playbackRate={2.2} />
      </Sequence>
    </SceneShell>
  );
};
