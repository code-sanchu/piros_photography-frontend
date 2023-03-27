import { useState } from "react";
import { animated, useSpring } from "@react-spring/web";

const Test = () => {
  return (
    <div className="flex min-h-screen flex-col gap-lg">
      <div className="fixed left-[300px] h-screen w-[1px] bg-red-900" />
      <div className="fixed left-1/2 h-screen w-[1px] bg-blue-900" />
      <div className="fixed top-1/2 h-[1px] w-screen bg-red-900" />
      <div className="fixed top-[200px] h-[1px] w-screen bg-red-900" />

      <div>{window ? <AnimatedDivTranslateY /> : null}</div>
      {/*       <div>
        <AnimatedDivTranslateXFromX0 />
      </div> */}
      {/*       <div className="pl-[60px]">
        <AnimatedDivTranslateXFromXOffset />
      </div> */}
    </div>
  );
};

export default Test;

const AnimatedDivTranslateXFromX0 = () => {
  const [isTransformed, setIsTransformed] = useState(false);

  const initialWidth = 300;

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      width: initialWidth,
      height: 300,
      x: 0,
      y: 0,
    },
  }));

  const transformWidth = 400;

  // const translateX = window.innerWidth / 2;
  const translateX = window.innerWidth / 2 - transformWidth / 2;

  return (
    <animated.div
      className="grid h-[300px] w-[300px] place-items-center bg-yellow-100"
      style={springs}
      onClick={() => {
        if (!isTransformed) {
          api.start({
            width: transformWidth,
            height: 300,
            x: translateX,
            // x: 300,
            y: 0,
          });
          setIsTransformed(true);
        } else {
          api.start({
            width: 300,
            height: 300,
            x: 0,
            y: 0,
          });
          setIsTransformed(false);
        }
      }}
    >
      X from pos.x 0
    </animated.div>
  );
};

const AnimatedDivTranslateXFromXOffset = () => {
  const [isTransformed, setIsTransformed] = useState(false);

  const initialPosX = 60;

  const initialWidth = 300;

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      width: initialWidth,
      height: 300,
      x: 0,
      y: 0,
    },
  }));

  const transformWidth = 400;

  const translateX = window.innerWidth / 2 - transformWidth / 2 - initialPosX;

  return (
    <animated.div
      className="h-[300px] w-[300px] bg-yellow-100"
      style={springs}
      onClick={() => {
        if (!isTransformed) {
          api.start({
            width: transformWidth,
            height: 300,
            x: translateX,
            // x: 300,
            y: 0,
          });
          setIsTransformed(true);
        } else {
          api.start({
            width: 300,
            height: 300,
            x: 0,
            y: 0,
          });
          setIsTransformed(false);
        }
      }}
    >
      x from pos.x 60
    </animated.div>
  );
};

const AnimatedDivTranslateY = () => {
  const [isTransformed, setIsTransformed] = useState(false);

  const initialHeight = 300;

  const [springs, api] = useSpring(() => ({
    config: { tension: 280, friction: 60 },
    from: {
      width: 300,
      height: initialHeight,
      x: 0,
      y: 0,
    },
  }));

  const transformHeight = 400;

  const translateY = window.innerHeight / 2 - transformHeight / 2;

  return (
    <animated.div
      className="grid h-[300px] w-[300px] place-items-center bg-yellow-100"
      style={springs}
      onClick={() => {
        if (!isTransformed) {
          api.start({
            width: 300,
            height: initialHeight,
            x: 0,
            y: 200,
          });
          setIsTransformed(true);
        } else {
          api.start({
            width: 300,
            height: 300,
            x: 0,
            y: 0,
          });
          setIsTransformed(false);
        }
      }}
    >
      y
    </animated.div>
  );
};
