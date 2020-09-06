'use strict';

/* Мобильное меню */
var navMain = document.querySelector(".main-nav");
var navToggle = document.querySelector(".main-nav__toggle");

navMain.classList.remove("main-nav--nojs");

navToggle.addEventListener("click", function () {
  if (navMain.classList.contains("main-nav--closed")) {
    navMain.classList.remove("main-nav--closed");
    navMain.classList.add("main-nav--opened");
  } else {
    navMain.classList.add("main-nav--closed");
    navMain.classList.remove("main-nav--opened");
  }
});

var multiItemSlider = (function () {
  return function (selector, config) {
    var
      _mainElement = document.querySelector(selector), // основный элемент блока
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
      _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
      _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
      _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
      _positionLeftItem = 0, // позиция левого активного элемента
      _transform = 0, // значение транфсофрмации .slider_wrapper
      _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
      _items = []; // массив элементов

    var _startX = 0;

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({item: item, position: index, transform: 0});
    });

    var position = {
      getItemMin: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getItemMax: function () {
        var indexItem = 0;
        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });
        return indexItem;
      },
      getMin: function () {
        return _items[position.getItemMin()].position;
      },
      getMax: function () {
        return _items[position.getItemMax()].position;
      }
    }

    var _transformItem = function (direction) {
      var nextItem;
      if (direction === 'right') {
        _positionLeftItem++;
        if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform -= _step;
      }
      if (direction === 'left') {
        _positionLeftItem--;
        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }
        _transform += _step;
      }
      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    }

    // обработчик события click для кнопок "назад" и "вперед"
    var _controlClick = function (e) {
      if (e.target.classList.contains('slider__control')) {
        e.preventDefault();
        var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
        _transformItem(direction);
      }
    };

    var _setUpListeners = function () {
      // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
      _sliderControls.forEach(function (item) {
        item.addEventListener('click', _controlClick);
      });
      // добавление прокрутки прикосновением на мобильных устройствах
      const width = parseFloat(document.body.clientWidth);
      if(width < 768) {
        _mainElement.addEventListener('touchstart', function (e) {
          _startX = e.changedTouches[0].clientX;
        });
        _mainElement.addEventListener('touchend', function (e) {
          var
            _endX = e.changedTouches[0].clientX,
            _deltaX = _endX - _startX;
          if (_deltaX > 50) {
            _transformItem('left');
          } else if (_deltaX < -50) {
            _transformItem('right');
          }
        });
      }
    }

    // инициализация
    _setUpListeners();

    return {
      right: function () { // метод right
        _transformItem('right');
      },
      left: function () { // метод left
        _transformItem('left');
      }
    }

  }
}());


var sliderSVC = multiItemSlider('.services__slider')

var sliderADV = multiItemSlider('.advantages__slider')

var sliderCS = multiItemSlider('.cases__slider')

/*
Анимированный бэкграунд
Источник: https://codepen.io/DigitalWheelie/pen/Llkfb
*/
var animatedBackground = (function () {
  var mainCanvas = document.getElementById('bg');
  var mainContext = mainCanvas.getContext('2d');
  var theWidth = window.innerWidth;
  var theHeight = window.innerHeight;
  mainCanvas.width = theWidth;
  mainCanvas.height = theHeight;

  var howManyCircles = 40;

  var circles = new Array();

  var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  function Circle(radius, speed, size, xPos, yPos, opacity, circleColor) {
    this.radius = radius;
    this.speed = speed;
    this.size = size;
    this.xPos = xPos;
    this.yPos = yPos;
    this.opacity = opacity;
    this.circleColor = circleColor;

    this.counter = 0;

    var signHelper = Math.floor(Math.random() * 2);

    if (signHelper == 1) {
      this.sign = -1;
    } else {
      this.sign = 1;
    }
  }

  Circle.prototype.update = function () {
    this.counter += this.sign * this.speed / 20;

    mainContext.beginPath();
    mainContext.arc(this.xPos + Math.cos(this.counter / 100) * this.radius,
      this.yPos + Math.sin(this.counter / 100) * this.radius,
      this.size,
      0,
      Math.PI * 2,
      false);

    mainContext.closePath();
    mainContext.fillStyle = this.circleColor + this.opacity + ')'; //dark blue

    mainContext.fill();
  };

  // Register an event listener to
  // call the resizeCanvas() function each time
  // the window is resized.
  window.addEventListener('resize', resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();

  function setupCircles() {
    //console.log("setup");

    for (var i = 0; i < howManyCircles; i++) {
      var opacity = .25 + Math.random() * .40;
      var speed = 1 + Math.random() * 8;
      var size = (1.6 - opacity) * (130 + Math.random() * 200);
      var radius = 100 + Math.random() * 100;
      var randomX = Math.round(Math.random() * (theWidth + size)) - size / 2;
      var randomY = Math.round(Math.random() * (theHeight + size)) - size / 2;

      var colorRadomizer = (i / howManyCircles) * 100;

      if (colorRadomizer <= 40) {
        var circleColor = 'rgba(26, 99, 142,'; //blue
      } else if ((colorRadomizer > 40) && (colorRadomizer <= 80)) {
        var circleColor = 'rgba(0, 125, 105,'; //green
      } else {
        var circleColor = 'rgba(21, 216, 223,'; //aqua
        size /= 2;
        radius /= 2;
        opacity /= 2;
      }

      var circle = new Circle(radius, speed, size, randomX, randomY, opacity, circleColor);
      circles.push(circle);
    }
    drawAndUpdate();
  }

  function drawAndUpdate() {
    //console.log("draw & update " + theWidth + " " + theHeight);
    requestAnimationFrame(drawAndUpdate);

    mainContext.clearRect(0, 0, theWidth, theHeight);

    for (var i = 0; i < circles.length; i++) {

      var myCircle = circles[i];
      myCircle.update();
    }
  }

  // Runs each time the DOM window resize event fires.
  // Resets the canvas dimensions to match window,
  // then draws the new borders accordingly.
  function resizeCanvas() {
    //console.log("resized");

    theWidth = window.innerWidth;
    theHeight = window.innerHeight;
    mainCanvas.width = theWidth;
    mainCanvas.height = theHeight;

    setupCircles();
  }

});

animatedBackground();
