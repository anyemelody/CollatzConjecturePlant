class collatzConjecture {
  constructor(num) {
    this.numList = [];
    this.color = [];

    this.num = num;
    this.basicRotate = PI * random(0.06);
    this.rotateAngle = 0;
    this.segment = 72;
    this.strokeW = [];
    this.alpha = [];
    this.noiseAngle = random();
    this.noiseSaturate = random();
    this.noiseBright = random();
    this.noiseSeed = random(1000);
  }

  recordNum() {
    while (this.num > 1) {
      this.numList.push(this.num);
      if (this.num % 2 == 0) {
        //if even
        this.num = this.num / 2;
      } else {
        //if odd
        this.num = (3 * this.num + 1) / 2;
      }
    }
    this.numList.push(1);
    this.numList.reverse();
  }

  recordColor(index, lineNum) {
    colorMode(HSB, 360, 100, 100, 100);
    let hue, saturation, bright, strokeW, alpha;
    for (let i = 0; i < this.numList.length; i++) {
      this.noiseSaturate += 0.01;
      this.noiseBright += 0.01;
      strokeW = map(i, 0, this.numList.length, 30, 0);
      alpha = map(i, 0, this.numList.length, 100, 50);
      hue = map(
        sin((PI / this.numList.length) * i + (PI / lineNum) * index),
        -1,
        1,
        200,
        360
      );
      saturation = map(noise(this.noiseSaturate), 0, 1, 60, 100); //60, 90
      bright = map(noise(this.noiseBright), 0, 1, 90, 100);
      let color = createVector(hue, saturation, bright);
      this.color.push(color);
      this.alpha.push(alpha);
      this.strokeW.push(strokeW);
    }
  }

  drawLine(index, colorMode) {
    push();
    for (let i = 0; i < this.numList.length; i++) {
      this.noiseAngle += 0.001;
      this.rotateAngle = this.basicRotate;//+sin(this.noiseAngle) * (1 / this.numList.length);

      let n = this.numList[i];
      if (n % 2 == 0) {
        rotate((noise(i) * .4) + noise(this.noiseAngle) * 0.001);
      } else {
        rotate(-(noise(i) * .5));
      }
      if (n % 3 == 0 && i > 16) {
        ellipse(0, 0, 12, 12);
      }
      strokeWeight(this.strokeW[i]);
      let saturate = 0;
      if (colorMode == true) {
        saturate = 0;
      } else {
        saturate = this.color[i].y;

      }
      let noiseAlpha = sin(this.noiseAngle + index) * 50;
      let noiseHue =
        sin(((2 * PI) / this.numList.length) * i + this.noiseAngle) * 30;
      stroke(
        this.color[i].x + noiseHue,
        saturate,
        this.color[i].z,
        this.alpha[i] + noiseAlpha
      );
      fill(
        this.color[i].x + noiseHue,
        saturate,
        this.color[i].z,
        this.alpha[i] + noiseAlpha
      );
      line(0, 0, 0, -this.segment);
      translate(0, -this.segment);
    }
    pop();
  }
}

export default collatzConjecture;
