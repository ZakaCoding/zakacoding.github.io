import { Player } from '@lottiefiles/react-lottie-player';

import localAiRobot from '../assets/image/local-ai-robot.webp';
import robotEyes from '../assets/lottie/local-ai-eyes.json';

export default function LocalAiRobot() {
  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <span className="robot-lottie-figure" aria-hidden="true">
      <span className="robot-body-layer">
        <img src={localAiRobot} alt="" width="640" height="640" />
      </span>
      <span className="robot-head-layer">
        <span className="robot-head-idle">
          <img src={localAiRobot} alt="" width="640" height="640" />
          <Player
            src={robotEyes}
            autoplay={!reduceMotion}
            loop={!reduceMotion}
            speed={1}
            className="robot-eye-lottie"
          />
        </span>
      </span>
    </span>
  );
}
