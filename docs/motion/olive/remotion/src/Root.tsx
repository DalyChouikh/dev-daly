import { Composition, Folder } from "remotion";
import {
  OliveStudy,
  NameReveal,
  LogoResolve,
  ProductProof,
} from "./Composition";

/** Registers the complete study, reduced-motion variant, and editable scenes. */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="OliveStudy"
        component={OliveStudy}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ reducedMotion: false }}
      />
      <Composition
        id="OliveReducedMotion"
        component={OliveStudy}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ reducedMotion: true }}
      />
      <Folder name="Scenes">
        <Composition
          id="NameReveal"
          component={NameReveal}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            reducedMotion: false,
            style: { backgroundColor: "#ecebe7", color: "#38450f" },
          }}
        />
        <Composition
          id="LogoResolve"
          component={LogoResolve}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            reducedMotion: false,
            style: { backgroundColor: "#ecebe7", color: "#38450f" },
          }}
        />
        <Composition
          id="ProductProof"
          component={ProductProof}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            reducedMotion: false,
            style: { backgroundColor: "#ecebe7" },
          }}
        />
      </Folder>
    </>
  );
};
