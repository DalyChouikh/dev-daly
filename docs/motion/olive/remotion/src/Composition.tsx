import { loadFont } from "@remotion/fonts";
import {
  CanvasImage,
  Easing,
  Interactive,
  Track,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

void loadFont({
  family: "Hanken",
  url: staticFile("hanken.woff2"),
  weight: "100 900",
});

type MotionProps = { reducedMotion: boolean };

const NameRevealInner = ({ reducedMotion }: MotionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Name frame"
      className="olive-motion"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "92px 110px",
        fontFamily: "Hanken, sans-serif",
        color: "#38450f",
        opacity: reducedMotion
          ? 1
          : interpolate(frame, [1.72 * fps, 2 * fps], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            }),
        translate: reducedMotion
          ? "0px 0px"
          : interpolate(
              frame,
              [1.72 * fps, 2 * fps],
              ["0px 0px", "0px -70px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.in(Easing.quad),
              },
            ),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
          fontWeight: 550,
          letterSpacing: ".03em",
        }}
      >
        <CanvasImage
          name="Selected A symbol"
          width={74}
          height={74}
          src={staticFile("a-symbol-olive.svg")}
          style={{ width: 74, height: 74, objectFit: "contain" }}
        />
        <p>SOFTWARE &amp; AI ENGINEER · TUNISIA</p>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "column",
          paddingBottom: 36,
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <Interactive.Div
            name="Daly"
            style={{
              fontSize: 270,
              fontWeight: 750,
              lineHeight: 0.98,
              letterSpacing: "-.065em",
              translate: reducedMotion
                ? "0px 0px"
                : interpolate(
                    frame,
                    [0.12 * fps, 0.84 * fps],
                    ["0px 290px", "0px 0px"],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.215, 0.61, 0.355, 1),
                    },
                  ),
            }}
          >
            Daly
          </Interactive.Div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <Interactive.Div
            name="Chouikh"
            style={{
              fontSize: 270,
              fontWeight: 750,
              lineHeight: 0.98,
              letterSpacing: "-.065em",
              translate: reducedMotion
                ? "0px 0px"
                : interpolate(
                    frame,
                    [0.25 * fps, 1.05 * fps],
                    ["0px 290px", "0px 0px"],
                    {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                      easing: Easing.bezier(0.215, 0.61, 0.355, 1),
                    },
                  ),
            }}
          >
            Chouikh
          </Interactive.Div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
          lineHeight: 1.3,
        }}
      >
        <p>
          Thoughtful interfaces.
          <br />
          Useful systems.
        </p>
        <p>Selected work ↗</p>
      </div>
    </Interactive.Div>
  );
};

/** Displays the bounded name reveal as an independently editable scene. */
export const NameReveal = Interactive.create({
  Component: NameRevealInner,
  layout: "absolute-fill",
});

const LogoResolveInner = ({ reducedMotion }: MotionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Logo frame"
      className="olive-motion"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 54,
        fontFamily: "Hanken, sans-serif",
        color: "#38450f",
        opacity: reducedMotion
          ? 1
          : interpolate(frame, [1.7 * fps, 2 * fps], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            }),
        translate: reducedMotion
          ? "0px 0px"
          : interpolate(frame, [1.7 * fps, 2 * fps], ["0px 0px", "0px -60px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.in(Easing.quad),
            }),
      }}
    >
      <Interactive.Div
        name="Selected A wordmark reveal"
        style={{
          width: 850,
          height: 360,
          overflow: "hidden",
          clipPath: reducedMotion
            ? "inset(0 0% 0 0)"
            : `inset(0 ${interpolate(frame, [0.08 * fps, 0.83 * fps], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.215, 0.61, 0.355, 1) })}% 0 0)`,
        }}
      >
        <CanvasImage
          name="Daly selected A wordmark"
          width={850}
          height={360}
          src={staticFile("a-wordmark-olive.svg")}
          style={{ width: 850, height: 360 }}
        />
      </Interactive.Div>
      <Interactive.Div
        name="Full name"
        style={{
          fontSize: 32,
          letterSpacing: ".02em",
          opacity: reducedMotion
            ? 1
            : interpolate(frame, [0.65 * fps, 1 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
          translate: reducedMotion
            ? "0px 0px"
            : interpolate(
                frame,
                [0.65 * fps, 1 * fps],
                ["0px 20px", "0px 0px"],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                },
              ),
        }}
      >
        Mohamed Ali Chouikh — Daly, for short.
      </Interactive.Div>
    </Interactive.Div>
  );
};

/** Resolves the selected A wordmark without changing its geometry. */
export const LogoResolve = Interactive.create({
  Component: LogoResolveInner,
  layout: "absolute-fill",
});

const ProductProofInner = ({ reducedMotion }: MotionProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Product frame"
      className="olive-motion"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "92px 110px",
        fontFamily: "Hanken, sans-serif",
        color: "#ecebe7",
        backgroundColor: "#38450f",
        translate: reducedMotion
          ? "0px 0px"
          : interpolate(frame, [0, 0.85 * fps], ["0px 1080px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.215, 0.61, 0.355, 1),
            }),
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          fontWeight: 550,
          letterSpacing: ".03em",
        }}
      >
        <p>SELECTED WORK / 01</p>
        <p>FROM IDENTITY TO WORKING PRODUCT</p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "650px 1fr",
          alignItems: "center",
          gap: 64,
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <Interactive.Div
            name="Category"
            style={{ fontSize: 24, letterSpacing: ".06em" }}
          >
            COMMUNITY TOOLS
          </Interactive.Div>
          <Interactive.Div
            name="Product name"
            style={{
              fontSize: 128,
              fontWeight: 650,
              letterSpacing: "-.06em",
              lineHeight: 1,
            }}
          >
            TapNShow
          </Interactive.Div>
          <Interactive.Div
            name="Product purpose"
            style={{ maxWidth: 570, fontSize: 38, lineHeight: 1.3 }}
          >
            Meeting coordination,
            <br />
            without the back-and-forth.
          </Interactive.Div>
        </div>
        <CanvasImage
          name="Real TapNShow invitation"
          src={staticFile("tapnshow-invite.png")}
          style={{
            width: 986,
            height: 605,
            objectFit: "contain",
            opacity: reducedMotion
              ? 1
              : interpolate(frame, [0.5 * fps, 1.15 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
            scale: reducedMotion
              ? 1
              : interpolate(frame, [0.5 * fps, 1.15 * fps], [0.94, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.215, 0.61, 0.355, 1),
                  output: "perceptual-scale",
                }),
            translate: reducedMotion
              ? "0px 0px"
              : interpolate(
                  frame,
                  [0.5 * fps, 1.15 * fps],
                  ["0px 90px", "0px 0px"],
                  {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.bezier(0.215, 0.61, 0.355, 1),
                  },
                ),
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          borderTop: "1px solid #7b844e",
          paddingTop: 30,
        }}
      >
        <p>Built for communities. Designed to be used.</p>
        <p>daly. / Software &amp; AI Engineer</p>
      </div>
    </Interactive.Div>
  );
};

/** Presents the supplied TapNShow invitation as the final product chapter. */
export const ProductProof = Interactive.create({
  Component: ProductProofInner,
  layout: "absolute-fill",
});

/** Sequences the three chapters into a deterministic eight-second study. */
export const OliveStudy = ({ reducedMotion }: MotionProps) => {
  const { fps } = useVideoConfig();
  return (
    <Track name="Identity to product">
      <NameReveal
        name="Name reveal"
        durationInFrames={2 * fps}
        reducedMotion={reducedMotion}
        style={{ backgroundColor: "#ecebe7", color: "#38450f" }}
      />
      <LogoResolve
        name="Selected A logo"
        from={2 * fps}
        durationInFrames={2 * fps}
        reducedMotion={reducedMotion}
        style={{ backgroundColor: "#ecebe7", color: "#38450f" }}
      />
      <ProductProof
        name="TapNShow proof"
        from={4 * fps}
        durationInFrames={4 * fps}
        reducedMotion={reducedMotion}
        style={{ backgroundColor: "#ecebe7" }}
      />
    </Track>
  );
};
