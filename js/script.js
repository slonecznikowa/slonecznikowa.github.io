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
    const width = parseFloat(document.body.clientWidth); // ширина экрана
    
    var _config = {
      widthPercent: 38, // процент от ширины экрана, который занимает один слайд
      visibleSlides: 2 // количество видимых слайдов
    };
    
    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    // наполнение массива _items
    _sliderItems.forEach(function (item, index) {
      _items.push({item: item, position: index, transform: 0});
    });

    var position = {
      getMin: 0,
      getMax: _items.length - 1,
    }

    var _transformItem = function (direction) {
      if (direction === 'right') {
        if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) >= position.getMax) {
          return;
        }
        if (!_sliderControlLeft.classList.contains('slider__control_show')) {
          _sliderControlLeft.classList.add('slider__control_show');
        }
        if (_sliderControlRight.classList.contains('slider__control_show') && (_positionLeftItem + _wrapperWidth / _itemWidth) >= position.getMax) {
          _sliderControlRight.classList.remove('slider__control_show');
        }
        _positionLeftItem++;

        // это костыль, чтобы последний элемент оставался скраю справа, не оставляя пустое место
        if (_positionLeftItem == position.getMax - (_config.visibleSlides - 1)) {
          var lastStep = (_itemWidth / _wrapperWidth * 100) * ( Math.abs(100 - _config.widthPercent * (_config.visibleSlides + 1)) / _config.widthPercent );          
          _transform -= lastStep;
        }
        else {  
          _transform -= _step;
        }
      }
      if (direction === 'left') {
        if (_positionLeftItem <= position.getMin) {
          return;
        }
        if (!_sliderControlRight.classList.contains('slider__control_show')) {
          _sliderControlRight.classList.add('slider__control_show');
        }
        if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
          _sliderControlLeft.classList.remove('slider__control_show');
        }
        _positionLeftItem--;
        
        // симметричный ответ для костыля, чтобы все не поехало при листании в обратном порядке
        if (_positionLeftItem == position.getMax - _config.visibleSlides) {
          var lastStep = (_itemWidth / _wrapperWidth * 100) * ( Math.abs(100 - _config.widthPercent * (_config.visibleSlides + 1)) / _config.widthPercent );          
          _transform += lastStep;
        } else {
          _transform += _step;
        }
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


var sliderSVC = multiItemSlider('.services__slider', {
  widthPercent: 38,
  visibleSlides: 2
})

var sliderADV = multiItemSlider('.advantages__slider', {
  widthPercent: 63,
  visibleSlides: 1
})

var sliderCS = multiItemSlider('.cases__slider', {
  widthPercent: 76,
  visibleSlides: 1
})

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
        var circleColor = 'rgba(20, 56, 110,';
      } else if ((colorRadomizer > 40) && (colorRadomizer <= 80)) {
        var circleColor = 'rgba(17, 47, 92,';
      } else {
        var circleColor = 'rgba(61, 97, 151,';
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

//animatedBackground();
