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

/* Слайдер */

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


