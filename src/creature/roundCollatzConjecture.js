const canvasSketch = require('canvas-sketch');
const p5 = require('p5');

new p5()

const settings = {
  dimensions: [1024, 1024],
  p5: true,
  // Turn on a render loop (it's off by default in canvas-sketch)
  animate: true,
  // We can specify WebGL context if we want
  // context: 'webgl',
  // Optional loop duration
  duration: 6,
  // Enable MSAA
  attributes: {
    antialias: true
  }
};


let collatzArray = [];

const sketch = () => {
  background(0);
  let totalLine = 120;

  for (let i = 0; i < totalLine; i++) {
    // collatzArray.push (new collatzConjecture(i+1));
    // collatzArray[i].recordNum();
    // console.log(collatzArray[i].numList.length);
    // collatzArray.filter(item => (item.numList.length<10));
    let collatz = new collatzConjecture(floor(random(1000)));
    collatz.recordNum();
    if (collatz.numList.length < 64) {
      collatzArray.push(collatz);
    }
  }


  for (let i = 0; i < collatzArray.length; i++) {
    collatzArray[i].recordColor(i, collatzArray.length);
  }


  

  let deltaX=0, deltaY = 0,deltaRotate=0;


  return ({ context, width, height }) => {
    background(0,50);
    deltaX += 0.002;
    deltaY += 0.003;
    deltaRotate += 0.0012;


    for (let i = 0; i < collatzArray.length; i++) {
      // resetMatrix();
      push();
      translate(width / 2+(noise(deltaX)-0.5)*300, height/2+(noise(deltaY)-0.5)*300);
      rotate(2*PI/(collatzArray.length)*i+deltaRotate);
      collatzArray[i].drawLine(i);
      pop();
    }


  };
};

canvasSketch(sketch, settings);



function collatzConjecture(num) {
  this.numList = [];
  this.color = [];

  this.num = num;
  this.basicRotate = PI * 0.05;
  this.rotateAngle = 0;
  this.segment = 10;
  this.strokeW = [];
  this.alpha = [];
  this.noiseAngle = random();
  this.noiseColor = random();
  this.noiseBright = random();


  this.recordNum = function () {
    while (this.num > 1) {
      this.numList.push(this.num);
      if (this.num % 2 == 0) { //if even 
        this.num = this.num / 2;
      }
      else { //if odd
        this.num = (3 * this.num + 1) / 2;
      }
    }
    this.numList.push(1);
    // this.numList.reverse();
  }

  this.recordColor = function (index, lineNum) {
    colorMode(HSB, 360, 100, 100, 100);
    let hue, saturation, bright, strokeW, alpha;
    for (let i = 0; i < this.numList.length; i++) {
      this.noiseColor += 0.01;
      this.noiseBright += 0.01;
      strokeW = map(i, 0, this.numList.length, 4, 0);
      alpha = map(i, 0, this.numList.length, 100, 50);
      hue = map(sin(PI/this.numList.length*i+PI/lineNum*(index)), -1, 1, 210, 270);
      saturation = map(noise(this.noiseColor), 0, 1, 60,90);
      bright = map(noise(this.noiseBright), 0, 1,90,100);
      let color = createVector(hue, saturation, bright);
      this.color.push(color);
      this.alpha.push(alpha);
      this.strokeW.push(strokeW);
    }

  }



  this.drawLine = function (index) {
    for (let i = 0; i < this.numList.length; i++) {
      this.noiseAngle += .0005;
      this.rotateAngle = this.basicRotate + sin(this.noiseAngle) * (2 / this.numList.length);//

      let n = this.numList[i];
      if (n % 2 == 0) {
        rotate(1*this.rotateAngle);
        
      }
      else {
        rotate(-1.1* this.rotateAngle);
      }
      if(n%4 ==0 && i>6){
        ellipse(0, 0, 3.6, 3.6);
      }
      strokeWeight(this.strokeW[i]);
      let noiseAlpha = sin(2*PI/this.numList.length*this.noiseAngle*30+index)*50;
      let noiseHue = sin(2*PI/this.numList.length*i+frameCount*0.1)*30;
      stroke(this.color[i].x+noiseHue, this.color[i].y, this.color[i].z, this.alpha[i]+noiseAlpha);
      fill(this.color[i].x+noiseHue, this.color[i].y, this.color[i].z, this.alpha[i]+noiseAlpha);
      line(0, 0, 0, -this.segment); 
      translate(0, -this.segment);

    }
  }

}