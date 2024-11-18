import canvasSketch from "canvas-sketch";
import p5 from "p5";
import collatzConjecture from "./collatzConjecture";

new p5();

const settings = {
  dimensions: [2159, 2794],
  p5: true,
  // Turn on a render loop (it's off by default in canvas-sketch)
  animate: true,
  // We can specify WebGL context if we want
  // context: 'webgl',
  // Optional loop duration
  duration: 5,
  // Enable MSAA
  attributes: {
    antialias: true,
  },
};

let collatzArray = [];
let colorMode = 0;

const sketch = () => {
  background(0);
  let totalLine = 500;

  for (let i = 0; i < totalLine; i++) {
    let collatz = new collatzConjecture(floor(random(1000)));
    collatz.recordNum();
    if (collatz.numList.length < 60) {
      collatzArray.push(collatz);
    }
  }

  for (let i = 0; i < collatzArray.length; i++) {
    collatzArray[i].recordColor(i, collatzArray.length);
  }



  window.mousePressed = () => {
   colorMode = !colorMode;
  };

  let frame = 0;

  return ({ context, width, height }) => {
    background(0);
    frame += 0.01;

    for (let i = 0; i < collatzArray.length; i++) {
      push();
      translate(width / 4, height);
      rotate(sin(frame) * 0.06);
      collatzArray[i].drawLine(i, colorMode);
      pop();
    }
  };
};

canvasSketch(sketch, settings);
