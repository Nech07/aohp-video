import React from "react";
import { AbsoluteFill, Series, Audio, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { IntroScene, INTRO_SCENE_DURATION } from "./IntroScene";
import { ContrastScene, CONTRAST_SCENE_DURATION } from "./ContrastScene";
import { CapabilitiesScene, CAPABILITIES_SCENE_DURATION } from "./CapabilitiesScene";
import { TaskScene, TASK_SCENE_DURATION } from "./TaskScene";
import { MetricsScene, METRICS_SCENE_DURATION } from "./MetricsScene";
import { CtaScene, CTA_SCENE_DURATION } from "./CtaScene";

export const FULL_VIDEO_DURATION =
  INTRO_SCENE_DURATION +
  CONTRAST_SCENE_DURATION +
  CAPABILITIES_SCENE_DURATION +
  TASK_SCENE_DURATION +
  METRICS_SCENE_DURATION +
  CTA_SCENE_DURATION;

const MUSIC_FADE_IN = 30; // 1s
const MUSIC_FADE_OUT = 60; // 2s
const MUSIC_VOLUME = 0.28;

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, MUSIC_FADE_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [FULL_VIDEO_DURATION - MUSIC_FADE_OUT, FULL_VIDEO_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile("background-music.wav")} volume={fadeIn * fadeOut * MUSIC_VOLUME} />;
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0F0A" }}>
      <Series>
        <Series.Sequence durationInFrames={INTRO_SCENE_DURATION}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CONTRAST_SCENE_DURATION}>
          <ContrastScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CAPABILITIES_SCENE_DURATION}>
          <CapabilitiesScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TASK_SCENE_DURATION}>
          <TaskScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={METRICS_SCENE_DURATION}>
          <MetricsScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_SCENE_DURATION}>
          <CtaScene />
        </Series.Sequence>
      </Series>

      <Sequence durationInFrames={FULL_VIDEO_DURATION}>
        <BackgroundMusic />
      </Sequence>
    </AbsoluteFill>
  );
};
