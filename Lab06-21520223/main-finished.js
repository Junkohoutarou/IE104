// Tạo biến tham chiếu p
const para = document.querySelector("p");
let count = 0;

// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);


// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  return num;
  }

// Phạm Quốc Cường - 20521150
// Định nghĩa constructor shape
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// contructor Ball kế thừa các thuộc tính từ contructor shape
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

// giữ nguyên draw và update 
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// thay đổi phương thức collisionDetect()

Ball.prototype.collisionDetect = function () {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.size + balls[j].size && balls[j].exists) {
      balls[j].color = this.color =
      "rgb(" + random(0, 255) + "," + random(0, 255) + "," +  random(0, 255) + ")";
      }
    }
  }
};
  
// 4.2 
// Create EvilCircle
function EvilCircle(x, y, exists) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = "white";
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

// 4.3
// phương thức draw của EvilCircle
EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.strokeStyle = this.color;
  ctx.lineWidth = 3;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

// Phương thức CheckBounds của EvilCircle
EvilCircle.prototype.checkBounds = function () {
  if (this.x + this.size >= width) {
    this.x -= this.size;
  }
  if (this.x - this.size <= 0) {
    this.x += this.size;
  }
  if (this.y + this.size >= height) {
    this.y -= this.size;
  }
  if (this.y - this.size <= 0) {
    this.y += this.size;
  }
};

// Phương thức Controls của EvilCircle
EvilCircle.prototype.setControls = function () {
  var _this = this;
  window.onkeydown = function (e) {
    if (e.key === "a") {
      _this.x -= _this.velX;
    } else if (e.key === "d") {
      _this.x += _this.velX;
    } else if (e.key === "w") {
      _this.y -= _this.velY;
    } else if (e.key === "s") {
      _this.y += _this.velY;
    }
  };
};

// Phương thức collisionDetect của EvilCircle
EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        count--;
        para.textContent = "Ball count: " + count;
      }
    }
  }
};

// define array to store balls and populate it --- đã sửa

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  let ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    true,
    "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) +")",
    size
  );
  balls.push(ball);
  count++;
  para.textContent = "Ball count: " + count;
}

// loop
let evilcircle = new EvilCircle(random(0, width), random(0, height), true);
evilcircle.setControls();

function loop() {
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  evilcircle.draw();
  evilcircle.checkBounds();
  evilcircle.collisionDetect();
  requestAnimationFrame(loop);
}
loop();