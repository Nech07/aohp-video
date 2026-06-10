import { Composition } from "remotion";
import { IntroScene, INTRO_SCENE_DURATION } from "./scenes/IntroScene";
import { ContrastScene, CONTRAST_SCENE_DURATION } from "./scenes/ContrastScene";
import { CapabilitiesScene, CAPABILITIES_SCENE_DURATION } from "./scenes/CapabilitiesScene";
import { TaskScene, TASK_SCENE_DURATION } from "./scenes/TaskScene";
import { MetricsScene, METRICS_SCENE_DURATION } from "./scenes/MetricsScene";
import { CtaScene, CTA_SCENE_DURATION } from "./scenes/CtaScene";
import { FullVideo, FULL_VIDEO_DURATION } from "./scenes/FullVideo";
import { VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_FPS } from "../../types/constants";

const common = {
  fps: VIDEO_FPS,
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Full video composition */}
      <Composition
        id="AohpFull"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        {...common}
      />

      {/* Individual scenes for development/preview */}
      <Composition id="AohpIntro" component={IntroScene} durationInFrames={INTRO_SCENE_DURATION} {...common} />
      <Composition id="AohpContrast" component={ContrastScene} durationInFrames={CONTRAST_SCENE_DURATION} {...common} />
      <Composition
        id="AohpCapabilities"
        component={CapabilitiesScene}
        durationInFrames={CAPABILITIES_SCENE_DURATION}
        {...common}
      />
      <Composition id="AohpTask" component={TaskScene} durationInFrames={TASK_SCENE_DURATION} {...common} />
      <Composition id="AohpMetrics" component={MetricsScene} durationInFrames={METRICS_SCENE_DURATION} {...common} />
      <Composition id="AohpCta" component={CtaScene} durationInFrames={CTA_SCENE_DURATION} {...common} />
    </>
  );
};
