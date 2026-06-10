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
import { SceneShell, Eyebrow, PhoneFrame } from "../components/ui";

export const TASK_SCENE_DURATION = 250;

const fade = (frame: number, a: number, b: number) =>
  interpolate(frame, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const INTENT = "Find me the best running shoes under $80.";
const TYPE_START = 16;
const TYPE_SPEED = 1.1;
const TYPE_END = TYPE_START + INTENT.length * TYPE_SPEED;

const SERVICES = [
  { name: "Amazon", done: 132, price: "$78" },
  { name: "Temu", done: 120, price: "$74" },
  { name: "eBay", done: 144, price: "$82" },
];
const DISPATCH = 70;
const POLICY_START = 150;
const RESULT_START = 172;
const CAPTION_START = 196;

export const TaskScene: React.FC = () => {
  const frame = useCurrentFrame();

  const typed = INTENT.slice(
    0,
    Math.max(0, Math.min(INTENT.length, Math.floor((frame - TYPE_START) / TYPE_SPEED)))
  );
  const typing = frame >= TYPE_START && frame < TYPE_END;

  return (
    <SceneShell durationInFrames={TASK_SCENE_DURATION} background={AOHP.bg}>
      {/* top label */}
      <div style={{ position: "absolute", top: 28, width: "100%", textAlign: "center", opacity: fade(frame, 4, 18) }}>
        <Eyebrow>One task · composed</Eyebrow>
      </div>

      {/* Phone */}
      <div style={{ position: "absolute", left: 72, top: 92, opacity: fade(frame, 8, 22) }}>
        <PhoneFrame width={272} height={520} title="AOHP">
          <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 12, height: "100%" }}>
            {/* user intent bubble */}
            <div style={{ alignSelf: "flex-end", maxWidth: "88%" }}>
              <div
                style={{
                  backgroundColor: `${AOHP.green}1f`,
                  border: `1px solid ${AOHP.green}55`,
                  borderRadius: "14px 14px 4px 14px",
                  padding: "10px 12px",
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  color: AOHP.white,
                  lineHeight: 1.4,
                }}
              >
                {typed}
                {typing && (
                  <span
                    style={{
                      display: "inline-block",
                      width: 2,
                      height: 14,
                      backgroundColor: frame % 16 < 8 ? AOHP.green : "transparent",
                      marginLeft: 1,
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>
            </div>

            {/* agent working indicator */}
            {frame >= TYPE_END + 6 && frame < RESULT_START && (
              <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: AOHP.green }}>OS agent</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: AOHP.green,
                        opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame + d * 6) / 7)),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* answer bubble */}
            {frame >= RESULT_START && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "92%",
                  opacity: fade(frame, RESULT_START, RESULT_START + 12),
                  transform: `translateY(${interpolate(fade(frame, RESULT_START, RESULT_START + 12), [0, 1], [12, 0])}px)`,
                }}
              >
                <div
                  style={{
                    backgroundColor: AOHP.surfaceAlt,
                    border: `1px solid ${AOHP.border}`,
                    borderRadius: "14px 14px 14px 4px",
                    padding: "10px 12px",
                    fontFamily: FONTS.body,
                    fontSize: 13.5,
                    color: AOHP.white,
                    lineHeight: 1.45,
                  }}
                >
                  <b style={{ color: AOHP.greenLight }}>Nimbus Run 2 — $74</b>
                  <br />
                  Best rated under $80. Buy with one tap?
                </div>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>

      {/* Orchestration column */}
      <div style={{ position: "absolute", left: 408, top: 120, width: 600 }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 13,
            color: AOHP.muted,
            opacity: fade(frame, DISPATCH - 6, DISPATCH + 6),
            marginBottom: 16,
          }}
        >
          OS agent → 3 parallel service calls
        </div>

        {/* service chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SERVICES.map((s, i) => {
            const appear = DISPATCH + i * 8;
            const op = fade(frame, appear, appear + 8);
            const done = frame >= s.done;
            const doneOp = fade(frame, s.done, s.done + 8);
            return (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: 420,
                  padding: "12px 16px",
                  borderRadius: 12,
                  backgroundColor: AOHP.surface,
                  border: `1px solid ${done ? `${AOHP.green}66` : AOHP.border}`,
                  opacity: op,
                  transform: `translateX(${interpolate(op, [0, 1], [20, 0])}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: `linear-gradient(135deg, ${AOHP.border}, ${AOHP.surfaceAlt})`,
                      border: `1px solid ${AOHP.border}`,
                    }}
                  />
                  <span style={{ fontFamily: FONTS.body, fontSize: 15, color: AOHP.white }}>{s.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {done ? (
                    <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: AOHP.greenLight, opacity: doneOp }}>
                      {s.price}
                    </span>
                  ) : (
                    <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: AOHP.amber }}>querying…</span>
                  )}
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `1.5px solid ${done ? AOHP.green : AOHP.amber}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: AOHP.green,
                      fontSize: 11,
                    }}
                  >
                    {done ? "✓" : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* policy / taint row */}
        {frame >= POLICY_START && (
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: fade(frame, POLICY_START, POLICY_START + 10),
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                borderRadius: 8,
                backgroundColor: `${AOHP.green}14`,
                border: `1px solid ${AOHP.green}55`,
                fontFamily: FONTS.body,
                fontSize: 13,
                color: AOHP.greenLight,
              }}
            >
              <span>✓</span> Policy · inputs sanitized
            </div>
            <code
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                color: AOHP.amber,
                backgroundColor: `${AOHP.amber}14`,
                border: `1px solid ${AOHP.amber}44`,
                padding: "7px 10px",
                borderRadius: 8,
              }}
            >
              &lt;payment-card: uuid&gt;
            </code>
          </div>
        )}

        {/* result summary strip */}
        {frame >= RESULT_START && (
          <div
            style={{
              marginTop: 18,
              display: "inline-flex",
              gap: 16,
              padding: "10px 16px",
              borderRadius: 10,
              backgroundColor: AOHP.surfaceAlt,
              border: `1px solid ${AOHP.green}44`,
              opacity: fade(frame, RESULT_START + 6, RESULT_START + 16),
            }}
          >
            {["1 task", "3 services", "1 interface"].map((t, i) => (
              <React.Fragment key={t}>
                {i > 0 && <span style={{ color: AOHP.dim }}>·</span>}
                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: AOHP.greenLight }}>{t}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          width: "100%",
          textAlign: "center",
          fontFamily: FONTS.body,
          fontSize: 15,
          color: AOHP.muted,
          opacity: fade(frame, CAPTION_START, CAPTION_START + 14),
        }}
      >
        One task-level interface · cross-app service composition
      </div>

      {/* sounds */}
      <Sequence from={TYPE_START} durationInFrames={Math.round(INTENT.length * TYPE_SPEED)}>
        <Audio src={staticFile("typing.wav")} volume={0.4} />
      </Sequence>
      {SERVICES.map((s, i) => (
        <Sequence key={`disp-${i}`} from={DISPATCH + i * 8}>
          <Audio src={staticFile("whoosh.wav")} volume={0.28} />
        </Sequence>
      ))}
      {SERVICES.map((s, i) => (
        <Sequence key={`done-${i}`} from={s.done}>
          <Audio src={staticFile("pop.wav")} volume={0.4} />
        </Sequence>
      ))}
      <Sequence from={RESULT_START}>
        <Audio src={staticFile("pop.wav")} volume={0.5} />
      </Sequence>
    </SceneShell>
  );
};
