const GRIDWIDTH = 40;
var W, H;
var snake;
var fruit;
var paused;
var failed;
var score;
var wait;
var speed = 10;

function setup() {
  createCanvas(800, 800);
  createP('Press p to pause');
  createP('Use Arrow to move')
  createP('Press space to move faster')
  frameRate(60);
  W = width / GRIDWIDTH;
  H = height / GRIDWIDTH;
  reset();
}

function draw() {
  var tSize = height / 16;
  if (frameCount % speed == 0) {
    if (!paused) {
      rectMode(CORNER);
      background(0);
      fill(255);
      rect(fruit.x * W, fruit.y * H, W, H);
      snake.update();
      snake.display();
      fill(255);
      textSize(height / 32)
      text("score :" + score, 12 * width / 16, height / 16)
    }
    wait = false;
  }
  if (failed) {
    infoBox();
    fill(0);
    textSize(tSize);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2 - tSize - 10);
    text("Score : " + score, width / 2, height / 2);
    textSize(height / 32);
    text("Pressed any key to retry", width / 2, height / 2 + tSize);
  } else if (paused) {
    infoBox();
    fill(0);
    textSize(tSize);
    textAlign(CENTER);
    text("Paused", width / 2, height / 2 - tSize - 10);
    textSize(height / 32);
    text("Pressed P to resume", width / 2, height / 2);
  }
}

function infoBox() {
  rectMode(CENTER);
  fill(127, 145, 100);
  var offsetY = height / 20;
  rect(width / 2, height / 2 - offsetY, width / 2, height / 3);
}

function reset() {
  snake = new Snake(3);
  fruit = createFruit();
  score = 0;
  failed = false;
  paused = false;
  wait = false;
}

function keyPressed() {
  if (key == 'p') {
    paused = !paused;
  } else if (key == ' ') {
    speed = 4;
  }
  if (!wait) {
    switch (keyCode) {
      case UP_ARROW:
        if (snake.dir.y != 1)
          snake.move(0, -1);
        break;
      case RIGHT_ARROW:
        if (snake.dir.x != -1)
          snake.move(1, 0);
        break;
      case DOWN_ARROW:
        if (snake.dir.y != -1)
          snake.move(0, 1);
        break;
      case LEFT_ARROW:
        if (snake.dir.x != 1)
          snake.move(-1, 0);
        break;
      default:
        if (failed)
          reset();
        break;
    }
  }
}

function keyReleased() {
  if (key == ' ') {
    speed = 10;
  }
}

function gameOver() {
  paused = true;
  failed = true;
}

function createFruit() {
  return {
    x: int(random(GRIDWIDTH)),
    y: int(random(GRIDWIDTH))
  }
}

class Snake {
  constructor(length) {
    this.tailSize = length;
    this.tail = []
    this.pos = new p5.Vector(GRIDWIDTH / 2, GRIDWIDTH / 2);
    this.dir = new p5.Vector(1, 0);
  }
  move(x, y) {
    this.dir.set(x, y);
    wait = true;
  }
  update() {
    this.pos.add(this.dir);
    this.tail.splice(0, 0, {
      x: this.pos.x,
      y: this.pos.y
    })
    for (var i = 1; i < this.tail.length; i++) {
      if (i > this.tailSize - 1)
        this.tail.pop();
      else if (this.pos.x == this.tail[i].x && this.pos.y == this.tail[i].y)
        gameOver();
    }

    this.edges();
    this.grow();

  }

  grow() {
    if (fruit.x == this.pos.x && fruit.y == this.pos.y) {
      fruit = createFruit();
      this.tailSize++;
      score += 100;
    }
  }

  edges() {
    if (this.pos.x > GRIDWIDTH - 1 ||
      this.pos.x < 0 ||
      this.pos.y > GRIDWIDTH - 1 ||
      this.pos.y < 0)
      gameOver();
  }

  display() {
    var c1 = [color(10, 130, 32), color(20, 200, 45)];
    var c2 = [color(255, 51, 51), color(255, 255, 51)];
    var c3 = [color(0, 0, 204), color(153, 51, 255)];
    var c4 = [color(240, 153, 123), color(153, 43, 250)];
    for (var i = 0; i < this.tail.length; i++) {
      noStroke();

      if (score < 5000)
        fill(lerpColor(c1[0], c1[1], i / this.tail.length));
      else if (score < 10000)
        fill(lerpColor(c2[0], c2[1], i / this.tail.length));
      else if (score < 15000)
        fill(lerpColor(c3[0], c3[1], i / this.tail.length));
      else {
        fill(lerpColor(c4[0], c4[1], i / this.tail.length));
      }
      rect(this.tail[i].x * W, this.tail[i].y * H, W, H);
    }
  }
}