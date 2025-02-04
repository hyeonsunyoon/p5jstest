let net = [];
let t = 0;
let size = 105;
const gravity = 0.3; // 중력 값
const damping = 0.6; // 감쇠 계수
const bounce = -0.7; // 탄성 계수
const groundLevel = 1300; // 화면 바닥의 y 위치

let xSlider, ySlider; // 슬라이더 변수

function setup() {
  createCanvas(1000, 1500);
  background(255);
  angleMode(DEGREES);

  // 슬라이더 생성
  xSlider = createSlider(0, width, width / 2);
  xSlider.position(10, 10);
  ySlider = createSlider(0, height, height / 2);
  ySlider.position(10, 40);

  for (let x = 0; x <= width / size; x++) {
    net[x] = [];
    for (let y = 0; y <= height / size; y++) {
      net[x][y] = new Point(x, y); // x, y 좌표 전달
    }
  }
  for (let x = 0; x < net.length; x++) {
    for (let y = 0; y < net[x].length; y++) {
      net[x][y].next();
    }
  }
}

function draw() {
  background(255);
  t += 2;

  for (let x = 0; x < net.length; x++) {
    for (let y = 0; y < net[x].length; y++) {
      net[x][y].applyGravity();
      net[x][y].checkCollision();
      net[x][y].move(t);
    }
  }

  // 그물의 선을 그리기
  for (let x = 0; x < net.length; x++) {
    noFill();
    beginShape();
    for (let y = 0; y < net[x].length; y++) {
      curveVertex(net[x][y].c.x, net[x][y].c.y);
    }
    endShape();
  }

  for (let y = 0; y < net[0].length; y++) {
    beginShape();
    for (let x = 0; x < net.length; x++) {
      curveVertex(net[x][y].c.x, net[x][y].c.y);
    }
    endShape();
  }
}

class Point {
  constructor(x, y) {
    this.gridX = x; // grid에서의 x 좌표
    this.gridY = y; // grid에서의 y 좌표
    this.o = createVector(x * size, y * size); // 초기 위치
    this.c = createVector(x * size, y * size); // 현재 위치
    this.vel = createVector(0, 0); // 속도 벡터
    this.acc = createVector(0, 0); // 가속도 벡터
    this.nextTo = [];
    this.isBroken = false; // 점이 부서졌는지 여부
  }

  next() {
    this.nextTo = neighbors(net, this.gridX, this.gridY); // 수정된 부분
  }

  applyGravity() {
    if (this.isBroken) return; // 부서진 점은 중력을 받지 않음
    this.acc.add(0, gravity); // 중력 적용
    this.vel.add(this.acc); // 가속도에 따라 속도 증가
    this.vel.mult(damping); // 속도 감쇠
    this.c.add(this.vel); // 속도에 따라 위치 이동
    this.acc.set(0, 0); // 가속도 초기화
  }

  checkCollision() {
    if (this.c.y >= groundLevel) {
      this.c.y = groundLevel; // 바닥 위치로 고정
      if (this.vel.y > 1) {
        this.vel.y *= bounce; // 탄성 효과
        if (abs(this.vel.y) < 0.5) {
          this.isBroken = true; // 일정 속도 이하로 충돌하면 부서짐
        }
      } else {
        this.isBroken = true; // 천천히 내려와도 부서짐
      }
    }
  }

  move(time) {
    if (this.isBroken) return; // 부서진 점은 움직이지 않음
    let sliderX = xSlider.value(); // 슬라이더의 x 값
    let sliderY = ySlider.value(); // 슬라이더의 y 값
    let v = createVector(sliderX - this.o.x, sliderY - this.o.y);
    let ang = v.heading() + 150;

    // 원래 위치에서 변형된 위치 계산
    let offset = createVector(cos(ang) * 10, sin(ang) * 200);
    this.c.add(offset.mult(0.05)); // 슬라이더에 따른 추가 변형
  }
}

function neighbors(arr, m, n) {
  let v = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  return v
    .filter(
      ([h, j]) =>
        h + m >= 0 && h + m < arr.length && j + n >= 0 && j + n < arr[0].length
    )
    .map(([h, j]) => arr[h + m][j + n]);
}