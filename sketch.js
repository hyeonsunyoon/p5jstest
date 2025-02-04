let t = 0;

function setup() {
  createCanvas((v = 500), (w = 804));
  colorMode(HSB, 255);
}

function draw() {
  t += 3;

  // 기존 흐름
  copy(10, 0.8, v, w * 0.6, 15, 1, v, w);
  scale(1);
  for (let x = v; --x; ) {
    if (abs(t + ((x - t) ^ (x + t)) ** 3) % 387 < 7) {
      stroke(random(255), 200, 255);
    } else {
      stroke(255, 250);
    }
    point(x, 2);
  }

  // 포커스 효과
  applyFocus(mouseX, mouseY, 1); // 마우스 위치를 중심으로 포커스 적용
}

function applyFocus(x, y, radius) {
  noFill();
  for (let r = radius; r > 0; r -= 5) {
    let alpha = map(r, 0, radius, 0, 10); // 점진적으로 어두워지는 효과
    fill(0, 0, 0, alpha);
    ellipse(x, y, r * 12);
  }
}

function mousePressed() {
  save("pix.jpg");
}
