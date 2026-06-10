import { loadFont as loadUrbanist } from "@remotion/google-fonts/Urbanist";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { AOHP } from "../../../types/constants";

const urbanist = loadUrbanist("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700", "800"],
});
const inter = loadInter("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});
const mono = loadMono("normal", { subsets: ["latin"], weights: ["400", "500", "600"] });

export const FONTS = {
  heading: urbanist.fontFamily,
  body: inter.fontFamily,
  mono: mono.fontFamily,
};

export { AOHP };
