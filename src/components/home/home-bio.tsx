"use client";

import { EmailReveal } from "./email-reveal";
import { useHome } from "./home-context";
import { HomeVideoButton } from "./home-video-button";
import { Reveal, RevealContent, RevealTrigger } from "./reveal";

/*
 * The bio, pill-for-pill from the design. Pill ids 1–13 match TOTAL_REVEALS and
 * drive the R{n}/13 counter, so renumber both together if you add a pill.
 */

const VTOL_SEARCH =
  "https://www.google.com/search?q=vertical+takeoff+and+landing+aircraft";

export function HomeBio() {
  const { videoState } = useHome();

  return (
    <div className="home-multiply" data-state={videoState}>
      <div className="intro-scale">
        <div className="home-container">
          <span className="home-text" style={{ "--delay": 0 } as React.CSSProperties}>
            Hi there! I’m{" "}
            <Reveal id={1} label="Evan">
              {" "}
              Sie. I’m a senior studying for a Bachelor’s in Mechanical
              Engineering at{" "}
              <Reveal id={2} label="UTD">
                . I love anything related to{" "}
                <Reveal id={3} label="STEM">
                  . Over the years I discovered my niche: building and piloting
                  model aircraft.{" "}
                </Reveal>
              </Reveal>
            </Reveal>
          </span>

          <span className="home-text" style={{ "--delay": 1 } as React.CSSProperties}>
            <span className="keep-together">
              My background is in <RevealTrigger id={4}>Aerospace</RevealTrigger>
            </span>
            <RevealContent id={4}>
              . I 3D printed a{" "}
              <a className="home-link" href={VTOL_SEARCH} target="_blank" rel="noopener">
                VTOL
              </a>{" "}
              <Reveal id={5} label="aircraft">
                {" "}
                that takes off like a drone and unfolds its wings mid-flight.
              </Reveal>{" "}
              I wear many different hats, but my main focus is in{" "}
              <Reveal id={6} label="engineering">
                . I led a team of student engineers in launching a{" "}
                <Reveal id={7} label="payload">
                  {" "}
                  measuring ozone and radiation at 94,000ft.
                </Reveal>{" "}
                Before that I used a{" "}
                <Reveal id={8} label="Raspberry Pi">
                  {" "}
                  to build a smart mirror for my bedroom, a futuristic and
                  convenient way to get my day’s information.
                </Reveal>
              </Reveal>{" "}
              I love to explore the world and{" "}
              <HomeVideoButton>take pictures</HomeVideoButton> to compose and
              tell a story. My dream is to live in the{" "}
              <Reveal id={9} label="Swiss Alps">
                , but I currently live in{" "}
                <Reveal id={10} label="Frisco TX">
                  , though I was born in{" "}
                  <Reveal id={11} label="Jakarta">
                    , Indonesia
                  </Reveal>
                  .{" "}
                </Reveal>
              </Reveal>
            </RevealContent>
          </span>

          <span className="home-text" style={{ "--delay": 2 } as React.CSSProperties}>
            <span className="keep-together">
              You can reach me through{" "}
              <RevealTrigger id={12}>LinkedIn</RevealTrigger>
            </span>
            <RevealContent id={12}>
              {" "}
              or <EmailReveal id={13} address="evansie485@gmail.com" /> to
              collaborate and start a project. Let’s see if we can make it
              happen.
            </RevealContent>
          </span>
        </div>
      </div>
    </div>
  );
}
