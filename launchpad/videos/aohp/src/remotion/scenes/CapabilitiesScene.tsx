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
import { SceneShell, WordReveal } from "../components/ui";

export const CAPABILITIES_SCENE_DURATION = 210;

const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type Card = {
  title: string;
  points: string[];
  icon: (p: { progress: number }) => React.ReactNode;
};

const draw = (progress: number, len: number) => ({
  strokeDasharray: len,
  strokeDashoffset: len * (1 - progress),
});

const CARDS: Card[] = [
  {
    title: "Personalized Interaction",
    points: ["Generated service entrances", "Cross-service OS memory"],
    icon: ({ progress }) => (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <circle cx={26} cy={18} r={9} stroke={AOHP.green} strokeWidth={2.5} style={draw(progress, 57)} />
        <path
          d="M10 44 C10 33, 42 33, 42 44"
          stroke={AOHP.green}
          strokeWidth={2.5}
          strokeLinecap="round"
          style={draw(progress, 44)}
        />
      </svg>
    ),
  },
  {
    title: "Efficient Agent Interfaces",
    points: ["Parallel background displays", "Structured agent-aware UI", "Native sandbox runtime"],
    icon: ({ progress }) => (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        {[8, 22, 36].map((y, i) => (
          <rect
            key={i}
            x={8}
            y={y}
            width={36 * Math.min(1, progress * 1.4 - i * 0.15)}
            height={8}
            rx={3}
            fill={AOHP.green}
            opacity={Math.max(0, Math.min(1, progress * 1.4 - i * 0.2))}
          />
        ))}
      </svg>
    ),
  },
  {
    title: "Secure Information Flow",
    points: ["Data-flow taint tracking", "Trusted vault & executor"],
    icon: ({ progress }) => (
      <svg width={52} height={52} viewBox="0 0 52 52" fill="none">
        <path
          d="M26 6 L44 13 V26 C44 38, 36 44, 26 47 C16 44, 8 38, 8 26 V13 Z"
          stroke={AOHP.green}
          strokeWidth={2.5}
          strokeLinejoin="round"
          style={draw(progress, 130)}
        />
        <rect x={20} y={24} width={12} height={11} rx={2} fill={AOHP.green} opacity={Math.max(0, progress * 1.5 - 0.5)} />
        <path d="M22 24 V21 a4 4 0 0 1 8 0 V24" stroke={AOHP.green} strokeWidth={2} style={draw(progress, 20)} />
      </svg>
    ),
  },
];

const CARDS_START = 40;
const CARD_STAGGER = 16;

export const CapabilitiesScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneShell durationInFrames={CAPABILITIES_SCENE_DURATION} background={AOHP.bg} glow>
      <AbsoluteFill style={{ alignItems: "center" }}>
        <div style={{ marginTop: 70 }}>
          <WordReveal
            words={["Three", "core", "capabilities."]}
            startFrame={8}
            perWord={7}
            fontSize={42}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 26,
            marginTop: 56,
            padding: "0 50px",
          }}
        >
          {CARDS.map((card, i) => {
            const appear = CARDS_START + i * CARD_STAGGER;
            const op = fade(frame, appear, appear + 12);
            const ty = interpolate(op, [0, 1], [40, 0]);
            const iconProgress = fade(frame, appear + 6, appear + 28);
            return (
              <div
                key={card.title}
                style={{
                  width: 300,
                  minHeight: 330,
                  backgroundColor: AOHP.surface,
                  border: `1px solid ${AOHP.border}`,
                  borderTop: `3px solid ${AOHP.green}`,
                  borderRadius: 16,
                  padding: "28px 26px",
                  opacity: op,
                  transform: `translateY(${ty}px)`,
                  boxShadow: `0 16px 40px rgba(0,0,0,0.4)`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: 16 }}>{card.icon({ progress: iconProgress })}</div>
                <div
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 22,
                    fontWeight: 700,
                    color: AOHP.white,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ color: AOHP.dim, fontFamily: FONTS.mono, fontSize: 14 }}>0{i + 1}</span>
                  <div style={{ marginTop: 8 }}>{card.title}</div>
                </div>
                <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                  {card.points.map((pt, j) => {
                    const pAppear = appear + 20 + j * 8;
                    const pop = fade(frame, pAppear, pAppear + 8);
                    return (
                      <div
                        key={pt}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          opacity: pop,
                          transform: `translateX(${interpolate(pop, [0, 1], [-8, 0])}px)`,
                        }}
                      >
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            backgroundColor: `${AOHP.green}22`,
                            border: `1px solid ${AOHP.green}`,
                            color: AOHP.green,
                            fontSize: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                        <span style={{ fontFamily: FONTS.body, fontSize: 14.5, color: AOHP.muted }}>{pt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {CARDS.map((_, i) => (
        <Sequence key={`c-${i}`} from={CARDS_START + i * CARD_STAGGER}>
          <Audio src={staticFile("pop.wav")} volume={0.4} />
        </Sequence>
      ))}
    </SceneShell>
  );
};
