(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseDirective = function () {
  _createClass(BaseDirective, [{
    key: 'expandoId',
    get: function get() {
      return this._expandoId;
    }
  }, {
    key: 'directiveAttribute',
    get: function get() {
      return this._directiveAttr;
    }
  }]);

  function BaseDirective(glueInstance, directiveName) {
    _classCallCheck(this, BaseDirective);

    if (!directiveName) {
      throw new Error("This directive doesn't have a name");
    }

    this._glue = glueInstance;
    this._config = glueInstance.config;
    this._scope = glueInstance.scope;
    this._expandoId = '__id-' + Date.now() + Math.floor(Math.random() * 1024) + Math.floor(Math.random() * 1024) + Math.floor(Math.random() * 1024);
    this._directiveAttr = this._config.namespace + '-' + directiveName;
  }

  _createClass(BaseDirective, [{
    key: 'init',
    value: function init(glueInstance) {
      var _this = this;

      this._glue.subscribe(function (newVal) {
        return _this.update(newVal);
      });
    }
  }, {
    key: 'update',
    value: function update() {
      throw new Error("Unimplemented!");
    }
  }]);

  return BaseDirective;
}();

exports.default = BaseDirective;


BaseDirective.directive = "BaseDirective";

BaseDirective.getInstance = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new BaseDirective(config);
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _makeGetter = require('../../util/makeGetter');

var _makeGetter2 = _interopRequireDefault(_makeGetter);

var _makeSetter = require('../../util/makeSetter');

var _makeSetter2 = _interopRequireDefault(_makeSetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EachDirective = function (_BaseDirective) {
  _inherits(EachDirective, _BaseDirective);

  function EachDirective(glueInstance) {
    _classCallCheck(this, EachDirective);

    return _possibleConstructorReturn(this, (EachDirective.__proto__ || Object.getPrototypeOf(EachDirective)).call(this, glueInstance, 'each'));
  }

  _createClass(EachDirective, [{
    key: 'update',
    value: function update(newVal) {
      var _this2 = this;

      var bindings = [].slice.call(document.querySelectorAll('[' + this.directiveAttribute + ']')).forEach(function (n) {
        var expression = n.getAttribute(_this2.directiveAttribute),
            result = (0, _makeGetter2.default)(expression)(_this2._glue.scope),
            frag = document.createDocumentFragment(),
            expanded = result.forEach(function ($item, $pos, $all) {
          aggregateMarkup.call(_this2, frag, n, $item, $pos, $all);
        });
        n.parentNode.replaceChild(frag, n);
      });
    }
  }]);

  return EachDirective;
}(_base2.default);

exports.default = EachDirective;


EachDirective.directive = "EachDirective";
EachDirective.getInstance = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new EachDirective(config);
};

function aggregateMarkup(docFragment, node, $item, $pos, $all) {
  var child = firstChildElement(node).cloneNode();
  child[this.expandoId] = { $item: $item, $pos: $pos, $all: $all };
  docFragment.appendChild(child);
}

function valueWatcher(node, callback) {
  if (!node) return;
  var old = String(node.value),
      checker = function checker() {
    if (!node) return;
    if (old != String(node.value)) {
      callback(node.value);
      old = String(node.value);
    }
    node[randomExpandoId].raf = requestAnimationFrame(checker);
  };
  node[randomExpandoId].raf = requestAnimationFrame(checker);
}

function appendChildren(parent, children) {
  children.forEach(function (n) {
    return parent.appendChild(n);
  });
}

function firstChildElement(n) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = n.childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var k = _step.value;

      if (k instanceof HTMLElement) return k;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return null;
}

},{"../../util/makeGetter":12,"../../util/makeSetter":13,"./base":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _makeGetter = require('../../util/makeGetter');

var _makeGetter2 = _interopRequireDefault(_makeGetter);

var _extend = require('../../util/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventsDirective = function (_BaseDirective) {
  _inherits(EventsDirective, _BaseDirective);

  function EventsDirective(glueInstance) {
    _classCallCheck(this, EventsDirective);

    return _possibleConstructorReturn(this, (EventsDirective.__proto__ || Object.getPrototypeOf(EventsDirective)).call(this, glueInstance, 'on'));
  }

  _createClass(EventsDirective, [{
    key: 'init',
    value: function init(glueInstance) {
      var _this2 = this;

      _get(EventsDirective.prototype.__proto__ || Object.getPrototypeOf(EventsDirective.prototype), 'init', this).call(this, glueInstance);
      this._raf = requestAnimationFrame(function () {
        return bindToHandlers.call(_this2);
      });
    }
  }, {
    key: 'update',
    value: function update(newVal) {
      return this;
    }
  }]);

  return EventsDirective;
}(_base2.default);

exports.default = EventsDirective;


EventsDirective.directive = "EventsDirective";
EventsDirective.getInstance = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new EventsDirective(config);
};

function bindToHandlers() {
  var _this3 = this;

  [].slice.call(document.querySelectorAll('[' + this.directiveAttribute + ']')).filter(function (n) {
    return !n[_this3.expandoId];
  }).map(function (n) {
    var attributePairs = parseAttribute.call(_this3, n.getAttribute(_this3.directiveAttribute));
    return n[_this3.expandoId] = attributePairs.map(function (p) {
      return {
        evt: p[0],
        handler: (0, _makeGetter2.default)(p[1])(_this3._glue.scope),
        node: n
      };
    });
  }).forEach(function (bundle) {
    bundle.forEach(function (b) {
      return b.node.addEventListener(b.evt, function (evt) {
        b.handler.call(_this3._glue.scope, evt);
        _this3._glue.notifyChanged();
      });
    });
  });
  this._raf = requestAnimationFrame(function () {
    return bindToHandlers.call(_this3);
  });
}

function parseAttribute(attr) {
  return attr.split(';').map(function (a) {
    return a.split(/:[\s]?/g);
  }).map(function (s) {
    return s.map(function (f) {
      return String(f).trim();
    });
  });
}

},{"../../util/extend":9,"../../util/makeGetter":12,"./base":1}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _text = require('./text');

var _text2 = _interopRequireDefault(_text);

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

var _each = require('./each');

var _each2 = _interopRequireDefault(_each);

var _events = require('./events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_each2.default, _text2.default, _value2.default, _events2.default];

},{"./each":2,"./events":3,"./text":5,"./value":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _makeGetter = require('../../util/makeGetter');

var _makeGetter2 = _interopRequireDefault(_makeGetter);

var _extend = require('../../util/extend');

var _extend2 = _interopRequireDefault(_extend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextDirective = function (_BaseDirective) {
  _inherits(TextDirective, _BaseDirective);

  function TextDirective(glueInstance) {
    _classCallCheck(this, TextDirective);

    return _possibleConstructorReturn(this, (TextDirective.__proto__ || Object.getPrototypeOf(TextDirective)).call(this, glueInstance, 'text'));
  }

  _createClass(TextDirective, [{
    key: 'update',
    value: function update(newVal) {
      var _this2 = this;

      [].slice.call(document.querySelectorAll('[' + this.directiveAttribute + ']')).forEach(function (n) {
        n[_this2.expandoId] = n[_this2.expandoId] || { onEachBlock: null, prevVal: null };
        var expressionValue = (0, _makeGetter2.default)(n.getAttribute(_this2.directiveAttribute));
        if (!isOnEachBlock.call(_this2, n)) {
          return setTextNormally.call(_this2, expressionValue, n);
        }
        return setTextInScope.call(_this2, expressionValue, n);
      });
    }
  }]);

  return TextDirective;
}(_base2.default);

exports.default = TextDirective;


TextDirective.directive = "TextDirective";
TextDirective.getInstance = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new TextDirective(config);
};

function setTextNormally(getter, node) {
  var val = getter(this._glue.scope);
  if (val != node[this.expandoId].prevVal) {
    node[this.expandoId].prevVal = val;
    node.innerHTML = val;
  }
}

function setTextInScope(getter, node) {
  var val = getter(node[this._glue.EachDirective.expandoId]);
  if (val != node[this.expandoId].prevVal) {
    node[this.expandoId].prevVal = val;
    node.innerHTML = val;
  }
}

function isOnEachBlock(node) {
  return node[this._glue.EachDirective.expandoId];
}

},{"../../util/extend":9,"../../util/makeGetter":12,"./base":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

var _makeGetter = require('../../util/makeGetter');

var _makeGetter2 = _interopRequireDefault(_makeGetter);

var _makeSetter = require('../../util/makeSetter');

var _makeSetter2 = _interopRequireDefault(_makeSetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValueDirective = function (_BaseDirective) {
  _inherits(ValueDirective, _BaseDirective);

  function ValueDirective(glueInstance) {
    _classCallCheck(this, ValueDirective);

    return _possibleConstructorReturn(this, (ValueDirective.__proto__ || Object.getPrototypeOf(ValueDirective)).call(this, glueInstance, 'value'));
  }

  _createClass(ValueDirective, [{
    key: 'update',
    value: function update(newVal) {
      var _this2 = this;

      var onEachTelltale = this._glue.EachDirective.directiveAttribute,
          bindings = [].slice.call(document.querySelectorAll('[' + this.directiveAttribute + ']')).forEach(function (n) {
        return syncValue.call(_this2, n);
      });
    }
  }]);

  return ValueDirective;
}(_base2.default);

exports.default = ValueDirective;


ValueDirective.directive = "ValueDirective";
ValueDirective.getInstance = function () {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return new ValueDirective(config);
};

function syncValue(node) {
  var _this3 = this;

  var expression = node.getAttribute(this.directiveAttribute),
      result = (0, _makeGetter2.default)(expression)(this._glue.scope);
  node[this.expandoId] = node[this.expandoId] || { raf: -1, onEach: false };
  node.value != result && (node.value = result);

  if (node[this.expandoId].raf < 0) {
    var updateValue = function updateValue(val) {
      return (0, _makeSetter2.default)(expression)(_this3._glue.scope, ['number', 'range'].indexOf(node.type) > -1 ? parseInt(node.value, 10) : node.value, function () {
        return _this3._glue.notifyChanged();
      });
    };
    valueWatcher(this.expandoId, node, updateValue);
  }
}

function valueWatcher(expandoId, node, callback) {
  if (!node) return;
  var old = String(node.value),
      checker = function checker() {
    if (!node) return;
    if (old != String(node.value)) {
      callback(node.value);
      old = String(node.value);
    }
    node[expandoId].raf = requestAnimationFrame(checker);
  };
  node[expandoId].raf = requestAnimationFrame(checker);
}

},{"../../util/makeGetter":12,"../../util/makeSetter":13,"./base":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  namespace: 'g',
  subscribers: []
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _polyfill = require('./util/polyfill');

var polyfill = _interopRequireWildcard(_polyfill);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _extend = require('./util/extend');

var _extend2 = _interopRequireDefault(_extend);

var _is = require('./util/is');

var _is2 = _interopRequireDefault(_is);

var _hash = require('./util/hash');

var _hash2 = _interopRequireDefault(_hash);

var _directives = require('./built-in/directives');

var _directives2 = _interopRequireDefault(_directives);

var _makeGetter = require('./util/makeGetter');

var _makeGetter2 = _interopRequireDefault(_makeGetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TwoWays = function () {
  _createClass(TwoWays, [{
    key: 'defaults',
    get: function get() {
      return _defaults2.default;
    }
  }, {
    key: 'scope',
    get: function get() {
      return this._scope;
    }
  }, {
    key: 'config',
    get: function get() {
      return (0, _extend2.default)(true, {}, this._config);
    }
  }]);

  function TwoWays(scope) {
    var _this = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, TwoWays);

    if (!(0, _is2.default)(config).pojo()) throw new Error("Config musts be a plain JS object");

    this._scope = {};
    this._config = (0, _extend2.default)(this.defaults, config || {});
    this._lastSum = (0, _hash2.default)(this._scope);
    _directives2.default.forEach(function (builtin) {
      return registerBuiltin.call(_this, builtin);
    });
    this._watchHandle = requestAnimationFrame(function () {
      return _this.watchForChanges();
    });
    this._scope = scope;
  }

  _createClass(TwoWays, [{
    key: 'watchForChanges',
    value: function watchForChanges() {
      var _this2 = this;

      var currentHash = (0, _hash2.default)(this._scope);
      if (currentHash !== this._lastSum) {
        this.notifyChanged();
      }

      this._lastSum = currentHash;
      this._watchHandle = requestAnimationFrame(function () {
        return _this2.watchForChanges();
      });
    }
  }, {
    key: 'notifyChanged',
    value: function notifyChanged() {
      var _this3 = this;

      var currentHash = (0, _hash2.default)(this._scope);
      if (currentHash !== this._lastSum) {
        this._config.subscribers.forEach(function (fn) {
          return fn(_this3._scope);
        });
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(fn) {
      var prop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var listener = fn;
      if (prop) {
        listener = function listener(scope) {
          return fn((0, _makeGetter2.default)(prop)(scope));
        };
      }
      this._config.subscribers.push(listener);
    }
  }]);

  return TwoWays;
}();

exports.default = TwoWays;


function registerBuiltin(builtin) {
  if (!this[builtin.directive]) {
    this[builtin.directive] = builtin.getInstance(this);
    this[builtin.directive].init(this);
  }
}

},{"./built-in/directives":4,"./defaults":7,"./util/extend":9,"./util/hash":10,"./util/is":11,"./util/makeGetter":12,"./util/polyfill":14}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = extend;
function extend() {

  function isFunction(fn) {
    return typeof fn === "function" && fn.constructor === Function;
  }
  function isArray(ar) {
    return ar instanceof Array;
  }
  function isPlainObject(obj) {
    return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) == 'object' && obj.constructor == Object;
  }

  var options,
      name,
      src,
      copy,
      copyIsArray,
      clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  if ((typeof target === "undefined" ? "undefined" : _typeof(target)) !== "object" && !isFunction(target)) target = {};
  if (i === length) {
    target = this;
    i--;
  }
  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) continue;

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (!copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          } else clone = src && isPlainObject(src) ? src : {};

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) target[name] = copy;
      }
    }
  }

  return target;
};

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hash;
function hash(o) {
  var str = JSON.stringify(o, function (k, v) {
    if (!!k && v === o) return null;
    if (v instanceof RegExp) return v.toString();
    if (v instanceof Function) return v.toString();
    return v;
  });

  var hash = 5381,
      index = str.length;

  while (index) {
    hash = hash * 33 ^ str.charCodeAt(--index);
  }

  return (hash >>> 0).toString(32);

  return hash;
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj) {
  var undef = function undef() {
    return typeof obj == 'undefined';
  };
  var pojo = function pojo() {
    return !undef() && obj.constructor === Object;
  };
  var array = function array() {
    return !undef() && obj instanceof Array;
  };

  return {
    undef: undef, pojo: pojo, array: array
  };
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeGetter;
function makeGetter(expr) {
  if (expr.indexOf('$') > -1) {
    //special case the fuck out of this
    expr = expr.replace(/\$/g, 'scope.\$');
  } else {
    expr = 'scope.' + expr;
  }
  return new Function('scope', 'return ' + expr);
}

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeSetter;
function makeSetter(expr) {
  return new Function('ctx', 'newVal', 'done', '\n    ctx.' + expr + ' = newVal;\n    done();\n   ');
}

},{}],14:[function(require,module,exports){
'use strict';

if (![].map) {
  Array.prototype.map = function (fn) {
    var buffer = [];
    for (var i = 0, j = this.length; i < j; i++) {
      buffer[i] = fn(this[i], i, this);
    }
    return buffer;
  };
}

if (![].forEach) {
  Array.prototype.forEach = function (fn) {
    this.map(fn);
  };
}

if (![].filter) {
  Array.prototype.filter = function (fn) {
    var buffer = [];
    this.forEach(function (el, pos, all) {
      if (fn(el, pos, all)) {
        buffer.push(el);
      }
    });
    return buffer;
  };
}

if (!Object.keys) {
  Object.keys = function (obj) {
    var buffer = [];
    for (var k in obj) {
      buffer.push(k);
    }
    return buffer;
  };
}
if (!Object.getOwnPropertyNames) {
  Object.getOwnPropertyNames = function () {
    Object.keys = function (obj) {
      var buffer = [];
      for (var k in obj) {
        buffer.push(k);
      }
      return buffer;
    };
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}

},{}],15:[function(require,module,exports){
(function (global){
'use strict';

var _TwoWays = require('./TwoWays');

var _TwoWays2 = _interopRequireDefault(_TwoWays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = global['TwoWays'] = _TwoWays2.default;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./TwoWays":8}]},{},[15]);
