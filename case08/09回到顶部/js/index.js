// 获取元素
var bodyTop = my$('top');

// top 是window自带的一个属性，此属性是只读的。此属性默认是window对象

// 回到顶部的按钮
var totop = my$('totop');

// 当拖动滚动条的时候执行
window.onscroll = function () {
  //1 当拖动滚动条的时候，当内容滚动出去 10px的时候，改变top的高度，并且显示回到顶部按钮
  
  // 调用common.js getScroll函数，获取页面滚动出去的距离
  var scrollTop = getScroll().scrollTop;
  if (scrollTop > 10) {
    // 改变top
    bodyTop.className = 'header fixed';
    // 显示回到顶部
    totop.style.display = 'block';
  } else {
    // 改变top
    bodyTop.className = 'header';
    // 显示回到顶部
    totop.style.display = 'none';
  }


  // 如何获取滚动距离
  // document.body.scrollTop
  // documentElement  网页中的根元素 html
  // document.documentElement.scrollTop
}

//2 当点击回到顶部按钮的时候，动画的方式，回到最上面，让滚动距离为0
var timerId = null;
totop.onclick = function () {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  timerId = setInterval(function () {
    // 步进 每次移动的距离
    var step = 10;
    // 目标位置
    var target = 0;

    // 获取当前位置
    var current = getScroll().scrollTop;

    if (current > target) {
      step = -Math.abs(step);
    }

    // 判断当前是否到达目标位置
    if (Math.abs(current - target) <= Math.abs(step)) {
      clearInterval(timerId);
      document.body.scrollTop = target;
      document.documentElement.scrollTop = target;
      return;
    }

    current += step;
    document.body.scrollTop = current;
    document.documentElement.scrollTop = current;
  }, 5);
}
