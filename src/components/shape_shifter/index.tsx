import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import S from './shape_shifter.js';

const ShapeShifter = forwardRef((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simulate = (str: string) => {
    S.UI.simulate(str);
  };
  useImperativeHandle(ref, () => ({
    simulate,
  }));

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      S.init(canvas);
      S.Drawing.loop(function () {
        S.Shape.render();
      });
    }
    return () => {
      S.Drawing.cancelAnimationFrame();
    };
  }, []);
  return <canvas ref={canvasRef}></canvas>;
});

export default ShapeShifter;
