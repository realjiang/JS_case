// ----------------------食物对象------------------------
;(function (window) {
  var position = 'absolute';
  var elements = [];
  var document = window.document;
  function Food(x, y, width, height, color) {
    this.x = x || 0;
    this.y = y || 0;
    // 食物的宽度和高度(像素)
    this.width = width || 20;
    this.height = height || 20;
    // 食物的颜色
    this.color = color || 'green';
  }

  Food.prototype.render = function (map) {
    remove();
    // 随机食物的位置，map.宽度/food.宽度，总共有多少分food的宽度，随机一下。然后再乘以food的宽度
    this.x = parseInt(Math.random() * map.offsetWidth / this.width) * this.width;
    this.y = parseInt(Math.random() * map.offsetHeight / this.height) * this.height;

    // 动态创建食物对应的div
    var div = document.createElement('div');
    map.appendChild(div);
    div.style.position = position;
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    div.style.width = this.width + 'px';
    div.style.height = this.height + 'px';
    div.style.backgroundColor = this.color;
    elements.push(div);
  }

  function remove() {
    for(var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.parentNode.removeChild(element);
      elements.splice(i, 1);
    }
  }

  window.Food = Food;
}(window, undefined))

// ----------------------蛇对象------------------------

;(function (window, undefined) {
  var document = window.document;
  var position = 'absolute';
  var elements = [];
  function Snake(width, height, direction) {
    // 设置每一个蛇节的宽度
    this.width = width || 20;
    this.height = height || 20;
    // 蛇的每一部分, 第一部分是蛇头
    this.body = [
      {x: 3, y: 2, color: 'red'},
      {x: 2, y: 2, color: 'blue'},
      {x: 1, y: 2, color: 'blue'}
    ];
    this.direction = direction || 'right';
  }

  Snake.prototype.render = function(map) {
    remove();
    
    for(var i = 0; i < this.body.length; i++) {
      var obj = this.body[i];
      var div = document.createElement('div');
      map.appendChild(div);
      div.style.left = obj.x * this.width + 'px';
      div.style.top = obj.y * this.height + 'px';
      div.style.position = position;
      div.style.backgroundColor = obj.color;
      div.style.width = this.width + 'px';
      div.style.height = this.height + 'px';
      elements.push(div);
    }
  }

  Snake.prototype.move = function (food, map) {
    // 让蛇身体的每一部分往前移动一下
    var i = this.body.length - 1;
    for(; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    // 根据移动的方向，决定蛇头如何处理
    
    switch(this.direction) {
      case 'left': 
        this.body[0].x -= 1;
        break;
      case 'right':
        this.body[0].x += 1;
        break;
      case 'top':
        this.body[0].y -= 1;
        break;
      case 'bottom':
        this.body[0].y += 1;
        break;
    }

    // 在移动的过程中判断蛇是否吃到食物
    // 如果蛇头和食物的位置重合代表吃到食物
    // 食物的坐标是像素，蛇的坐标是几个宽度，进行转换
    var headX = this.body[0].x * this.width;
    var headY = this.body[0].y * this.height;
    if (headX === food.x && headY === food.y) {
      // 吃到食物，往蛇节的最后加一节
      var last = this.body[this.body.length - 1];
      this.body.push({
        x: last.x,
        y: last.y,
        color: last.color
      })
      // 把现在的食物对象删除，并重新随机渲染一个食物对象
      food.render(map);
    }
  }

  function remove() {
    // 删除渲染的蛇
    var i = elements.length - 1;
    for(; i >= 0; i--) {
      // 删除页面上渲染的蛇
      elements[i].parentNode.removeChild(elements[i]);
      // 删除elements数组中的元素
      elements.splice(i, 1);
    }
  }

  window.Snake = Snake;
}(window, undefined))


// ----------------------游戏对象------------------------


;(function(window, undefined) {
  var document = window.document;
  var that = null;
  function Game(map) {
    this.food = new Food();
    this.snake = new Snake();
    this.map = map;
    that = this;
  }

  Game.prototype.start = function () {
    this.food.render(this.map);
    this.snake.render(this.map);
    // 私有方法
    runSnake(this.snake, this.map);
    // 键盘控制蛇的移动
    bindKey();
  }

  function runSnake() {
    var timerId = setInterval(function() {
      this.snake.move(this.food, this.map);
      // 在渲染前，删除之前的蛇
      this.snake.render(this.map);

      // 判断蛇是否撞墙
      var maxX = this.map.offsetWidth / this.snake.width;
      var maxY = this.map.offsetHeight / this.snake.height;
      var headX = this.snake.body[0].x;
      var headY = this.snake.body[0].y;
      if (headX < 0 || headX >= maxX) {
        clearInterval(timerId);
        alert('Game Over');
      }

      if (headY < 0 || headY >= maxY) {
        clearInterval(timerId);
        alert('Game Over');
      }

    }.bind(that), 150);
  }

  function bindKey() {
    document.addEventListener('keydown', function(e) {
      switch (e.keyCode) {
        case 37:
          // left
          this.snake.direction = 'left';
          break;
        case 38:
          // top
          this.snake.direction = 'top';
          break;
        case 39:
          // right
          this.snake.direction = 'right';
          break;
        case 40:
          // bottom
          this.snake.direction = 'bottom';
          break;
      }
    }.bind(that), false);
  }

  window.Game = Game;
}(window, undefined));



// ----------------------启动游戏------------------------


;(function (window, undefined) {
  var document = window.document;
  var map = document.getElementById('map');
  var game = new Game(map);
  game.start();
} (window, undefined))
