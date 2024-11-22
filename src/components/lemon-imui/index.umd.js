(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "02f4":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var defined = __webpack_require__("be13");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "0390":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var at = __webpack_require__("02f4")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0bfb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__("cb7c");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "117e":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1c4c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__("9b43");
var $export = __webpack_require__("5ca1");
var toObject = __webpack_require__("4bf8");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var toLength = __webpack_require__("9def");
var createProperty = __webpack_require__("f1ae");
var getIterFn = __webpack_require__("27ee");

$export($export.S + $export.F * !__webpack_require__("5cc5")(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "20d6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("b0c5");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");
var regexpExec = __webpack_require__("520a");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "2638":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function _extends(){return _extends=Object.assign?Object.assign.bind():function(a){for(var b,c=1;c<arguments.length;c++)for(var d in b=arguments[c],b)Object.prototype.hasOwnProperty.call(b,d)&&(a[d]=b[d]);return a},_extends.apply(this,arguments)}var normalMerge=["attrs","props","domProps"],toArrayMerge=["class","style","directives"],functionalMerge=["on","nativeOn"],mergeJsxProps=function(a){return a.reduce(function(c,a){for(var b in a)if(!c[b])c[b]=a[b];else if(-1!==normalMerge.indexOf(b))c[b]=_extends({},c[b],a[b]);else if(-1!==toArrayMerge.indexOf(b)){var d=c[b]instanceof Array?c[b]:[c[b]],e=a[b]instanceof Array?a[b]:[a[b]];c[b]=[].concat(d,e)}else if(-1!==functionalMerge.indexOf(b)){for(var f in a[b])if(c[b][f]){var g=c[b][f]instanceof Array?c[b][f]:[c[b][f]],h=a[b][f]instanceof Array?a[b][f]:[a[b][f]];c[b][f]=[].concat(g,h)}else c[b][f]=a[b][f];}else if("hook"===b)for(var i in a[b])c[b][i]=c[b][i]?mergeFn(c[b][i],a[b][i]):a[b][i];else c[b]=a[b];return c},{})},mergeFn=function(a,b){return function(){a&&a.apply(this,arguments),b&&b.apply(this,arguments)}};module.exports=mergeJsxProps;


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var $toString = __webpack_require__("fa5b");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2f21":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__("79e5");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "323d":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "3846":
/***/ (function(module, exports, __webpack_require__) {

// 21.2.5.3 get RegExp.prototype.flags()
if (__webpack_require__("9e1e") && /./g.flags != 'g') __webpack_require__("86cc").f(RegExp.prototype, 'flags', {
  configurable: true,
  get: __webpack_require__("0bfb")
});


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "3b2b":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var inheritIfRequired = __webpack_require__("5dbc");
var dP = __webpack_require__("86cc").f;
var gOPN = __webpack_require__("9093").f;
var isRegExp = __webpack_require__("aae3");
var $flags = __webpack_require__("0bfb");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__("9e1e") && (!CORRECT_NEW || __webpack_require__("79e5")(function () {
  re2[__webpack_require__("2b4c")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__("2aba")(global, 'RegExp', $RegExp);
}

__webpack_require__("7a56")('RegExp');


/***/ }),

/***/ "3bcf":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "4c77":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_basic_vue_vue_type_style_index_0_id_728e23e7_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d6f8");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_basic_vue_vue_type_style_index_0_id_728e23e7_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_basic_vue_vue_type_style_index_0_id_728e23e7_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "504c":
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__("9e1e");
var getKeys = __webpack_require__("0d58");
var toIObject = __webpack_require__("6821");
var isEnum = __webpack_require__("52a7").f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || isEnum.call(O, key)) {
        result.push(isEntries ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "520a":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__("0bfb");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "55dd":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__("5ca1");
var aFunction = __webpack_require__("d8e8");
var toObject = __webpack_require__("4bf8");
var fails = __webpack_require__("79e5");
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__("2f21")($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ "5778":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_text_vue_vue_type_style_index_0_id_fc6d50a4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("80be");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_text_vue_vue_type_style_index_0_id_fc6d50a4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_text_vue_vue_type_style_index_0_id_fc6d50a4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5df3":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__("02f4")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__("01f9")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "5f1b":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__("23c6");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "61c8":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "69bb":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_tabs_vue_vue_type_style_index_0_id_5041e790_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ba05");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_tabs_vue_vue_type_style_index_0_id_5041e790_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_tabs_vue_vue_type_style_index_0_id_5041e790_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "6a2b":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "6b54":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

__webpack_require__("3846");
var anObject = __webpack_require__("cb7c");
var $flags = __webpack_require__("0bfb");
var DESCRIPTORS = __webpack_require__("9e1e");
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  __webpack_require__("2aba")(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (__webpack_require__("79e5")(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}


/***/ }),

/***/ "6fb5":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "718e":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_popover_vue_vue_type_style_index_0_id_ae0fc606_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("dfa9");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_popover_vue_vue_type_style_index_0_id_ae0fc606_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_popover_vue_vue_type_style_index_0_id_ae0fc606_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var DESCRIPTORS = __webpack_require__("9e1e");
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f7f":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc").f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__("9e1e") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "80be":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "83a1":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "85ff":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_id_29a0badd_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("cb50");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_id_29a0badd_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_file_vue_vue_type_style_index_0_id_29a0badd_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "8615":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__("5ca1");
var $values = __webpack_require__("504c")(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "8bcf":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "8e6e":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-getownpropertydescriptors
var $export = __webpack_require__("5ca1");
var ownKeys = __webpack_require__("990b");
var toIObject = __webpack_require__("6821");
var gOPD = __webpack_require__("11e9");
var createProperty = __webpack_require__("f1ae");

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIObject(object);
    var getDesc = gOPD.f;
    var keys = ownKeys(O);
    var result = {};
    var i = 0;
    var key, desc;
    while (keys.length > i) {
      desc = getDesc(O, key = keys[i++]);
      if (desc !== undefined) createProperty(result, key, desc);
    }
    return result;
  }
});


/***/ }),

/***/ "8fb6":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_contact_vue_vue_type_style_index_0_id_6d9458c0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("83a1");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_contact_vue_vue_type_style_index_0_id_6d9458c0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_contact_vue_vue_type_style_index_0_id_6d9458c0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9204":
/***/ (function(module, exports) {

var D=Object.defineProperty;var O=(g,t,e)=>t in g?D(g,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):g[t]=e;var u=(g,t,e)=>(O(g,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();class H{constructor(t){u(this,"richText");u(this,"vnode");u(this,"cursorIndex");u(this,"cursorLeft");u(this,"needCallSpace",!1);u(this,"VOID_KEY","\uFEFF");u(this,"ZERO_WIDTH_KEY","​");u(this,"pointEndIME");u(this,"IME_KEY","​_");this.richText=t,this.textInnerHtmlInit(),this.richText.focus()}textInnerHtmlInit(t=!1,e){if(t||this.getNodeEmpty(this.richText)){this.richText.innerHTML="";const s=this.getGridElm();this.richText.appendChild(s);const i=s.children[0].children[0];e&&(i.innerHTML=e,i.setAttribute("data-set-empty","false"));const r=i.childNodes[0];this.restCursorPos(r,r.textContent===this.VOID_KEY?1:r.textContent.length)}}onceCall(t,e=!1,s=""){return new Promise(i=>{const r=this.createAtUserSpan(t),n=this.replaceRegContent(r,!0,e,s)||"";i(n)})}searchCall(t,e){return new Promise(s=>{const i=this.createAtUserSpan(t);this.replaceRegContent(i,e),s()})}onceExternalCall(t){return new Promise(e=>{const s=this.createAtUserSpan(t),i=this.replaceRegContent(s,!1,!0)||"";e(i)})}upDataNodeOrIndex(){var n,o,a;const{focusNode:t,focusOffset:e,anchorOffset:s}=window.getSelection(),i=(t==null?void 0:t.parentNode)||void 0;!i||!i.getAttribute||i.getAttribute("data-set-richType")!=="richInput"||((a=(o=(n=t==null?void 0:t.parentNode)==null?void 0:n.parentNode)==null?void 0:o.parentNode)==null?void 0:a.parentNode)!==this.richText||(this.vnode=t,this.cursorIndex=e,this.cursorLeft=s<e?s:e)}showAt(){if(this.upDataNodeOrIndex(),!this.vnode||this.vnode.nodeType!==Node.TEXT_NODE)return!1;const t=this.vnode.textContent||"",e=/@([^@\s]*)$/,s=t.slice(0,this.cursorIndex),i=e.exec(s);return i&&i.length===2&&s[s.length-1]==="@"}getRangeRect(){let t=0,e=0;const s=window.getSelection().getRangeAt(0).getClientRects()[0];return s&&(t=s.x,e=s.y),{x:t,y:e}}createAtUserSpan(t){const e=document.createElement("span");return e.dataset.userId=String(t.id),e.className="at-user",e.contentEditable="false",e.textContent=`@${t.name}${this.needCallSpace?" ":""}`,this.createNewDom(e)}createNewDom(t){const e=document.createElement("span");return e.className="chat-tag",e.setAttribute("contenteditable","false"),e.setAttribute("data-set-richType","chatTag"),t.className+=" chat-stat",e.appendChild(t),e}restCursorPos(t,e){e==null?e=t.textContent===this.VOID_KEY?1:0:e>t.textContent.length&&(e=t.textContent.length);const s=new Range;s.setStart(t,e),s.setEnd(t,e);const i=window.getSelection();i&&(this.vnode=t,this.cursorIndex=e,this.cursorLeft=e,i.removeAllRanges(),i.addRange(s))}setCursorPos(t,e){const s=window.getSelection();if(s.rangeCount<=0)return;const i=s.getRangeAt(0);i.setStart(t,e),i.collapse(!0),this.vnode=t,this.cursorIndex=e,this.cursorLeft=e}replaceRegContent(t,e=!1,s=!1,i=""){const r=this.vnode.textContent;let n;typeof e=="boolean"?n=r.slice(0,e?this.cursorIndex-1:this.cursorIndex):n=r.slice(0,e-1),n.length===0?(this.vnode.parentElement.setAttribute("data-set-empty",!0),this.vnode.textContent=this.VOID_KEY):this.vnode.textContent=n;let o=i||r.slice(this.cursorIndex);const a=this.vnode.parentNode.parentNode,c=a.nextSibling;c?a.parentNode.insertBefore(t,c):a.parentNode.appendChild(t);const h=t.previousSibling.childNodes[0],d=h.childNodes[1];d&&h.removeChild(d);const f=this.getGridElm(!0),l=f.childNodes[0];!s&&o&&o!==this.VOID_KEY&&(l.setAttribute("data-set-empty","false"),l.innerHTML=o);const m=l.childNodes[1];return s&&m&&l.removeChild(m),t.nextSibling?(m&&l.removeChild(m),a.parentNode.insertBefore(f,t.nextSibling)):a.parentNode.appendChild(f),this.restCursorPos(l.childNodes[0]),o}switchRange(t){var n,o;const{focusNode:e,focusOffset:s}=window.getSelection();let i,r;if(e.nodeType===Node.TEXT_NODE){const a=e.textContent.length,c=e.parentNode.parentNode;switch(t){case"ArrowLeft":if(s>0&&e.textContent!==this.VOID_KEY){r=s-1,i=e;break}const p=(n=c==null?void 0:c.previousSibling)==null?void 0:n.previousSibling;if(p)i=p.childNodes[0].childNodes[0],r=i.textContent.length;else{const d=c.parentNode.previousSibling;d&&(i=d.lastChild.childNodes[0].childNodes[0],r=i.textContent.length)}break;case"ArrowRight":if(s<a&&e.textContent!==this.VOID_KEY){r=s+1,i=e;break}const h=(o=c==null?void 0:c.nextSibling)==null?void 0:o.nextSibling;if(h)i=h.childNodes[0].childNodes[0],r=i.textContent===this.VOID_KEY?1:0;else{const d=c.parentNode.nextSibling;d&&(i=d.childNodes[0].childNodes[0].childNodes[0],r=i.textContent===this.VOID_KEY?1:0)}break}}(r||r===0)&&this.restCursorPos(i,r)}getGridElm(t=!1){const e=document.createElement("span");if(e.setAttribute("data-set-richType","richMark"),e.innerHTML=`<span class="chat-grid-input chat-stat" data-set-richType="richInput" data-set-empty="true">${this.VOID_KEY}<br></span>`,t)return e;const s=document.createElement("p");return s.className="chat-grid-wrap",s.setAttribute("data-set-richType","richBox"),s.appendChild(e),s}updateGrid(){const t=window.getSelection(),e=t.focusNode,s=e.parentNode,i=s.getAttribute("data-set-richType");let r,n,o,a;switch(i){case"richAllBox":if(r=e.childNodes[t.focusOffset],!r||r.getAttribute("data-set-richType")==="chatTag"){const l=this.getGridElm(!0),m=l.children[0];r?(m.removeChild(m.childNodes[1]),e.insertBefore(l,r)):e.appendChild(l),this.restCursorPos(m.childNodes[0]);break}if(r.tagName==="BR"){const l=this.getGridElm(!0),m=l.children[0];e.insertBefore(l,r),e.removeChild(r),this.restCursorPos(m.childNodes[0],m.childNodes[0].textContent.length)}break;case"richMark":const c=s.parentNode,p=Array.prototype.indexOf.call(c.childNodes,s);if(p===-1)break;if(p===0){const l=t.focusNode;l.setAttribute("data-set-empty","true"),l.innerHTML=`${this.VOID_KEY}<br>`,r=l.childNodes[0],this.restCursorPos(r,r.textContent.length);break}let h=s.previousSibling,d;h.getAttribute("data-set-richType")==="chatTag"?(d=h.previousSibling,c.removeChild(h),c.removeChild(s)):(d=s.previousSibling,c.removeChild(s)),r=d.childNodes[0].childNodes[0],r.textContent===this.VOID_KEY&&r.parentNode.appendChild(document.createElement("br")),this.restCursorPos(r,r.textContent.length);break;case"richInput":if(a=s.parentNode,o=a.parentNode,this.getNodeEmpty(s)){s.setAttribute("data-set-empty","true"),o.childNodes[o.childNodes.length-1]===a&&(s.innerHTML=`${this.VOID_KEY}<br>`),r=s.childNodes[0],this.restCursorPos(r,r.textContent.length);break}if(String(s.getAttribute("data-set-empty"))==="true"){s.setAttribute("data-set-empty","false");const l=[],m=[];Array.prototype.forEach.call(s.childNodes,E=>{E.nodeType===Node.TEXT_NODE&&E.textContent.indexOf(this.VOID_KEY)!==-1?m.push(E):E.tagName==="BR"&&l.push(E)}),l.forEach(E=>{s.removeChild(E)}),m.forEach(E=>{const C=E.textContent.indexOf(this.VOID_KEY),b=new Range;b.setStart(E,E.textContent.indexOf(this.VOID_KEY)),b.setEnd(E,C+1),b.deleteContents()}),r=s.childNodes[0],this.restCursorPos(r,r.textContent.length)}if(n=s.parentNode.nextSibling,n&&n.nodeType===Node.TEXT_NODE){let l=n.textContent,m=this.getGridElm(!0);m.childNodes[0].textContent=l,m.childNodes[0].setAttribute("data-set-empty","false"),n.parentNode.insertBefore(m,n),n.parentNode.removeChild(n),n=m}n&&n.getAttribute("data-set-richType")==="richMark"&&this.markMerge(s.parentNode,n);break}}getNodeEmpty(t){const e=new RegExp(`^(${this.ZERO_WIDTH_KEY}|<br>|${this.VOID_KEY})+$`);return!t.innerHTML||e.test(t.innerHTML)}setWrap(){const t=window.getSelection();let{focusNode:e,focusOffset:s}=t;if(e.nodeType!==Node.TEXT_NODE){if(!e.getAttribute||e.getAttribute("data-set-richType")!=="richInput")return;e=e.childNodes[0]}const i=e.textContent.slice(s),r=e.parentNode.parentNode,n=r.parentNode,o=Array.prototype.indexOf.call(n.childNodes,r),a=Array.prototype.slice.call(n.childNodes,o+1),c=this.getGridElm();let p=c.children[0].children[0].childNodes[0],h=1;(i||a.length>0)&&p.parentNode.removeChild(p.parentNode.childNodes[1]),i&&i!==this.VOID_KEY&&(e.textContent=e.textContent.slice(0,s),p.textContent=(p.textContent+i).replace(new RegExp(this.VOID_KEY,"g"),()=>(h--,"")),p.parentElement.setAttribute("data-set-empty","false")),a.forEach(l=>{n.removeChild(l),c.appendChild(l)});const d=n.lastChild.childNodes[0],f=c.lastChild.childNodes[0];if(d.childNodes.length<=1){const l=d.childNodes[0];(!l.textContent||l.textContent===this.VOID_KEY)&&(d.innerHTML=`${this.VOID_KEY}<br>`,d.setAttribute("data-set-empty","true"))}if(f.parentElement.getAttribute("data-set-richType")!=="richMark")c.appendChild(this.getGridElm(!0));else if(f.childNodes.length<=1){const l=f.childNodes[0];(!l.textContent||l.textContent===this.VOID_KEY)&&(f.innerHTML=`${this.VOID_KEY}<br>`,f.setAttribute("data-set-empty","true"),p=c.children[0].children[0].childNodes[0])}n.nextSibling?this.richText.insertBefore(c,n.nextSibling):this.richText.appendChild(c),this.restCursorPos(p,p.textContent===this.VOID_KEY?1:h),this.viewIntoPoint()}selectRegionMerge(){const t=window.getSelection();if(t.isCollapsed||t.rangeCount<=0)return;const e=t.getRangeAt(0);if(e.startContainer.nodeType===Node.TEXT_NODE&&e.startContainer===e.endContainer){const s=e.startContainer;if(s.length===e.endOffset-e.startOffset){const i=s.parentNode,r=i.parentNode===i.parentNode.parentNode.lastChild;i.setAttribute("data-set-empty","true"),i.innerHTML=`\uFEFF${r?"<br>":""}`,this.restCursorPos(i.childNodes[0])}else e.deleteContents()}else if(e.commonAncestorContainer&&e.commonAncestorContainer.getAttribute("data-set-richType")==="richBox"){const s=e.startContainer.nodeType===Node.TEXT_NODE?e.startContainer.parentNode.parentNode:e.startContainer,i=e.endContainer.nodeType===Node.TEXT_NODE?e.endContainer.parentNode.parentNode:e.endContainer;e.deleteContents(),s.getAttribute("data-set-richType")===i.getAttribute("data-set-richType")&&this.markMerge(s,i)}else if(e.commonAncestorContainer===e.startContainer&&e.startContainer===e.endContainer)this.textInnerHtmlInit(!0);else{const s=n=>{if(n.nodeType===Node.TEXT_NODE)return n.parentNode.parentNode.parentNode;switch(n.getAttribute("data-set-richType")){case"richInput":return n.parentNode.parentNode;case"richMark":return n.parentNode;case"richBox":return n;default:return null}},i=s(e.startContainer),r=s(e.endContainer);if(!i||!r)return;e.deleteContents(),this.gridMerge(i,r)}return!0}gridElmMerge(){const t=window.getSelection(),{focusNode:e,focusOffset:s,isCollapsed:i}=t;if(s>1||!i)return!1;const r=(a,c)=>a.parentNode!==this.richText&&a!==a.parentNode.childNodes[0]?!1:Array.prototype.indexOf.call(this.richText.childNodes,a)!==-1?a:c>=6?!1:r(a.parentNode,c+1),n=r(e,0);if(!n||n===this.richText.childNodes[0]||s===1&&n.children[0].children[0].getAttribute("data-set-empty")==="false")return!1;const o=n.previousSibling;return this.gridMerge(o,n),!0}delMarkRule(){const t=window.getSelection(),e=t.focusNode,s=e.textContent,i=e.parentNode,r=i.parentNode,n=r.parentNode;if(!t.isCollapsed||i.getAttribute("data-set-richType")!=="richInput")return!1;if(s&&s.length===1&&r!==n.childNodes[0]&&(t.focusOffset!==0||s===this.VOID_KEY)){if(s===this.VOID_KEY){const o=r.previousSibling.previousSibling;n.removeChild(r.previousSibling),n.removeChild(r);const a=o.childNodes[0],c=a.childNodes[0];c.textContent===this.VOID_KEY&&o===n.lastChild&&a.appendChild(document.createElement("br")),this.restCursorPos(c,c.textContent.length)}else{i.innerHTML=r===n.lastChild?`${this.VOID_KEY}<br>`:this.VOID_KEY,i.setAttribute("data-set-empty","true");const o=i.childNodes[0];this.restCursorPos(o,1)}return!0}else if(t.focusOffset===0){const o=i.parentNode,a=o==null?void 0:o.previousSibling;return!a||a.getAttribute("data-set-richType")!=="chatTag"?!1:(this.delTag(a),!0)}}setIMESelection(){const t=window.getSelection(),e=t.focusNode,i=e.parentNode.parentNode;((i==null?void 0:i.getAttribute("data-set-richType"))||"")==="richMark"&&(this.pointEndIME=t.focusOffset,e.textContent=e.textContent.slice(0,this.pointEndIME)+this.IME_KEY+e.textContent.slice(this.pointEndIME),this.restCursorPos(e,this.pointEndIME+this.IME_KEY.length))}delMarkRuleIME(){const t=window.getSelection(),e=t.focusNode,s=e.parentNode,i=s.parentNode;if(((i==null?void 0:i.getAttribute("data-set-richType"))||"")==="richMark"){this.pointEndIME=t.focusOffset;const n=new RegExp(this.IME_KEY.slice(0,-1),"g");if(e.textContent=e.textContent.replace(n,""),this.pointEndIME>this.IME_KEY.length-1&&e.textContent!==this.VOID_KEY){const o=this.pointEndIME-(this.IME_KEY.length-1);e.textContent=e.textContent.slice(0,o-1)+e.textContent.slice(o),this.setCursorPos(e,o-1)}else{if(s.getAttribute("data-set-empty")==="false"&&(e.textContent===""||e.textContent===this.VOID_KEY)){s.innerHTML=i===i.parentElement.lastChild?`${this.VOID_KEY}<br>`:this.VOID_KEY,s.setAttribute("data-set-empty","true");const h=s.childNodes[0];this.setCursorPos(h,1);return}const a=i.previousSibling;if(a&&a.getAttribute&&a.getAttribute("data-set-richType")==="chatTag"){this.delTag(a);return}const c=i.parentElement,p=c.previousElementSibling;p&&this.gridMerge(p,c)}}}wrapIME(){const e=window.getSelection().focusNode;if(e.getAttribute&&e.getAttribute("data-set-richType")==="richBox"){const a=e.previousSibling.lastChild.children[0].childNodes[0];a.textContent=a.textContent.slice(0,-this.IME_KEY.length);const c=e.children[0];c.tagName==="BR"&&e.removeChild(c);return}const i=e.parentNode.parentNode,r=(i==null?void 0:i.getAttribute("data-set-richType"))||"";if(r==="richMark"){const a=i.parentElement.previousSibling.lastChild.children[0].childNodes[0];a.textContent=a.textContent.slice(0,-this.IME_KEY.length)}else if(r==="richBox"){const a=i.previousSibling.lastChild.children[0].childNodes[0];a.textContent=a.textContent.slice(0,-this.IME_KEY.length)}}resetIME(t){t===" "&&(t=" "),t||(t="");const e=window.getSelection(),s=e.focusNode,r=s.parentNode.parentNode;((r==null?void 0:r.getAttribute("data-set-richType"))||"")==="richMark"&&(s.textContent=s.textContent.slice(0,e.focusOffset-this.IME_KEY.length-t.length)+t+s.textContent.slice(e.focusOffset),s.textContent=s.textContent.replace(new RegExp(this.ZERO_WIDTH_KEY,"g"),""),this.setCursorPos(s,this.pointEndIME+t.length))}delTag(t){const e=t.previousSibling,s=t.nextSibling;t.parentNode.removeChild(t),this.markMerge(e,s)}gridMerge(t,e,s=!1){t.lastChild.getAttribute("data-set-richType")!=="richMark"&&t.appendChild(this.getGridElm(!0)),e.childNodes[0].getAttribute("data-set-richType")!=="richMark"&&e.insertBefore(this.getGridElm(!0),e.childNodes[0]);const i=t.lastChild.childNodes[0],r=i.childNodes[0];let n=r.textContent.length;Array.prototype.forEach.call(e.childNodes,a=>{t.appendChild(a.cloneNode(!0))}),e.childNodes.length>1&&i.childNodes[1]&&i.removeChild(i.childNodes[1]);const o=i.parentNode.nextSibling;if(o){const c=o.children[0].childNodes[0];c&&c.textContent!==this.VOID_KEY&&(i.childNodes[1]&&i.removeChild(i.childNodes[1]),r.textContent=(r.textContent+c.textContent).replace(new RegExp(this.VOID_KEY,"g"),()=>(n--,"")),r.parentElement.setAttribute("data-set-empty","false")),t.removeChild(o)}if(r.textContent===""&&(r.textContent=this.VOID_KEY,r.parentNode.setAttribute("data-set-empty","true"),n=1),s){const c=t.childNodes[t.childNodes.length-1].childNodes[0].childNodes[0];this.restCursorPos(c,c.textContent.length)}else this.richText.removeChild(e),this.restCursorPos(r,n);this.viewIntoPoint()}markMerge(t,e){const i=t.children[0].childNodes[0];let r=i.textContent.length;if(e){const a=e.children[0].childNodes[0];a&&a.textContent!==this.VOID_KEY&&(i.textContent=(i.textContent+a.textContent).replace(new RegExp(this.VOID_KEY,"g"),()=>(r--,"")),i.parentElement.setAttribute("data-set-empty","false")),e.parentNode.removeChild(e)}i.textContent===""&&(i.textContent=this.VOID_KEY,i.parentNode.setAttribute("data-set-empty","true"),r=1);const n=t.parentNode;i.textContent===this.VOID_KEY&&t===n.lastChild&&(i.parentNode.appendChild(document.createElement("br")),i.parentNode.setAttribute("data-set-empty","true"),r=1),this.restCursorPos(i,r)}setCallSpace(t){this.needCallSpace=t}getWrapNode(t){if(t.nodeType===Node.TEXT_NODE)return t.parentNode.parentNode.parentNode;switch(t.getAttribute("data-set-richType")){case"richInput":return t.parentNode.parentNode;case"richMark":return t.parentNode;case"richBox":return t}}getMarkNode(t){if(t.nodeType===Node.TEXT_NODE)return t.parentNode.parentNode;switch(t.getAttribute("data-set-richType")){case"richInput":return t.parentNode;case"richMark":return t}}getRichTextNodeIndex(t){const e=this.getMarkNode(t),s=e.parentNode;return{gridIndex:Array.prototype.indexOf.call(this.richText.childNodes,s),markIndex:Array.prototype.indexOf.call(s.childNodes,e)}}setWrapNodeByMark(t){const e=document.createElement("p");return e.className="chat-grid-wrap",e.setAttribute("data-set-richType","richBox"),Array.prototype.forEach.call(t,s=>{e.appendChild(s)}),e}setRangeLastText(){const t=this.richText.childNodes[this.richText.childNodes.length-1],i=t.childNodes[t.childNodes.length-1].children[0].childNodes[0];this.restCursorPos(i,i.textContent===this.VOID_KEY?1:i.textContent.length),this.viewIntoPoint()}viewIntoPoint(){const t=window.getSelection();if(t.rangeCount>0){const s=t.getRangeAt(0).getBoundingClientRect(),i=this.richText.parentElement;i.scrollTop=s.top+i.scrollTop-i.clientHeight/2}}}const v=(g=50)=>new Promise(t=>{setTimeout(t,g)}),M=(g,t,e,s)=>{const i=Object.assign(Object.assign({},{precision:"first",continuous:!1,space:"ignore",lastPrecision:"start",insensitive:!0}),s||{});return i.insensitive&&(g=g.toLowerCase(),e=e.toLowerCase()),i.space==="ignore"&&(e=e.replace(/\s/g,"")),P(g,t,e,i)||[]},P=(g,t,e,s)=>{let i=[];for(let r=0;r<g.length;r++){if(s.space==="ignore"&&g[r]===" "){i.push(r);continue}if(g[r]===e[0]){e=e.slice(1),i.push(r);continue}const n=t.split(" ");let o=0;if(n.forEach(a=>{const c=R(a,e);c>o&&(o=c)}),o&&(e=e.slice(o),i.push(r)),!e)break}if(e)return null;if(s.continuous){const r=i;if(i.some((o,a)=>a>0&&o!==r[a-1]+1))return null}return s.space==="ignore"&&(i=i.filter(r=>g[r]!==" ")),i.length?i:null},R=(g,t)=>{let e=0;for(let s=0;s<g.length;s++)g[s]===t[e]&&e++;return e};function _(){const g=navigator.userAgent,t=/(?:Windows Phone)/.test(g),e=/(?:SymbianOS)/.test(g)||t,s=/(?:Android)/.test(g),i=/(?:Firefox)/.test(g),r=/(?:iPad|PlayBook)/.test(g)||s&&!/(?:Mobile)/.test(g)||i&&/(?:Tablet)/.test(g),n=/(?:iPhone)/.test(g)&&!r;return{isTablet:r,isPhone:n,isAndroid:s,isPc:!n&&!s&&!e}}const K=function(g,t,e){return g.forEach(s=>{if(e in s){const i=t.indexOf(String(s[e]));i!==-1&&(t[i]=s)}}),t.filter(s=>s[e])},S=function(g){return Object.prototype.toString.call(g).slice(8,-1)},L=function(g,t){const e=S(g).toLowerCase();switch(S(t)){case"String":return e===t.toLowerCase();case"Array":return t.some(i=>e===i.toLowerCase());default:return!0}};class U{constructor({elm:t,userList:e,placeholder:s,copyType:i,uploadImage:r,needCallEvery:n,callEveryLabel:o,userProps:a,needCallSpace:c,wrapKeyFun:p,sendKeyFun:h,needDialog:d,maxLength:f}){u(this,"richText");u(this,"needCallEvery",!0);u(this,"callEveryLabel","所有人");u(this,"maxLength");u(this,"textLength",0);u(this,"needDialog",!0);u(this,"placeholderElm");u(this,"userProps",{id:"id",name:"name",avatar:"avatar",pinyin:"pinyin"});u(this,"chat");u(this,"targetUserList",[]);u(this,"userList",[]);u(this,"copyType",["text"]);u(this,"itemShowList",[]);u(this,"checkboxRows",[]);u(this,"base64Images",{});u(this,"uploadImage");u(this,"deviceInfo",_());u(this,"isComposition",!1);u(this,"undoHistory",[]);u(this,"redoHistory",[]);u(this,"doOverHistory",!0);u(this,"isExternalCallPopup",!1);u(this,"isIMEModel",!1);u(this,"chatEventModule",{enterSend:[],operate:[],defaultAction:[]});u(this,"wrapKeyFun",t=>t.ctrlKey&&["Enter"].includes(t.key));u(this,"sendKeyFun",t=>!t.ctrlKey&&["Enter"].includes(t.key));u(this,"startOpenIndex",0);u(this,"toolUserList");u(this,"dialogElm");u(this,"dialogCheckElm");u(this,"dialogMainElm");u(this,"checkboxElm");u(this,"searchResultElm");u(this,"checkGroupElm");u(this,"searchElm");u(this,"tagsElm");u(this,"dialogActiveItemElm");u(this,"searchEmptyLabel","没有匹配到任何结果");u(this,"checkAllLabel","全选");u(this,"dialogH5Elm");u(this,"dialogH5MainElm");u(this,"dialogH5CheckElm");u(this,"dialogH5ShowElm");u(this,"dialogH5SearchElm");u(this,"winClick",()=>{this.getElmBlock(this.dialogElm)&&this.exitDialog(),this.searchResultElm&&this.domElmShow(this.searchResultElm)});u(this,"winKeydown",async t=>{if(t.ctrlKey&&t.code==="KeyZ"&&t.preventDefault(),!(!this.getElmBlock(this.dialogElm)||this.itemShowList.length===0||this.isComposition)){if(t.code==="ArrowDown"){this.moveActiveItem("down");return}if(t.code==="ArrowUp"){this.moveActiveItem("up");return}if((t.code==="Enter"||t.code==="NumpadEnter")&&this.dialogActiveItemElm){t.preventDefault();const e=this.dialogActiveItemElm.getAttribute("data-set-id")||"";await v(100),this.toolUserList&&this.toolUserList.length>0?await this.matchSetTag(this.userList.find(s=>s.id===e)):await this.onceSetTag(e==="isALL"?{[this.userProps.id]:"isALL",[this.userProps.name]:this.callEveryLabel}:this.userList.find(s=>s.id===e)),this.exitDialog()}}});if(!(t instanceof HTMLElement))throw new Error("参数值elm：参数类型错误, 参数类型应为HTMLElement！");["absolute","relative","fixed"].includes(t.style.position)||(t.style.position="relative"),t.className+=` chat-area-${this.deviceInfo.isPc?"pc":"h5"}`,this.richText=document.createElement("div"),this.richText.setAttribute("class","chat-rich-text"),this.richText.setAttribute("data-set-richType","richAllBox"),this.richText.setAttribute("contenteditable","true"),t.appendChild(this.richText),this.placeholderElm=document.createElement("div"),this.placeholderElm.className="chat-placeholder-wrap",this.domElmShow(this.placeholderElm,!0),t.appendChild(this.placeholderElm),this.chat=new H(this.richText),o&&(this.callEveryLabel=o),d!==void 0&&(this.needDialog=String(d)!=="false"),this.needDialog&&(this.deviceInfo.isPc?this.hasPc():this.hasH5()),this.registerEvent(),this.updateConfig({userList:e,placeholder:s,maxLength:f,copyType:i,uploadImage:r,needCallEvery:n,needCallSpace:c,userProps:a,wrapKeyFun:p,sendKeyFun:h});const l={html:this.richText.innerHTML,gridIndex:0,markIndex:0,cursorIndex:this.chat.cursorIndex};this.undoHistory=[l]}registerEvent(){this.richText.addEventListener("keyup",t=>{if(!this.needDialog)return;if(t.stopPropagation(),this.deviceInfo.isPc){(t.keyCode===50||t.code==="Digit2"||t.key==="@")&&this.ruleCanShowPointDialog();return}const e=t.key==="Unidentified"?"android":"ios";let s=!1;switch(e){case"android":s=t.keyCode===229;break;case"ios":s=t.keyCode===50||t.code==="Digit2"||t.key==="@";break}s&&this.userList.length>0&&this.chat.showAt()&&(this.showH5Dialog(),this.isExternalCallPopup=!1)}),this.richText.addEventListener("keydown",async t=>{if(!this.deviceInfo.isPc&&t.key==="Unidentified"&&t.keyCode===229){t.preventDefault(),this.isIMEModel=!0,this.chat.setIMESelection();return}if(this.isIMEModel)return;if(this.getElmBlock(this.dialogElm)){["ArrowUp","ArrowDown","Enter","NumpadEnter"].includes(t.code)?t.preventDefault():["ArrowLeft","ArrowRight"].includes(t.code)&&this.exitDialog();return}t.code==="Backspace"||t.key==="Backspace"?(this.chat.selectRegionMerge()||this.chat.gridElmMerge()||this.chat.delMarkRule())&&(t.preventDefault(),await this.richTextInput()):this.wrapKeyFun(t)||!this.deviceInfo.isPc&&t.key==="Enter"?(t.preventDefault(),this.chat.setWrap(),await this.richTextInput()):this.sendKeyFun(t)?(t.preventDefault(),await v(100),this.enterSend()):["ArrowLeft","ArrowRight"].includes(t.code)?(t.preventDefault(),this.chat.switchRange(t.code)):t.ctrlKey&&t.code==="KeyA"?this.isEmpty()&&t.preventDefault():t.ctrlKey&&t.code==="KeyZ"?(t.preventDefault(),this.ruleChatEvent(this.undo,"defaultAction","UNDO")):t.ctrlKey&&t.code==="KeyY"&&(t.preventDefault(),this.ruleChatEvent(this.redo,"defaultAction","REDO")),["Backspace","Shift","Tab","CapsLock","Control","Meta","Alt","ContextMenu","Enter","NumpadEnter","Escape","ArrowLeft","ArrowUp","ArrowRight","ArrowDown","Home","End","PageUp","PageDown","Insert","Delete","NumLock"].indexOf(t.key)===-1&&!t.ctrlKey&&!t.altKey&&!t.metaKey&&this.chat.selectRegionMerge()}),this.richText.addEventListener("input",async t=>{if(this.isIMEModel){this.isIMEModel=!1,t.inputType==="deleteContentBackward"?(await v(50),this.chat.delMarkRuleIME()):t.inputType==="insertParagraph"?this.chat.wrapIME():this.chat.resetIME(t.data),this.chat.upDataNodeOrIndex(),this.chat.updateGrid(),this.maxLength!==void 0&&this.ruleMaxLength(),this.showPlaceholder(),this.triggerChatEvent("operate");return}if(await this.richTextInput(),this.getElmBlock(this.dialogElm)&&!this.isComposition){const e=this.chat.vnode.textContent,s=this.chat.cursorIndex,i=new RegExp(`^([${this.chat.ZERO_WIDTH_KEY}${this.chat.VOID_KEY}])+$`);if(!e||i.test(e)||s<this.startOpenIndex){this.exitDialog();return}const r=e.slice(this.startOpenIndex,s+1),n=String(r||"");if(/\s{2,}/ig.test(n)){this.exitDialog();return}if(!n){this.resizeUserTool(),this.showPCDialog();return}this.toolUserList||(this.toolUserList=this.userList);const o=this.searchUserList(n,this.toolUserList);o.length>0?(this.updateUserList(o,!0),this.showPCDialog()):this.exitDialog()}}),this.richText.addEventListener("copy",t=>{t.preventDefault(),this.ruleChatEvent(()=>{this.copyRange(t)},"defaultAction","COPY")}),this.richText.addEventListener("cut",t=>{t.preventDefault(),this.ruleChatEvent(()=>{this.copyRange(t),this.removeRange()},"defaultAction","CUT")}),this.richText.addEventListener("paste",t=>{t.preventDefault(),this.ruleChatEvent(()=>{const e=t.clipboardData.getData("text/plain");if(typeof e=="string"&&e!==""){if(this.copyType.indexOf("text")===-1)return;let s=document.createElement("div");s.innerHTML=t.clipboardData.getData("application/my-custom-format")||"",this.chat.selectRegionMerge(),s.children[0]&&s.children[0].getAttribute("data-set-richType")==="richBox"?this.insertInsideHtml(s.innerHTML):(s.innerHTML=e,this.insertText(s.innerText)),s=null}else{if(this.copyType.indexOf("image")===-1)return;const i=(t.clipboardData||t.originalEvent.clipboardData).items||[];Array.prototype.forEach.call(i,async r=>{if(r.type.indexOf("image")===-1)return;const n=r.getAsFile();if(this.uploadImage){const o=await this.uploadImage(n);this.insertHtml(`<img class="chat-img" src="${o}" alt="" />`)}else{const o=new FileReader;o.onload=a=>{this.insertHtml(`<img class="chat-img" src="${a.target.result}" alt="" />`)},o.readAsDataURL(n)}})}},"defaultAction","PASTE")}),this.richText.addEventListener("blur",t=>{this.chat.upDataNodeOrIndex()}),this.richText.addEventListener("focus",t=>{this.chat.upDataNodeOrIndex()}),this.richText.addEventListener("click",()=>{this.chat.upDataNodeOrIndex()}),this.richText.addEventListener("dragstart",t=>{t.stopPropagation(),t.preventDefault()}),this.richText.addEventListener("dragover",t=>{t.stopPropagation(),t.preventDefault()}),this.richText.addEventListener("drop",t=>{t.stopPropagation(),t.preventDefault()}),this.richText.addEventListener("compositionstart",()=>{this.isComposition=!0}),this.richText.addEventListener("compositionend",()=>{this.isComposition=!1})}async richTextInput(t=!0){this.chat.upDataNodeOrIndex(),this.deviceInfo.isPc&&this.chat.selectRegionMerge(),await v(50),this.isComposition||this.chat.updateGrid();const s=(this.richText.children[0]||{childNodes:[]}).childNodes[0];if(!s||!s.getAttribute||s.getAttribute("data-set-richType")!=="richMark"){this.chat.textInnerHtmlInit(!0),this.showPlaceholder(),this.triggerChatEvent("operate");return}if(this.maxLength!==void 0&&this.ruleMaxLength(),this.showPlaceholder(),this.triggerChatEvent("operate"),t&&!this.isComposition){const{gridIndex:i,markIndex:r}=this.chat.getRichTextNodeIndex(this.chat.vnode),n={html:this.richText.innerHTML,gridIndex:i,markIndex:r,cursorIndex:this.chat.cursorIndex};this.undoHistory.push(n),this.undoHistory.length>50&&this.undoHistory.shift()}}copyRange(t){const e=window.getSelection();if(e.isCollapsed||e.rangeCount<=0){t.clipboardData.setData("application/my-custom-format",""),t.clipboardData.setData("text/plain","");return}const s=e.toString()||"";let i=document.createElement("div");i.innerHTML=s;const r=i.innerText.replace(/\n\n/g,`
`);i=null,t.clipboardData.setData("text/plain",r);const n=e.anchorNode,o=e.focusNode;if(n===o&&n.nodeType===Node.TEXT_NODE){const l=n.textContent.slice(e.anchorOffset,e.focusOffset);t.clipboardData.setData("application/my-custom-format",l);return}if(n===this.richText&&o===this.richText){t.clipboardData.setData("application/my-custom-format",this.richText.innerHTML);return}const a=this.chat.getWrapNode(n),c=this.chat.getWrapNode(o),p=this.chat.getMarkNode(n),h=this.chat.getMarkNode(o),d=Array.prototype.indexOf.call(a.childNodes,p),f=Array.prototype.indexOf.call(c.childNodes,h);if(a===c&&a.parentNode===this.richText){const l=d>f,m=Array.prototype.filter.call(a.childNodes,(w,N)=>l?N<d&&N>f:N>d&&N<f).map(w=>w.cloneNode(!0)),E=l?n.textContent.slice(0,e.anchorOffset):n.textContent.slice(e.anchorOffset),C=l?o.textContent.slice(e.focusOffset):o.textContent.slice(0,e.focusOffset),b=this.chat.getGridElm(!0),k=this.chat.getGridElm(!0);E&&(b.childNodes[0].innerHTML=E,b.childNodes[0].setAttribute("data-set-empty","false")),C&&(k.childNodes[0].innerHTML=C,k.childNodes[0].setAttribute("data-set-empty","false")),l?(m.unshift(k),m.push(b)):(m.unshift(b),m.push(k));let T=document.createElement("div");const A=this.chat.setWrapNodeByMark(m);T.appendChild(A),t.clipboardData.setData("application/my-custom-format",T.innerHTML),T=null;return}if(a.parentNode===this.richText&&c.parentNode===this.richText){const l=Array.prototype.indexOf.call(this.richText.childNodes,a),m=Array.prototype.indexOf.call(this.richText.childNodes,c),E=l>m,C=Array.prototype.filter.call(this.richText.childNodes,(x,y)=>E?y<l&&y>m:y>l&&y<m).map(x=>x.cloneNode(!0)),b=E?n.textContent.slice(0,e.anchorOffset):n.textContent.slice(e.anchorOffset),k=E?o.textContent.slice(e.focusOffset):o.textContent.slice(0,e.focusOffset),T=this.chat.getGridElm(!0),A=this.chat.getGridElm(!0);b&&(T.childNodes[0].innerHTML=b,T.childNodes[0].setAttribute("data-set-empty","false")),k&&(A.childNodes[0].innerHTML=k,A.childNodes[0].setAttribute("data-set-empty","false"));const w=Array.prototype.filter.call(a.childNodes,(x,y)=>E?y<d:y>d).map(x=>x.cloneNode(!0)),N=Array.prototype.filter.call(c.childNodes,(x,y)=>E?y>f:y<f).map(x=>x.cloneNode(!0));if(E){w.push(T),N.unshift(A);const x=this.chat.setWrapNodeByMark(w),y=this.chat.setWrapNodeByMark(N);C.push(x),C.unshift(y)}else{w.unshift(T),N.push(A);const x=this.chat.setWrapNodeByMark(w),y=this.chat.setWrapNodeByMark(N);C.unshift(x),C.push(y)}let I=document.createElement("div");Array.prototype.forEach.call(C,x=>{I.appendChild(x)}),t.clipboardData.setData("application/my-custom-format",I.innerHTML),I=null;return}}async removeRange(){window.getSelection().getRangeAt(0).deleteContents(),await v(50),this.chat.updateGrid(),this.showPlaceholder()}updateUserList(t=void 0,e){t&&(this.userList=this.getRuleUserList(t)),e||(this.base64Images={}),this.needDialog&&(this.deviceInfo.isPc?this.updatePCUser():this.updateH5User())}getRuleUserList(t){if(!L(t,"Array"))throw new Error("参数值userList：类型值应为Array！");this.targetUserList=JSON.parse(JSON.stringify(t||[]));const e=Object.create(null);return e[this.userProps.id]="isALL",e[this.userProps.name]=this.callEveryLabel,this.targetUserList.unshift(e),(t==null?void 0:t.map((s,i)=>{const r=s[this.userProps.id];if(!r&&r!==0)throw new Error(`参数值userList：下标第${i}项${this.userProps.id}值异常！`);return s.name=String(s[this.userProps.name]||""),s.pinyin=String(s[this.userProps.pinyin]||""),s.id=String(r),s.avatar=String(s[this.userProps.avatar]||""),s}))||[]}getElmBlock(t){return t&&t.style.display==="block"}domElmShow(t,e=!1){t&&(t.className=t.className.replace(/ chat-view-show| chat-view-hidden/g,""),e?(t.style.display="block",t.className+=" chat-view-show"):t.style.display="none")}getUserHtmlTemplate(t,e){const s=document.createElement("span");if(s.setAttribute("class",`call-user-dialog-item-sculpture ${e.avatar?"is-avatar":""}`),e.avatar){const r=new Image;r.alt="";const n=this.base64Images[e.id];n?r.src=n:(r.src=String(e.avatar),r.setAttribute("crossOrigin","Anonymous"),r.onload=()=>{const o=document.createElement("canvas");o.width=48,o.height=48;const a=o.getContext("2d");a&&(a.drawImage(r,0,0,o.width,o.height),this.base64Images[e.id]=o.toDataURL("image/png",1))}),s.appendChild(r)}else s.innerHTML=`<span style="transform: scale(0.75)">${e.name.slice(-2)}</span>`;t.appendChild(s);const i=document.createElement("span");i.setAttribute("class","call-user-dialog-item-name"),i.innerHTML=e.name,t.appendChild(i)}hasPc(){this.initCheckbox(),this.initCallUser(),window.addEventListener("click",this.winClick),window.addEventListener("keydown",this.winKeydown)}initCheckbox(){this.checkboxElm=document.createElement("div"),this.checkboxElm.setAttribute("class","checkbox-dialog"),this.domElmShow(this.checkboxElm),this.checkboxElm.innerHTML=`
      <div class="checkbox-dialog-container">
        <div class="checkbox-dialog-container-header">
            <span>选择要@的人</span>
            <span class="checkbox-dialog-container-header-close">⛌</span>
        </div>
        <div class="checkbox-dialog-container-body">
            <div class="checkbox-dialog-left-box">
                <div class="checkbox-dialog-search">
                    <input class="checkbox-dialog-search-input" placeholder="搜索人员名称" type="text">

                    <div data-set-remark="搜索下拉" class="checkbox-dialog-search-group"></div>
                </div>

                <div data-set-remark="反显选取的人员" class="checkbox-dialog-tags"></div>

                <div class="checkbox-dialog-option">
                    <button class="checkbox-dialog-option-btn btn-submit">确定</button>
                    <button class="checkbox-dialog-option-btn btn-close">取消</button>
                </div>
            </div>
            
            <div class="checkbox-dialog-right-box">
                <div class="checkbox-dialog-right-box-title">研讨成员列表</div>

                <div data-set-remark="多选人员列表" class="checkbox-dialog-check-group"></div>
            </div>
        </div>
      </div>
    `,document.body.appendChild(this.checkboxElm),this.checkGroupElm=this.checkboxElm.querySelector(".checkbox-dialog-check-group"),this.searchResultElm=this.checkboxElm.querySelector(".checkbox-dialog-search-group"),this.searchElm=this.checkboxElm.querySelector(".checkbox-dialog-search-input"),this.tagsElm=this.checkboxElm.querySelector(".checkbox-dialog-tags");const t=()=>{this.domElmShow(this.checkboxElm),this.isExternalCallPopup=!1},e=this.checkboxElm.querySelector(".checkbox-dialog-container-header-close"),s=this.checkboxElm.querySelector(".btn-close");e.onclick=t,s.onclick=t;const i=this.checkboxElm.querySelector(".btn-submit");i.onclick=async()=>{await this.batchSetTag(this.checkboxRows),t(),this.chat.viewIntoPoint()},this.domElmShow(this.searchResultElm),this.searchResultElm.onclick=r=>{r.stopPropagation()},this.searchElm.onclick=r=>{r.stopPropagation()},this.searchElm.oninput=r=>{this.searchResultElm.innerHTML="";const n=String(r.target.value||"").replace(/'/g,"");if(!n){this.domElmShow(this.searchResultElm);return}const o=this.searchUserList(n),a=document.createDocumentFragment();if(o.forEach(c=>{const p=document.createElement("div");p.setAttribute("class","checkbox-dialog-check-item"),p.setAttribute("data-set-value",c.id);const h=document.createElement("div");h.setAttribute("class","checkbox-dialog-check-item-label"),this.getUserHtmlTemplate(h,c),p.appendChild(h),p.onclick=()=>{this.domElmShow(this.searchResultElm);const d=p.getAttribute("data-set-value")||"";if(this.searchElm.value="",this.checkboxRows.some(l=>l.id===d))return;const f=this.userList.find(l=>l.id===d);f&&this.checkboxRows.push(f),Array.prototype.some.call(this.checkGroupElm.children,(l,m)=>{if(m===0&&this.checkboxRows.length===this.userList.length)return l.className+=" checkbox-dialog-check-item-check",!1;if(l.getAttribute("data-set-value")===d)return l.className+=" checkbox-dialog-check-item-check",!0}),this.updateTags()},a.appendChild(p)}),!o.length){const c=document.createElement("div");c.setAttribute("class","checkbox-dialog-search-empty"),c.innerText=this.searchEmptyLabel,a.appendChild(c)}this.searchResultElm.appendChild(a),this.domElmShow(this.searchResultElm,!0)}}searchUserList(t,e){return(e||this.userList).filter(s=>M(s.name,s.pinyin||"",t).length>0)}updateTags(){const t=this.checkboxRows.map(n=>n.id),e=[],s=[];Array.prototype.forEach.call(this.tagsElm.children,n=>{const o=n.getAttribute("data-set-value");t.indexOf(o)===-1?s.push(n):e.push(o)}),s.forEach(n=>{this.tagsElm.removeChild(n)});const i=this.checkboxRows.filter(n=>e.indexOf(n.id)===-1);if(!i.length)return;const r=document.createDocumentFragment();i.forEach(n=>{const o=document.createElement("div");o.setAttribute("class","checkbox-dialog-tag-item"),o.setAttribute("data-set-value",n.id),o.innerHTML=`
        <span>${n.name}</span>
      `;const a=document.createElement("span");a.setAttribute("class","checkbox-dialog-tag-item-close"),a.innerHTML="⛌",a.onclick=()=>{const c=o.getAttribute("data-set-value");this.checkboxRows=this.checkboxRows.filter(p=>p.id!==c),this.tagsElm.removeChild(o),Array.prototype.some.call(this.checkGroupElm.children,(p,h)=>{if(h===0)return p.className=p.className.replace(/ checkbox-dialog-check-item-check/g,""),!1;if(p.getAttribute("data-set-value")===c)return p.className=p.className.replace(/ checkbox-dialog-check-item-check/g,""),!0})},o.appendChild(a),r.appendChild(o)}),this.tagsElm.appendChild(r)}initCallUser(){this.dialogElm=document.createElement("div"),this.dialogElm.setAttribute("class","call-user-dialog"),this.domElmShow(this.dialogElm);const t=document.createElement("div");t.setAttribute("class","call-user-dialog-header"),t.innerHTML=`
        <span class="call-user-dialog-header-title">群成员</span>
    `,this.dialogCheckElm=document.createElement("span"),this.dialogCheckElm.setAttribute("class","call-user-dialog-header-check"),this.domElmShow(this.dialogCheckElm,this.userList.length>0),this.dialogCheckElm.innerText="多选",this.dialogCheckElm.onclick=()=>{this.showPCCheckDialog(),this.isExternalCallPopup=!1},t.appendChild(this.dialogCheckElm),this.dialogElm.appendChild(t),this.dialogMainElm=document.createElement("div"),this.dialogMainElm.setAttribute("class","call-user-dialog-main"),this.dialogElm.appendChild(this.dialogMainElm),this.updateUserList();const e=document.createElement("div");e.setAttribute("class","call-user-dialog-footer"),this.dialogElm.appendChild(e),document.body.appendChild(this.dialogElm)}resizeUserTool(){this.toolUserList&&(this.userList=this.toolUserList),this.toolUserList=void 0,this.updateUserList(this.userList,!0)}updatePCUser(){this.dialogMainElm.innerHTML="",this.dialogActiveItemElm=void 0;const t=this.userList&&this.userList.length>0,e=document.createDocumentFragment();if(this.domElmShow(this.dialogCheckElm),!this.toolUserList&&t&&(this.domElmShow(this.dialogCheckElm,!0),this.needCallEvery)){const i=document.createElement("div");i.setAttribute("class","call-user-dialog-item"),i.setAttribute("data-set-id","isALL"),this.userSelectStyleAndEvent(i,{[this.userProps.id]:"isALL",[this.userProps.name]:this.callEveryLabel}),i.innerHTML=`
          <span class="call-user-dialog-item-sculpture">
            <span style="transform: scale(0.75)">@</span>
          </span>
          <span class="call-user-dialog-item-name">${this.callEveryLabel}(${this.userList.length})</span>
      `,e.appendChild(i)}this.userList.forEach(i=>{const r=document.createElement("div");r.setAttribute("class","call-user-dialog-item"),r.setAttribute("data-set-id",i.id),this.userSelectStyleAndEvent(r,i),this.getUserHtmlTemplate(r,i),e.appendChild(r)}),this.dialogMainElm.appendChild(e),this.callUserDialogMap(),this.checkGroupElm.innerHTML=`
                    <div class="checkbox-dialog-check-item" data-set-value="ALL">
                        <input type="checkbox" value>
                        <span class="checkbox-dialog-check-item-inner"></span>
                        <div class="checkbox-dialog-check-item-label">${this.checkAllLabel}</div>
                    </div>`;const s=document.createDocumentFragment();this.userList.forEach(i=>{const r=document.createElement("div");r.setAttribute("class","checkbox-dialog-check-item"),r.setAttribute("data-set-value",i.id),r.innerHTML=`
          <input type="checkbox" value>
          <span class="checkbox-dialog-check-item-inner"></span>
      `,this.getUserHtmlTemplate(r,i),s.appendChild(r)}),this.checkGroupElm.appendChild(s),this.checkGroupElm&&this.checkGroupElm.children.length&&Array.prototype.forEach.call(this.checkGroupElm.children,i=>{i.onclick=()=>{const r=i.getAttribute("data-set-value")||"",n=this.userList.find(o=>o.id===r);i.className.indexOf("checkbox-dialog-check-item-check")!==-1?(i.className=i.className.replace(/ checkbox-dialog-check-item-check/g,""),r!=="ALL"&&(this.checkboxRows=this.checkboxRows.filter(o=>o.id!==r))):(i.className+=" checkbox-dialog-check-item-check",r!=="ALL"&&n&&this.checkboxRows.push(n)),r==="ALL"?(Array.prototype.forEach.call(this.checkGroupElm.children,o=>{o.className=i.className}),this.checkboxRows=i.className.indexOf("checkbox-dialog-check-item-check")!==-1?this.userList.map(o=>o):[]):this.checkboxRows.length===this.userList.length?this.checkGroupElm.children[0].className+=" checkbox-dialog-check-item-check":this.checkGroupElm.children[0].className=this.checkGroupElm.children[0].className.replace(/ checkbox-dialog-check-item-check/g,""),this.updateTags()}})}userSelectStyleAndEvent(t,e){t.addEventListener("click",async s=>{s.stopPropagation(),this.upDateActiveItem(t),this.toolUserList&&this.toolUserList.length>0?await this.matchSetTag(e):await this.onceSetTag(e),this.exitDialog()})}callUserDialogMap(){this.itemShowList=[],Array.prototype.forEach.call(this.dialogMainElm.children||[],(t,e)=>{this.itemShowList.push({index:e,elm:t})})}ruleCanShowPointDialog(){this.userList.length>0&&this.chat.showAt()&&(this.startOpenIndex=this.chat.cursorIndex,this.showPCDialog())}showPCDialog(){this.domElmShow(this.dialogElm,!0);let t="0",e="100%";this.upDateActiveItem(this.dialogMainElm.firstElementChild,!0);const s=this.chat.getRangeRect(),{clientWidth:i,clientHeight:r}=this.dialogElm;s.x>window.innerWidth-i&&(s.x=s.x-i-16,t="100%"),s.y<r&&(s.y=r+s.y,e="0"),this.dialogElm.style.transformOrigin=`${t} ${e}`,this.dialogElm.style.left=s.x+6+"px",this.dialogElm.style.bottom=`calc(100% - ${s.y}px)`,this.dialogElm.style.opacity="1"}showPCCheckDialog(){this.winClick(),this.checkboxRows=[],this.domElmShow(this.checkboxElm,!0),this.tagsElm.scrollTop=0,this.checkGroupElm.scrollTop=0,this.searchElm.value="",Array.prototype.forEach.call(this.checkGroupElm.children,t=>{t.className="checkbox-dialog-check-item"}),this.updateTags(),this.isExternalCallPopup=!0}async showPCPointDialog(){this.insertText("@"),this.startOpenIndex=this.chat.cursorIndex,window.removeEventListener("click",this.winClick),this.showPCDialog(),await v(50),window.addEventListener("click",this.winClick)}moveActiveItem(t){if(!this.dialogActiveItemElm||this.itemShowList.length===0)return;let e=0;const s=this.dialogActiveItemElm.getAttribute("data-set-id");this.itemShowList.some(r=>{const n=r.elm.getAttribute("data-set-id");return e=r.index,s===n});const i=this.itemShowList.map(r=>r.index);if(t==="down"&&e!==this.itemShowList[this.itemShowList.length-1].index){const r=this.itemShowList[i.indexOf(e)+1];r&&this.upDateActiveItem(r.elm,!0)}else if(t==="up"&&e!==this.itemShowList[0].index){const r=this.itemShowList[i.indexOf(e)-1];r&&this.upDateActiveItem(r.elm,!0)}}upDateActiveItem(t,e=!1){this.dialogActiveItemElm&&(this.dialogActiveItemElm.className=this.dialogActiveItemElm.className.replace(/ call-user-dialog-item-active/g,"")),this.dialogActiveItemElm=t,t&&(t.className+=" call-user-dialog-item-active",e&&t.scrollIntoView({block:"center"}))}exitDialog(){this.toolUserList&&this.resizeUserTool(),this.upDateActiveItem(),this.domElmShow(this.dialogElm)}hasH5(){this.dialogH5Elm=document.createElement("div"),this.dialogH5Elm.setAttribute("class","call-user-popup"),this.dialogH5Elm.innerHTML=`
      <div class="call-user-popup-main">
        <div class="call-user-popup-header">
            <span class="popup-show">收起</span>
            <span class="popup-title">选择提醒的人</span>
            <span class="popup-check">确定</span>
        </div>
        
        <div class="call-user-popup-search">
            <svg class="icon-search"
                 style="vertical-align: middle;fill: currentColor;overflow: hidden;"
                 viewBox="0 0 1024 1024" version="1.1"
                 xmlns="http://www.w3.org/2000/svg"
                 p-id="4209">
                <path d="M684.8 223.530667a326.272 326.272 0 0 1 24.96 433.621333c2.645333 2.133333 5.290667 4.48 7.850667 7.04L870.4 817.066667c24.789333 24.746667 32.896 56.832 18.133333 71.594666-14.762667 14.805333-46.848 6.656-71.637333-18.090666l-152.789333-152.832a106.282667 106.282667 0 0 1-7.210667-7.936 326.101333 326.101333 0 0 1-433.109333-25.173334c-127.445333-127.445333-127.573333-333.952-0.256-461.269333 127.36-127.36 333.866667-127.232 461.269333 0.213333zM275.328 275.114667a252.885333 252.885333 0 0 0 0.256 357.632 252.885333 252.885333 0 0 0 357.632 0.256 252.885333 252.885333 0 0 0-0.256-357.632 252.885333 252.885333 0 0 0-357.632-0.256z"
                      fill="#9B9B9B"
                      p-id="4210"></path>
            </svg>
            <input class="call-user-popup-search-input"
                   placeholder="搜索人员名称"
                   type="text">
        </div>
        
        <div class="call-user-popup-body">
        </div>
      </div>
    `;const t=async()=>{this.dialogH5Elm.className=this.dialogH5Elm.className.replace(/ chat-view-show/g," chat-view-hidden"),this.dialogH5SearchElm.value="",await v(260),this.domElmShow(this.dialogH5Elm),this.chat.restCursorPos(this.chat.vnode,this.chat.cursorIndex),this.isExternalCallPopup=!1,this.chat.viewIntoPoint()};this.dialogH5Elm.onclick=t,this.dialogH5Elm.querySelector(".call-user-popup-main").onclick=e=>{e.stopPropagation()},this.dialogH5ShowElm=this.dialogH5Elm.querySelector(".popup-show"),this.dialogH5ShowElm.onclick=t,this.dialogH5CheckElm=this.dialogH5Elm.querySelector(".popup-check"),this.dialogH5CheckElm.onclick=async()=>{const e=this.dialogH5Elm.querySelectorAll(".user-popup-check-item-check")||[];if(e.length===0){await t();return}if(Array.prototype.some.call(e,r=>r.getAttribute("data-set-id")==="isALL")){await this.onceSetTag({[this.userProps.id]:"isALL",[this.userProps.name]:this.callEveryLabel}),await t();return}const s=Array.prototype.map.call(e,r=>r.getAttribute("data-set-id")),i=this.userList.filter(r=>s.includes(r.id));await this.batchSetTag(i),await t()},this.dialogH5MainElm=this.dialogH5Elm.querySelector(".call-user-popup-body"),this.updateUserList(),this.dialogH5SearchElm=this.dialogH5Elm.querySelector(".call-user-popup-search-input"),this.dialogH5SearchElm.oninput=e=>{const s=String(e.target.value||"").replace(/'/g,"");Array.prototype.forEach.call(this.dialogH5MainElm.children,i=>{if(!s){i.style.display="";return}const r=i.getAttribute("data-set-name")||"",n=i.getAttribute("data-set-pinyin")||"";i.style.display=M(r,n,s).length>0?"":"none"})},this.domElmShow(this.dialogH5Elm),document.body.appendChild(this.dialogH5Elm)}updateH5User(){this.dialogH5MainElm.innerHTML="",this.domElmShow(this.dialogH5CheckElm,this.userList.length>0);const t=this.userList&&this.userList.length>0,e=document.createDocumentFragment(),s=document.createElement("span");if(s.innerHTML=`
        <input type="checkbox" value>
        <span class="user-popup-check-item-inner"></span>
    `,t){const i=document.createElement("div");this.needCallEvery&&(i.setAttribute("class","call-user-popup-item"),i.setAttribute("data-set-id","isALL"),i.innerHTML=`
          <span class="call-user-dialog-item-sculpture">
            <span style="transform: scale(0.75)">@</span>
          </span>
          <span class="call-user-dialog-item-name">${this.callEveryLabel}(${this.userList.length})</span>
      `,i.appendChild(s.cloneNode(!0)),i.onclick=()=>{const r=i.className.indexOf("user-popup-check-item-check")===-1;Array.prototype.forEach.call(this.dialogH5MainElm.children,n=>{r?n.className+=" user-popup-check-item-check":n.className=n.className.replace(/ user-popup-check-item-check/g,"")})},e.appendChild(i)),this.userList.forEach((r,n)=>{const o=document.createElement("div");o.setAttribute("class","call-user-popup-item"),o.setAttribute("data-set-id",r.id),o.setAttribute("data-set-name",r.name),o.setAttribute("data-set-pinyin",r.pinyin||""),this.getUserHtmlTemplate(o,r),o.appendChild(s.cloneNode(!0)),e.appendChild(o),o.onclick=a=>{o.className.indexOf("user-popup-check-item-check")===-1?(o.className+=" user-popup-check-item-check",i.className+=Array.prototype.every.call(this.dialogH5MainElm.children,p=>p.className.indexOf("user-popup-check-item-check")!==-1||p.getAttribute("data-set-id")==="isALL")?" user-popup-check-item-check":""):(o.className=o.className.replace(/ user-popup-check-item-check/g,""),i.className=i.className.replace(/ user-popup-check-item-check/g,""))}})}this.dialogH5MainElm.appendChild(e)}showH5Dialog(){this.richText&&this.richText.blur(),Array.prototype.forEach.call(this.dialogH5MainElm.children,t=>{t.style.display="",t.className=t.className.replace(/ user-popup-check-item-check/g,"")}),this.domElmShow(this.dialogH5Elm,!0),this.dialogH5MainElm.scrollTop=0,this.isExternalCallPopup=!0}updateConfig({copyType:t,userProps:e,userList:s,uploadImage:i,needCallEvery:r,placeholder:n,maxLength:o,needCallSpace:a,wrapKeyFun:c,sendKeyFun:p}={}){if(t){if(!L(t,"Array"))throw new Error("参数值copyType：类型值应为Array！");this.copyType=t.map(h=>{if(["text","image"].indexOf(h)===-1)throw new Error(`参数值copyType：无效的参数值"${h}"！`);return h})}if(e){if(!L(e,"Object"))throw new Error("参数值copyType：类型值应为Object！");this.userProps=Object.assign({},{id:"id",name:"name",avatar:"avatar",pinyin:"pinyin"},e)}if(i){if(typeof i!="function")throw new Error("参数值uploadImage：参数类型错误，参数类型应为Function！");this.uploadImage=i}if(n&&(this.placeholderElm.innerText=n),o!==void 0){if(!L(o,"Number"))throw new Error("参数值maxLength：类型值应为Number！");this.maxLength=o,this.ruleMaxLength()}if((r!==void 0||s)&&(this.needCallEvery=String(r)!=="false",this.updateUserList(s)),a!==void 0&&this.chat.setCallSpace(a),c){if(typeof c!="function")throw new Error("参数值wrapKeyFun：参数类型错误，参数类型应为Function！");this.wrapKeyFun=c}if(p){if(typeof p!="function")throw new Error("参数值sendKeyFun：参数类型错误，参数类型应为Function！");this.sendKeyFun=p}}enterSend(){this.triggerChatEvent("enterSend")}insertHtml(t){const e=document.createElement("span");e.innerHTML=t,e.className="chat-set-html";const s=this.chat.createNewDom(e);return this.chat.replaceRegContent(s),this.chat.viewIntoPoint(),this.richTextInput(),s}insertInsideHtml(t){let e=document.createElement("div");if(e.innerHTML=t,!e.children.length)return;const s=this.chat.vnode,i=this.chat.getWrapNode(s);if(e.children.length===1)this.chat.gridMerge(i,e.children[0],!0);else{this.chat.gridMerge(i,e.children[0],!0);const r=Array.prototype.slice.call(e.children,1);let n=i;Array.prototype.forEach.call(r,(o,a)=>{if(n.parentElement?this.richText.insertBefore(o,n.nextElementSibling):this.richText.appendChild(o),n=o,a===r.length-1){const p=o.childNodes[o.childNodes.length-1].childNodes[0].childNodes[0];this.chat.restCursorPos(p,p.textContent.length)}})}e=null,this.chat.viewIntoPoint(),this.richTextInput()}insertText(t){var p,h;if(!t)return;const e=new RegExp(`${this.chat.ZERO_WIDTH_KEY}${this.chat.VOID_KEY}`,"ig"),s=t.replace(e,"");if(!s)return;let i,r=0;const n=this.chat.vnode;n&&n.parentElement&&n.parentElement.getAttribute("data-set-richType")==="richInput"?(i=n.parentElement,r=n.textContent===this.chat.VOID_KEY?1:this.chat.cursorLeft):(i=(h=(p=this.richText)==null?void 0:p.lastChild)==null?void 0:h.lastChild,r=i.childNodes[0].textContent.length);const o=(d,f=!1)=>{const l=i.childNodes[0],m=l.textContent.split("");return m.splice(r,0,d),l.textContent=m.join("").replace(new RegExp(this.chat.VOID_KEY,"g"),()=>(r--,"")),i.setAttribute("data-set-empty","false"),i.childNodes[1]&&i.removeChild(i.childNodes[1]),this.chat.restCursorPos(l,r+d.length),f&&this.chat.viewIntoPoint(),i.parentElement.parentElement},a=(d,f=!1,l)=>{const m=this.chat.getGridElm(),E=m.childNodes[0].childNodes[0];let C=1;return d&&(E.innerHTML=d,E.setAttribute("data-set-empty","false"),C=d.length),l.nextSibling?this.richText.insertBefore(m,l.nextSibling):this.richText.appendChild(m),f&&(this.chat.restCursorPos(E.childNodes[0],C),this.chat.viewIntoPoint()),m},c=s.split(`
`);if(c.length>1){let d;c.forEach((f,l)=>{l===0?d=o(f):d=a(f,l===c.length-1,d)})}else o(s,!0);this.richTextInput()}getCallUserList(){const t=this.richText.querySelectorAll(".at-user");if(t&&t.length>0){const e=Array.prototype.map.call(t,s=>s.dataset.userId);return K(this.targetUserList,e,this.userProps.id)}else return[]}getCallUserTagList(){const t=this.richText.querySelectorAll(".at-user");return t&&t.length>0?Array.prototype.map.call(t,e=>({[this.userProps.id]:e.dataset.userId,[this.userProps.name]:e.innerText.slice(1)})):[]}clear(t){this.chat.textInnerHtmlInit(!0,t);const e={html:this.richText.innerHTML,gridIndex:0,markIndex:0,cursorIndex:this.chat.cursorIndex};this.undoHistory=[e],this.redoHistory=[],this.richTextInput(!1)}isEmpty(t=!1){if((this.richText.querySelectorAll(".chat-tag")||[]).length>0)return!1;const s=new RegExp(`^(${this.chat.ZERO_WIDTH_KEY}|<br>|${this.chat.VOID_KEY})+$`),i=this.richText.querySelectorAll(".chat-grid-input")||[];return t?Array.prototype.every.call(i,r=>!r.innerHTML||!r.innerText||!r.innerText.trim()||s.test(r.innerHTML)):Array.prototype.every.call(i,r=>!r.innerHTML||!r.innerText||s.test(r.innerHTML))}showPlaceholder(){this.domElmShow(this.placeholderElm,this.isEmpty())}getReduceNode(t={}){const e=Object.assign({},{needUserId:!1,wrapClassName:void 0,rowClassName:void 0,imgToText:!1,identifyLink:!1},t),s=/(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,r=this.richText.cloneNode(!0).querySelectorAll(".chat-grid-wrap")||[],n=document.createElement("div");return e.wrapClassName&&(n.className=e.wrapClassName),Array.prototype.forEach.call(r,(o,a)=>{const c=o.querySelectorAll(".chat-stat")||[],p=document.createElement("p");e.rowClassName&&(p.className=e.rowClassName),Array.prototype.forEach.call(c,h=>{this.chat.getNodeEmpty(h)||(h.removeAttribute("data-set-richType"),h.removeAttribute("contenteditable"),h.removeAttribute("data-set-empty"),e.needUserId||h.removeAttribute("data-user-id"),e.imgToText&&h.firstChild&&h.firstChild.tagName==="IMG"&&(h.className+=" img-to-text",h.innerHTML=`[${h.firstChild.getAttribute("data-img-text")||"元素data-img-text未定义"}]`),e.identifyLink&&h.className.indexOf("chat-grid-input")!==-1&&(h.innerHTML=h.innerHTML.replace(s,d=>`<a class="chat-grid-link" href="${d}" target="_blank">${d}</a>`)),p.appendChild(h))}),p.innerHTML||(p.innerHTML="<br>"),n.appendChild(p)}),n}getText(t={}){let e="";const s=this.getReduceNode(t);return Array.prototype.forEach.call(s.children,(i,r)=>{e=e+(r>0?`
`:"")+i.textContent}),e}getHtml(t={}){return this.getReduceNode(t).innerHTML}dispose(){const t=this.richText.parentElement;t&&(t.removeChild(this.richText),t.removeChild(this.placeholderElm)),this.needDialog&&(this.deviceInfo.isPc?(document.body.removeChild(this.dialogElm),document.body.removeChild(this.checkboxElm),window.removeEventListener("click",this.winClick),window.removeEventListener("keydown",this.winKeydown)):document.body.removeChild(this.dialogH5Elm));for(const e in this)delete this[e];Object.setPrototypeOf(this,Object)}setUserTag(t){const e=this.chat.createAtUserSpan({id:t[this.userProps.id],name:t[this.userProps.name]});this.chat.replaceRegContent(e,!1),this.chat.viewIntoPoint(),this.richTextInput()}async matchSetTag(t){await this.chat.searchCall(t,this.startOpenIndex),await this.richTextInput()}async onceSetTag(t){await this.chat.onceCall({id:t[this.userProps.id],name:t[this.userProps.name]}),await this.richTextInput()}async batchSetTag(t){if(t.length===1){this.isExternalCallPopup?await this.chat.onceExternalCall(t[0]):await this.onceSetTag(t[0]);return}let e="";for(let s=0;s<=t.length-1;){const i={id:t[s][this.userProps.id],name:t[s][this.userProps.name]};s===0?e=this.isExternalCallPopup?await this.chat.onceExternalCall(i):await this.chat.onceCall(i,!0):s===t.length-1?await this.chat.onceCall(i,!1,e):await this.chat.onceCall(i,!0),s++}await this.richTextInput()}disabled(){this.richText.setAttribute("contenteditable","false"),this.richText.className=this.richText.className.replace(/ chat-rich-text-disabled/g,"")+" chat-rich-text-disabled"}enable(){this.richText.setAttribute("contenteditable","true"),this.richText.className=this.richText.className.replace(/ chat-rich-text-disabled/g,""),this.chat.setRangeLastText()}undo(){if(!this.doOverHistory||!this.undoHistory||this.undoHistory.length<=1)return;const t=this.undoHistory[this.undoHistory.length-2],e=this.undoHistory[this.undoHistory.length-1];this.redoHistory.push(e),this.undoHistory.pop(),this.setChatHistory(t,!1)}redo(){if(!this.doOverHistory||!this.redoHistory||this.redoHistory.length<1)return;const t=this.redoHistory[this.redoHistory.length-1];this.redoHistory.pop(),this.setChatHistory(t,!0)}ruleMaxLength(){if(this.isEmpty()||this.maxLength===void 0){this.textLength=0;return}let t=0,e=0;const s=[];Array.prototype.some.call(this.richText.children,(r,n)=>{const{nodeInfos:o,nodeTextLength:a}=this.getGirdNodeTextInfo(r);if(t+=a,s.push(o),e=n,t>=this.maxLength)return!0});const i=[];Array.prototype.forEach.call(this.richText.children,(r,n)=>{n>e&&i.push(r)}),i.forEach(r=>this.richText.removeChild(r)),this.deepDelGirdText(s,t)}getGirdNodeTextInfo(t){const e=[];let s=0;if(t.children.length===1&&t!==t.parentElement.children[0]){const i=t.children[0],r=(i.textContent||"").replace(new RegExp(this.chat.VOID_KEY,"g"),"");s+=r.length||1,e[0]={node:i,textLength:r.length||1,type:"richMark"}}else Array.prototype.forEach.call(t.children,(i,r)=>{if(i.getAttribute("data-set-richType")==="richMark"){const o=(i.textContent||"").replace(new RegExp(this.chat.VOID_KEY,"g"),"");s+=o.length,e[r]={node:i,textLength:o.length,type:"richMark"}}else{const o=(i.textContent||"").replace(new RegExp(this.chat.VOID_KEY,"g"),"");s+=o.length||1,e[r]={node:i,textLength:o.length||1,type:"chatTag"}}});return{nodeInfos:e,nodeTextLength:s}}deepDelGirdText(t,e){if(e>this.maxLength){const s=t[t.length-1];t.pop(),this.deepDelNode(s,t,e)}else this.textLength=e}deepDelNode(t,e,s){const i=t[0].node.parentElement;if(s>this.maxLength){let r=s-this.maxLength,n=t[t.length-1];if(n.type==="richMark")if(n.textLength===0||r>=n.textLength)i.removeChild(n.node),t.pop(),r=r-n.textLength,n=t[t.length-1],i.removeChild(n.node),t.pop(),r=r-n.textLength;else{const o=n.node.childNodes[0];o.textContent=o.textContent.slice(0,n.textLength-r),o.textContent===0&&(o.setAttribute("data-set-empty","true"),o.innerHTML=`${this.chat.VOID_KEY}<br>`),r=0}else i.removeChild(n.node),t.pop(),r=r-n.textLength;r>0?t.length>0?this.deepDelNode(t,e,r+this.maxLength):(this.richText.appendChild(i),this.deepDelGirdText(e,r+this.maxLength)):(this.textLength=this.maxLength+r,this.enable())}}setChatHistory(t,e){this.doOverHistory=!1;const{html:s,gridIndex:i,markIndex:r,cursorIndex:n}=t;this.richText.innerHTML=s;const o=this.richText.childNodes[i].childNodes[r].childNodes[0].childNodes[0];this.chat.restCursorPos(o,n),this.chat.viewIntoPoint(),this.richTextInput(e).then(()=>{this.doOverHistory=!0})}revisePCPointDialogLabel(t={}){const e=Object.assign({},{title:"群成员",checkLabel:"多选"},t);this.dialogElm.querySelector(".call-user-dialog-header-title").innerText=e.title,this.dialogCheckElm.innerText=e.checkLabel}revisePCCheckDialogLabel(t={}){const e=Object.assign({},{title:"选择要@的人",searchPlaceholder:"搜素人员名称",searchEmptyLabel:"没有匹配到任何结果",userTagTitle:"研讨成员列表",checkAllLabel:"全选",confirmLabel:"确定",cancelLabel:"取消"},t);this.checkboxElm.querySelector(".checkbox-dialog-container-header").children[0].innerText=e.title,this.searchElm.setAttribute("placeholder",e.searchPlaceholder||""),this.searchEmptyLabel=e.searchEmptyLabel||"",this.checkboxElm.querySelector(".checkbox-dialog-right-box-title").innerText=e.userTagTitle,this.checkAllLabel=e.checkAllLabel||"",this.checkGroupElm.children[0].children[2].innerText=this.checkAllLabel,this.checkboxElm.querySelector(".btn-submit").innerText=e.confirmLabel,this.checkboxElm.querySelector(".btn-close").innerText=e.cancelLabel}reviseH5DialogLabel(t){const e=Object.assign({},{title:"选择提醒的人",searchPlaceholder:"搜素人员名称",confirmLabel:"确定",cancelLabel:"收起"},t);this.dialogH5Elm.querySelector(".popup-title").innerText=e.title,this.dialogH5SearchElm.setAttribute("placeholder",e.searchPlaceholder||""),this.dialogH5CheckElm.innerText=e.confirmLabel,this.dialogH5ShowElm.innerText=e.cancelLabel}reverseAnalysis(t,e){const s=document.createElement("div");s.innerHTML=t;const i=s.children;Array.prototype.forEach.call(i,r=>{r.className="chat-grid-wrap",r.setAttribute("data-set-richType","richBox");const n=r.children,o={},a=[];Array.prototype.forEach.call(n,(h,d)=>{if(h.className.indexOf("chat-grid-input")!==-1){const m=h.innerText;h.className="",h.setAttribute("data-set-richType","richMark"),h.innerHTML=`<span class="chat-grid-input chat-stat" data-set-richType="richInput" data-set-empty="false">${m}</span>`;return}if(h.tagName==="BR"){const m=this.chat.getGridElm(!0);r.removeChild(h),r.appendChild(m);return}const f=h.cloneNode(!0);f.setAttribute("contenteditable","false");const l=document.createElement("span");l.className="chat-tag",l.setAttribute("contenteditable","false"),l.setAttribute("data-set-richType","chatTag"),l.appendChild(f),o[d]=l,d!==n.length-1?n[d+1].className.indexOf("chat-grid-input")===-1&&a.push(d):a.push(d),d===0&&a.push(-1)});for(const h in o){const d=Number(h);d===n.length-1?(r.removeChild(n[d]),r.appendChild(o[h])):(r.insertBefore(o[h],n[d+1]),r.removeChild(n[d]))}const c=[],p=r.children;a.forEach(h=>{h===p.length-1?c.push("isEnd"):c.push(p[h+1])}),c.forEach(h=>{const d=this.chat.getGridElm(!0);if(h==="isEnd")r.appendChild(d);else{const f=d.children[0];f.removeChild(f.childNodes[1]),r.insertBefore(d,h)}})}),e?(this.enable(),this.insertInsideHtml(s.innerHTML)):(this.richText.innerHTML=s.innerHTML,this.enable(),this.chat.viewIntoPoint(),this.richTextInput())}addEventListener(t,e){this.chatEventModule[t].push(e)}removeEventListener(t,e){const s=this.chatEventModule[t],i=s.indexOf(e);i!==-1&&s.splice(i,1)}triggerChatEvent(t,...e){let s;return this.chatEventModule[t].forEach(i=>{i&&(s?i(...e):s=i(...e))}),s}ruleChatEvent(t,e,...s){(this.triggerChatEvent(e,...s)+"").toUpperCase()!=="PREVENT"&&(t&&t.bind(this)(),t=null)}}if(!window)throw new Error("非web环境！");window.console&&window.console.log&&console.log(" %c ".concat("ChatArea"," %c v4.6.5 "),"background: #269AFF; color: #FFFFFF; padding: 4px 0; border-radius: 4px 0px 0px 4px; font-style: italic;","background: #FFFFFF; color: #269AFF; padding: 2px 0; border-radius: 0px 4px 4px 0px; font-style: italic; border: 2px solid #269AFF;");window.ChatArea=U;


/***/ }),

/***/ "93f9":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_badge_vue_vue_type_style_index_0_id_4e06d65a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("323d");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_badge_vue_vue_type_style_index_0_id_4e06d65a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_badge_vue_vue_type_style_index_0_id_4e06d65a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "96cf":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per GeneratorResume behavior specified since ES2015:
        // ES2015 spec, step 3: https://262.ecma-international.org/6.0/#sec-generatorresume
        // Latest spec, step 2: https://tc39.es/ecma262/#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next method, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable != null) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    throw new TypeError(typeof iterable + " is not iterable");
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "990b":
/***/ (function(module, exports, __webpack_require__) {

// all object keys, includes non-enumerable and symbols
var gOPN = __webpack_require__("9093");
var gOPS = __webpack_require__("2621");
var anObject = __webpack_require__("cb7c");
var Reflect = __webpack_require__("7726").Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it) {
  var keys = gOPN.f(anObject(it));
  var getSymbols = gOPS.f;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__("cb7c");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var toInteger = __webpack_require__("4588");
var advanceStringIndex = __webpack_require__("0390");
var regExpExec = __webpack_require__("5f1b");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ab30":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "b0c5":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__("520a");
__webpack_require__("5ca1")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "b25a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_4b7eee71_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ab30");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_4b7eee71_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_4b7eee71_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "ba05":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "bd33":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editor_vue_vue_type_style_index_0_id_2ac8dde4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("e6e3");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editor_vue_vue_type_style_index_0_id_2ac8dde4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_editor_vue_vue_type_style_index_0_id_2ac8dde4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb50":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cc9a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_button_vue_vue_type_style_index_0_id_5df72ff0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("8bcf");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_button_vue_vue_type_style_index_0_id_5df72ff0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_button_vue_vue_type_style_index_0_id_5df72ff0_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d6dd":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "d6f8":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dcc3":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_event_vue_vue_type_style_index_0_id_484db2b4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("117e");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_event_vue_vue_type_style_index_0_id_484db2b4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_event_vue_vue_type_style_index_0_id_484db2b4_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "dfa9":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e003":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_avatar_vue_vue_type_style_index_0_id_72d5ddac_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("61c8");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_avatar_vue_vue_type_style_index_0_id_72d5ddac_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_avatar_vue_vue_type_style_index_0_id_72d5ddac_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e61c":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_id_f4dd6b2a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d6dd");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_id_f4dd6b2a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_image_vue_vue_type_style_index_0_id_f4dd6b2a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "e6e3":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "ed7d":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_0e79532a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3bcf");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_0e79532a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_11_oneOf_1_0_node_modules_css_loader_index_js_ref_11_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_oneOf_1_2_node_modules_stylus_loader_index_js_ref_11_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_messages_vue_vue_type_style_index_0_id_0e79532a_prod_lang_stylus__WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),

/***/ "f1ae":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ "f559":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])

var $export = __webpack_require__("5ca1");
var toLength = __webpack_require__("9def");
var context = __webpack_require__("d2c8");
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * __webpack_require__("5147")(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fa5b":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("5537")('native-function-to-string', Function.toString);


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.function.name.js
var es6_function_name = __webpack_require__("7f7f");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.constructor.js
var es6_regexp_constructor = __webpack_require__("3b2b");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.values.js
var es7_object_values = __webpack_require__("8615");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.to-string.js
var es6_regexp_to_string = __webpack_require__("6b54");

// CONCATENATED MODULE: ./packages/utils/validate.js





function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
function isString(str) {
  return typeof str == "string";
}
function isToday(time) {
  return new Date().getTime() - time < 86400000;
}
function isEmpty(obj) {
  if (!obj) return true;
  if (Array.isArray(obj) && obj.length == 0) return true;
  if (isPlainObject(obj) && Object.values(obj).length == 0) return true;
  return false;
}
function isUrl(str) {
  var reg = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
  //ftp的user@
  "(([0-9]{1,3}.){3}[0-9]{1,3}" +
  // IP形式的URL- 199.194.52.184
  "|" +
  // 允许IP和DOMAIN（域名）
  "([0-9a-z_!~*'()-]+.)*" +
  // 域名- www.
  "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." +
  // 二级域名
  "[a-z]{2,6})" +
  // first level domain- .com or .museum
  "(:[0-9]{1,4})?" +
  // 端口- :80
  "((/?)|" +
  // 如果没有文件名，则不需要斜杠
  "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  return new RegExp(reg).test(str) ? true : false;
}
function isFunction(val) {
  return val && typeof val === "function";
}
function isEng(val) {
  return /^[A-Za-z]+$/.test(val);
}
// EXTERNAL MODULE: ./node_modules/regenerator-runtime/runtime.js
var runtime = __webpack_require__("96cf");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/popover.vue?vue&type=script&lang=js







var popoverCloseQueue = [];

var triggerEvents = {
  hover: function hover(el) {},
  focus: function focus(el) {
    var _this = this;
    el.addEventListener("focus", function (e) {
      _this.changeVisible();
    });
    el.addEventListener("blur", function (e) {
      _this.changeVisible();
    });
  },
  click: function click(el) {
    var _this2 = this;
    el.addEventListener("click", function (e) {
      e.stopPropagation();
      contextmenu.hide();
      _this2.changeVisible();
    });
  },
  contextmenu: function contextmenu(el) {
    var _this3 = this;
    el.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      _this3.changeVisible();
    });
  }
};
/* harmony default export */ var popovervue_type_script_lang_js = ({
  name: "LemonPopover",
  props: {
    trigger: {
      type: String,
      default: "click",
      validator: function validator(val) {
        return Object.keys(triggerEvents).includes(val);
      }
    }
  },
  data: function data() {
    return {
      popoverStyle: {},
      visible: false
    };
  },
  created: function created() {
    document.addEventListener("click", this._documentClickEvent);
    popoverCloseQueue.push(this.close);
  },
  mounted: function mounted() {
    triggerEvents[this.trigger].call(this, this.$slots.default[0].elm);
  },
  render: function render() {
    var h = arguments[0];
    return h("span", {
      "style": "position:relative"
    }, [h("transition", {
      "attrs": {
        "name": "lemon-slide-top"
      }
    }, [this.visible && h("div", {
      "class": "lemon-popover",
      "ref": "popover",
      "style": this.popoverStyle,
      "on": {
        "click": function click(e) {
          return e.stopPropagation();
        }
      }
    }, [h("div", {
      "class": "lemon-popover__content"
    }, [this.$slots.content]), h("div", {
      "class": "lemon-popover__arrow"
    })])]), this.$slots.default]);
  },
  destroyed: function destroyed() {
    document.removeEventListener("click", this._documentClickEvent);
  },
  computed: {},
  watch: {
    visible: function () {
      var _visible = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(val) {
        var defaultEl, contentEl;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!val) {
                _context.next = 6;
                break;
              }
              _context.next = 3;
              return this.$nextTick();
            case 3:
              defaultEl = this.$slots.default[0].elm;
              contentEl = this.$refs.popover;
              this.popoverStyle = {
                top: "-".concat(contentEl.offsetHeight + 10, "px"),
                left: "".concat(defaultEl.offsetWidth / 2 - contentEl.offsetWidth / 2, "px")
              };
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function visible(_x) {
        return _visible.apply(this, arguments);
      }
      return visible;
    }()
  },
  methods: {
    _documentClickEvent: function _documentClickEvent(e) {
      e.stopPropagation();
      if (this.visible) this.close();
    },
    changeVisible: function changeVisible() {
      this.visible ? this.close() : this.open();
    },
    open: function open() {
      this.closeAll();
      this.visible = true;
    },
    closeAll: function closeAll() {
      popoverCloseQueue.forEach(function (callback) {
        return callback();
      });
    },
    close: function close() {
      this.visible = false;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/popover.vue?vue&type=script&lang=js
 /* harmony default export */ var components_popovervue_type_script_lang_js = (popovervue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/popover.vue?vue&type=style&index=0&id=ae0fc606&prod&lang=stylus
var popovervue_type_style_index_0_id_ae0fc606_prod_lang_stylus = __webpack_require__("718e");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent(
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */,
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) {
    // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
          injectStyles.call(
            this,
            (options.functional ? this.parent : this).$root.$options.shadowRoot
          )
        }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./packages/components/popover.vue
var popover_render, staticRenderFns





/* normalize component */

var popover_component = normalizeComponent(
  components_popovervue_type_script_lang_js,
  popover_render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var popover = (popover_component.exports);
// CONCATENATED MODULE: ./packages/directives/contextmenu.js

// import Vue from "vue";


var contextmenu_popover;
var hidePopover = function hidePopover() {
  if (contextmenu_popover) contextmenu_popover.style.display = "none";
};
var showPopover = function showPopover() {
  if (contextmenu_popover) contextmenu_popover.style.display = "block";
};
document.addEventListener("click", function (e) {
  hidePopover();
});
/* harmony default export */ var contextmenu = ({
  hide: hidePopover,
  bind: function bind(el, binding, vnode) {
    el.addEventListener(binding.modifiers.click ? "click" : "contextmenu", function (e) {
      if (isEmpty(binding.value) || !Array.isArray(binding.value)) return;
      if (binding.modifiers.click) e.stopPropagation();
      e.preventDefault();
      popover.methods.closeAll();
      var component;
      var visibleItems = [];
      if (binding.modifiers.message) component = vnode.context;else if (binding.modifiers.contact) component = vnode.child;
      if (!contextmenu_popover) {
        contextmenu_popover = document.createElement("div");
        contextmenu_popover.className = "lemon-contextmenu";
        document.body.appendChild(contextmenu_popover);
      }
      contextmenu_popover.innerHTML = binding.value.map(function (item) {
        var visible;
        if (isFunction(item.visible)) {
          visible = item.visible(component);
        } else {
          visible = item.visible === undefined ? true : item.visible;
        }
        if (visible) {
          visibleItems.push(item);
          var icon = item.icon ? "<i class=\"lemon-contextmenu__icon ".concat(item.icon, "\"></i>") : "";
          return "<div style=\"color:".concat(item.color, "\" title=\"").concat(item.text, "\" class=\"lemon-contextmenu__item\">").concat(icon, "<span>").concat(item.text, "</span></div>");
        }
        return "";
      }).join("");
      var menuHeight = contextmenu_popover.offsetHeight;
      var menuWidth = contextmenu_popover.offsetWidth;
      // 获取屏幕可视区域高度
      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var positionTop = e.clientY + menuHeight > windowHeight ? e.pageY - menuHeight - 5 : e.pageY;
      var positionLeft = e.clientX + menuWidth > windowWidth ? e.pageX - menuWidth - 5 : e.pageX;
      contextmenu_popover.style.top = "".concat(positionTop, "px");
      contextmenu_popover.style.left = "".concat(positionLeft, "px");
      contextmenu_popover.childNodes.forEach(function (node, index) {
        var _visibleItems$index = visibleItems[index],
          click = _visibleItems$index.click,
          render = _visibleItems$index.render;
        node.addEventListener("click", function (e) {
          e.stopPropagation();
          if (isFunction(click)) click(e, component, hidePopover);
        });

        // if (isFunction(render)) {
        //   const ins = Vue.extend({
        //     render: h => {
        //       return render(h, component, hidePopover);
        //     },
        //   });
        //   const renderComponent = new ins().$mount();
        //   node.querySelector("span").innerHTML =
        //     renderComponent.$el.outerHTML;
        // }
      });
      showPopover();
    });
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/tabs.vue?vue&type=script&lang=js
/* harmony default export */ var tabsvue_type_script_lang_js = ({
  name: "LemonTabs",
  props: {
    activeIndex: String
  },
  data: function data() {
    return {
      active: this.activeIndex
    };
  },
  mounted: function mounted() {
    if (!this.active) {
      this.active = this.$slots["tab-pane"][0].data.attrs.index;
    }
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    var pane = [];
    var nav = [];
    this.$slots["tab-pane"].map(function (vnode) {
      var _vnode$data$attrs = vnode.data.attrs,
        tab = _vnode$data$attrs.tab,
        index = _vnode$data$attrs.index;
      pane.push(h("div", {
        "class": "lemon-tabs-content__pane",
        "directives": [{
          name: "show",
          value: _this.active == index
        }]
      }, [vnode]));
      nav.push(h("div", {
        "class": ["lemon-tabs-nav__item", _this.active == index && "lemon-tabs-nav__item--active"],
        "on": {
          "click": function click() {
            return _this._handleNavClick(index);
          }
        }
      }, [tab]));
    });
    return h("div", {
      "class": "lemon-tabs"
    }, [h("div", {
      "class": "lemon-tabs-content"
    }, [pane]), h("div", {
      "class": "lemon-tabs-nav"
    }, [nav])]);
  },
  methods: {
    _handleNavClick: function _handleNavClick(index) {
      this.active = index;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/tabs.vue?vue&type=script&lang=js
 /* harmony default export */ var components_tabsvue_type_script_lang_js = (tabsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/tabs.vue?vue&type=style&index=0&id=5041e790&prod&lang=stylus
var tabsvue_type_style_index_0_id_5041e790_prod_lang_stylus = __webpack_require__("69bb");

// CONCATENATED MODULE: ./packages/components/tabs.vue
var tabs_render, tabs_staticRenderFns





/* normalize component */

var tabs_component = normalizeComponent(
  components_tabsvue_type_script_lang_js,
  tabs_render,
  tabs_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var tabs = (tabs_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/button.vue?vue&type=script&lang=js
/* harmony default export */ var buttonvue_type_script_lang_js = ({
  name: "LemonButton",
  props: {
    color: {
      type: String,
      default: "default"
    },
    disabled: Boolean
  },
  render: function render() {
    var h = arguments[0];
    return h("button", {
      "class": ["lemon-button", "lemon-button--color-".concat(this.color)],
      "attrs": {
        "disabled": this.disabled,
        "type": "button"
      },
      "on": {
        "click": this._handleClick
      }
    }, [this.$slots.default]);
  },
  methods: {
    _handleClick: function _handleClick(e) {
      this.$emit("click", e);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/button.vue?vue&type=script&lang=js
 /* harmony default export */ var components_buttonvue_type_script_lang_js = (buttonvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/button.vue?vue&type=style&index=0&id=5df72ff0&prod&lang=stylus
var buttonvue_type_style_index_0_id_5df72ff0_prod_lang_stylus = __webpack_require__("cc9a");

// CONCATENATED MODULE: ./packages/components/button.vue
var button_render, button_staticRenderFns





/* normalize component */

var button_component = normalizeComponent(
  components_buttonvue_type_script_lang_js,
  button_render,
  button_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_button = (button_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/badge.vue?vue&type=script&lang=js

/* harmony default export */ var badgevue_type_script_lang_js = ({
  name: "LemonBadge",
  props: {
    count: [Number, Boolean],
    overflowCount: {
      type: Number,
      default: 99
    }
  },
  render: function render() {
    var h = arguments[0];
    return h("span", {
      "class": "lemon-badge"
    }, [this.$slots.default, this.count !== 0 && this.count !== undefined && h("span", {
      "class": ["lemon-badge__label", this.isDot && "lemon-badge__label--dot"]
    }, [this.label])]);
  },
  computed: {
    isDot: function isDot() {
      return this.count === true;
    },
    label: function label() {
      if (this.isDot) return "";
      return this.count > this.overflowCount ? "".concat(this.overflowCount, "+") : this.count;
    }
  },
  methods: {}
});
// CONCATENATED MODULE: ./packages/components/badge.vue?vue&type=script&lang=js
 /* harmony default export */ var components_badgevue_type_script_lang_js = (badgevue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/badge.vue?vue&type=style&index=0&id=4e06d65a&prod&lang=stylus
var badgevue_type_style_index_0_id_4e06d65a_prod_lang_stylus = __webpack_require__("93f9");

// CONCATENATED MODULE: ./packages/components/badge.vue
var badge_render, badge_staticRenderFns





/* normalize component */

var badge_component = normalizeComponent(
  components_badgevue_type_script_lang_js,
  badge_render,
  badge_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var badge = (badge_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/avatar.vue?vue&type=script&lang=js

/* harmony default export */ var avatarvue_type_script_lang_js = ({
  name: "LemonAvatar",
  inject: ["IMUI"],
  props: {
    src: String,
    icon: {
      type: String,
      default: "lemon-icon-people"
    },
    circle: {
      type: Boolean,
      default: function _default() {
        return this.IMUI ? this.IMUI.avatarCricle : false;
      }
    },
    size: {
      type: Number,
      default: 32
    }
  },
  data: function data() {
    return {
      imageFinishLoad: true
    };
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    return h("span", {
      "style": this.style,
      "class": ["lemon-avatar", {
        "lemon-avatar--circle": this.circle
      }],
      "on": {
        "click": function click(e) {
          return _this.$emit("click", e);
        }
      }
    }, [(this.imageFinishLoad || !this.src) && h("i", {
      "class": this.icon
    }), h("img", {
      "attrs": {
        "src": this.src
      },
      "on": {
        "load": this._handleLoad
      }
    })]);
  },
  computed: {
    style: function style() {
      var size = "".concat(this.size, "px");
      return {
        width: size,
        height: size,
        lineHeight: size,
        fontSize: "".concat(this.size / 2, "px")
      };
    }
  },
  methods: {
    _handleLoad: function _handleLoad() {
      this.imageFinishLoad = false;
    }
  }
});
// CONCATENATED MODULE: ./packages/components/avatar.vue?vue&type=script&lang=js
 /* harmony default export */ var components_avatarvue_type_script_lang_js = (avatarvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/avatar.vue?vue&type=style&index=0&id=72d5ddac&prod&lang=stylus
var avatarvue_type_style_index_0_id_72d5ddac_prod_lang_stylus = __webpack_require__("e003");

// CONCATENATED MODULE: ./packages/components/avatar.vue
var avatar_render, avatar_staticRenderFns





/* normalize component */

var avatar_component = normalizeComponent(
  components_avatarvue_type_script_lang_js,
  avatar_render,
  avatar_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var avatar = (avatar_component.exports);
// EXTERNAL MODULE: ./node_modules/@vue/babel-helper-vue-jsx-merge-props/dist/helper.js
var helper = __webpack_require__("2638");
var helper_default = /*#__PURE__*/__webpack_require__.n(helper);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.get-own-property-descriptors.js
var es7_object_get_own_property_descriptors = __webpack_require__("8e6e");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : String(i);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// CONCATENATED MODULE: ./packages/utils/index.js









function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

function messageToHtml() {}
function messageToText() {}
/**
 * 使用某个组件上的作用域插槽
 * @param {VueComponent} inject
 * @param {String} slotName
 * @param {Node} defaultElement
 * @param {Object} props
 */
function useScopedSlot(slot, def, props) {
  return slot ? slot(props) : def;
}
function padZero(val) {
  return val < 10 ? "0".concat(val) : val;
}
function hoursTimeFormat(t) {
  var date = new Date(t);
  var nowDate = new Date();
  var Y = function Y(t) {
    return t.getFullYear();
  };
  var MD = function MD(t) {
    return "".concat(t.getMonth() + 1, "-").concat(t.getDate());
  };
  var dateY = Y(date);
  var nowDateY = Y(nowDate);
  var format;
  if (dateY !== nowDateY) {
    format = "y年m月d日 h:i";
  } else if ("".concat(dateY, "-").concat(MD(date)) === "".concat(nowDateY, "-").concat(MD(nowDate))) {
    format = "h:i";
  } else {
    format = "m月d日 h:i";
  }
  return timeFormat(t, format);
}
function timeFormat(t, format) {
  if (!format) format = "y-m-d h:i:s";
  if (t) t = new Date(t);else t = new Date();
  var formatArr = [t.getFullYear().toString(), padZero((t.getMonth() + 1).toString()), padZero(t.getDate().toString()), padZero(t.getHours().toString()), padZero(t.getMinutes().toString()), padZero(t.getSeconds().toString())];
  var reg = "ymdhis";
  for (var i = 0; i < formatArr.length; i++) {
    format = format.replace(reg.charAt(i), formatArr[i]);
  }
  return format;
}
function funCall(event, callback) {
  if (isFunction(event)) {
    event(function () {
      callback();
    });
  } else {
    callback();
  }
}
/**
 * 获取数组相交的值组成新数组
 * @param {Array} a
 * @param {Array} b
 */
function arrayIntersect(a, b) {
  return a.filter(function (x) {
    return b.includes(x);
  });
}
//清除字符串内的所有HTML标签
function clearHtml(str) {
  return str.replace(/<.*?>/gi, "");
}
//清除字符串内的所有HTML标签，除了IMG
function clearHtmlExcludeImg(str) {
  return str.replace(/<(?!img).*?>/gi, "");
}
function error(text) {
  throw new Error(text);
}
function cloneDeep(obj) {
  var newobj = _objectSpread({}, obj);
  for (var key in newobj) {
    var val = newobj[key];
    if (isPlainObject(val)) {
      newobj[key] = cloneDeep(val);
    }
  }
  return newobj;
}
function mergeDeep(o1, o2) {
  for (var key in o2) {
    if (isPlainObject(o1[key])) {
      o1[key] = mergeDeep(o1[key], o2[key]);
    } else {
      o1[key] = o2[key];
    }
  }
  return o1;
}
function formatByte(value) {
  if (null == value || value == "") {
    return "0 Bytes";
  }
  var unitArr = ["B", "K", "M", "G", "T", "P", "E", "Z", "Y"];
  var index = 0;
  var srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  var size = srcsize / Math.pow(1024, index);
  size = parseFloat(size.toFixed(2));
  return size + unitArr[index];
}
function generateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : r & 0x3 | 0x8).toString(16);
  });
  return uuid;
}
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/contact.vue?vue&type=script&lang=js



/* harmony default export */ var contactvue_type_script_lang_js = ({
  name: "LemonContact",
  components: {},
  inject: {
    IMUI: {
      from: "IMUI",
      default: function _default() {
        return this;
      }
    }
  },
  data: function data() {
    return {};
  },
  props: {
    contact: Object,
    simple: Boolean,
    timeFormat: {
      type: Function,
      default: function _default(val) {
        return timeFormat(val, isToday(val) ? "h:i" : "y/m/d");
      }
    }
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    return h("div", {
      "class": ["lemon-contact", {
        "lemon-contact--name-center": this.simple
      }],
      "attrs": {
        "title": this.contact.displayName
      },
      "on": {
        "click": function click(e) {
          return _this._handleClick(e, _this.contact);
        }
      }
    }, [useScopedSlot(this.$scopedSlots.default, this._renderInner(), this.contact)]);
  },
  created: function created() {},
  mounted: function mounted() {},
  computed: {},
  watch: {},
  methods: {
    _renderInner: function _renderInner() {
      var h = this.$createElement;
      var contact = this.contact;
      return [h("lemon-badge", {
        "attrs": {
          "count": !this.simple ? contact.unread : 0
        },
        "class": "lemon-contact__avatar"
      }, [h("lemon-avatar", {
        "attrs": {
          "size": 40,
          "src": contact.avatar
        }
      })]), h("div", {
        "class": "lemon-contact__inner"
      }, [h("p", {
        "class": "lemon-contact__label"
      }, [h("span", {
        "class": "lemon-contact__name"
      }, [contact.displayName]), !this.simple && h("span", {
        "class": "lemon-contact__time"
      }, [this.timeFormat(contact.lastSendTime)])]), !this.simple && h("p", {
        "class": "lemon-contact__content"
      }, [isString(contact.lastContent) ? h("span", helper_default()([{}, {
        "domProps": {
          innerHTML: contact.lastContent
        }
      }])) : contact.lastContent])])];
    },
    _handleClick: function _handleClick(e, data) {
      this.$emit("click", data);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/contact.vue?vue&type=script&lang=js
 /* harmony default export */ var components_contactvue_type_script_lang_js = (contactvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/contact.vue?vue&type=style&index=0&id=6d9458c0&prod&lang=stylus
var contactvue_type_style_index_0_id_6d9458c0_prod_lang_stylus = __webpack_require__("8fb6");

// CONCATENATED MODULE: ./packages/components/contact.vue
var contact_render, contact_staticRenderFns





/* normalize component */

var contact_component = normalizeComponent(
  components_contactvue_type_script_lang_js,
  contact_render,
  contact_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components_contact = (contact_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.iterator.js
var es6_string_iterator = __webpack_require__("5df3");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.from.js
var es6_array_from = __webpack_require__("1c4c");

// EXTERNAL MODULE: ./node_modules/chatarea/lib/ChatArea.js
var ChatArea = __webpack_require__("9204");

// CONCATENATED MODULE: ./node_modules/chatarea/index.js

const chatarea_ChatArea = window.ChatArea
/* harmony default export */ var chatarea = (chatarea_ChatArea);
// EXTERNAL MODULE: ./node_modules/chatarea/lib/ChatArea.css
var lib_ChatArea = __webpack_require__("6fb5");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/editor.vue?vue&type=script&lang=js












function editorvue_type_script_lang_js_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function editorvue_type_script_lang_js_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? editorvue_type_script_lang_js_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : editorvue_type_script_lang_js_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }


// 引入css样式

var command = function command(_command, val) {
  document.execCommand(_command, false, val);
};
var selection = window.getSelection();
var range;
var emojiData = [];
var isInitTool = false;
/* harmony default export */ var editorvue_type_script_lang_js = ({
  name: "LemonEditor",
  inject: {
    IMUI: {
      from: "IMUI",
      default: function _default() {
        return this;
      }
    }
  },
  components: {},
  props: {
    tools: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    sendText: {
      type: String,
      default: "发 送"
    },
    wrapKey: {
      type: Function,
      default: function _default(e) {
        return e.keyCode == 13 && e.ctrlKey === true;
      }
    },
    sendKey: {
      type: Function,
      default: function _default(e) {
        return e.keyCode == 13 && e.ctrlKey == false && e.shiftKey == false;
      }
    }
  },
  data: function data() {
    this.clipboardBlob = null;
    return {
      //剪切板图片URL
      clipboardUrl: "",
      submitDisabled: true,
      //proxyTools: [],
      accept: "",
      chatArea: null
    };
  },
  created: function created() {
    var _this = this;
    this.IMUI.$on("change-contact", function () {
      _this.closeClipboardImage();
    });
    this.$nextTick(function () {
      _this.chatArea = new chatarea({
        elm: _this.$refs.textarea,
        // 从dom上抓取一个元素将其改造
        userList: [
          // 当输入@键时弹出人员选择的列表
        ],
        userProps: {
          // 人员列表数据结构 转接差异key值
          id: "id",
          name: "displayName",
          avatar: "avatar",
          pinyin: "name_py"
        },
        placeholder: "",
        needCallSpace: true,
        wrapKeyFun: function wrapKeyFun(event) {
          return _this.wrapKey(event);
        },
        sendKeyFun: function sendKeyFun(event) {
          return _this.sendKey(event);
        }
      });
      _this.chatArea.revisePCCheckDialogLabel({
        title: '选择要@的人',
        searchPlaceholder: '搜素人员名称',
        searchEmptyLabel: '没有匹配到任何结果',
        userTagTitle: '成员列表',
        checkAllLabel: '全选',
        confirmLabel: '确定',
        cancelLabel: '取消'
      });
      _this.chatArea.richText.addEventListener("blur", function (e) {
        setTimeout(_this.chatArea.winClick, 200);
      });
      _this.chatArea.richText.addEventListener("drop", function (e) {
        var dataTransfer = e.dataTransfer;
        var files = dataTransfer.files;
        Array.from(files).forEach(function (file) {
          _this.$emit("upload", file);
        });
      });
      // 监听发送键
      _this.chatArea.enterSend = function () {
        // 在此处执行你对发送消息的处理
        if (_this.submitDisabled == false) {
          _this._handleSend();
        }
      };
    });
  },
  render: function render() {
    var _this2 = this;
    var h = arguments[0];
    var toolLeft = [];
    var toolRight = [];
    this.proxyTools.forEach(function (_ref) {
      var name = _ref.name,
        title = _ref.title,
        render = _ref.render,
        click = _ref.click,
        isRight = _ref.isRight;
      click = click || new Function();
      var classes = ["lemon-editor__tool-item", {
        "lemon-editor__tool-item--right": isRight
      }];
      var node;
      if (name == "emoji") {
        node = emojiData.length == 0 ? "" : h("lemon-popover", {
          "class": "lemon-editor__emoji"
        }, [h("template", {
          "slot": "content"
        }, [_this2._renderEmojiTabs()]), h("div", {
          "class": classes,
          "attrs": {
            "title": title
          }
        }, [render()])]);
      } else {
        node = h("div", {
          "class": classes,
          "on": {
            "click": click
          },
          "attrs": {
            "title": title
          }
        }, [render()]);
      }
      if (isRight) {
        toolRight.push(node);
      } else {
        toolLeft.push(node);
      }
    });
    return h("div", {
      "class": "lemon-editor"
    }, [this.clipboardUrl && h("div", {
      "class": "lemon-editor__clipboard-image"
    }, [h("img", {
      "attrs": {
        "src": this.clipboardUrl
      }
    }), h("div", [h("lemon-button", {
      "style": {
        marginRight: "10px"
      },
      "on": {
        "click": this.closeClipboardImage
      },
      "attrs": {
        "color": "grey"
      }
    }, ["\u53D6\u6D88"]), h("lemon-button", {
      "on": {
        "click": this.sendClipboardImage
      }
    }, ["\u53D1\u9001\u56FE\u7247"])])]), h("input", {
      "style": "display:none",
      "attrs": {
        "type": "file",
        "multiple": "multiple",
        "accept": this.accept
      },
      "ref": "fileInput",
      "on": {
        "change": this._handleChangeFile
      }
    }), h("div", {
      "class": "lemon-editor__tool"
    }, [h("div", {
      "class": "lemon-editor__tool-left"
    }, [toolLeft]), h("div", {
      "class": "lemon-editor__tool-right"
    }, [toolRight])]), h("div", {
      "class": "lemon-editor__inner"
    }, [h("div", {
      "class": "lemon-editor__input",
      "ref": "textarea",
      "on": {
        "keyup": this._handleKeyup,
        "keydown": this._handleKeydown,
        "paste": this._handlePaste,
        "click": this._handleClick,
        "input": this._handleInput
      },
      "attrs": {
        "spellcheck": "false"
      }
    })]), h("div", {
      "class": "lemon-editor__footer"
    }, [h("div", {
      "class": "lemon-editor__tip"
    }, [useScopedSlot(this.IMUI.$scopedSlots["editor-footer"], "使用 ctrl + enter 换行")]), h("div", {
      "class": "lemon-editor__submit"
    }, [h("lemon-button", {
      "attrs": {
        "disabled": this.submitDisabled
      },
      "on": {
        "click": this._handleSend
      }
    }, [this.sendText])])])]);
  },
  computed: {
    proxyTools: function proxyTools() {
      var _this3 = this;
      var h = this.$createElement;
      if (!this.tools) return [];
      var defaultTools = [{
        name: "emoji",
        title: "表情",
        click: null,
        render: function render(menu) {
          return h("i", {
            "class": "lemon-icon-emoji"
          });
        }
      }, {
        name: "uploadFile",
        title: "文件上传",
        click: function click() {
          return _this3.selectFile("*");
        },
        render: function render(menu) {
          return h("i", {
            "class": "lemon-icon-folder"
          });
        }
      }, {
        name: "uploadImage",
        title: "图片上传",
        click: function click() {
          return _this3.selectFile("image/*");
        },
        render: function render(menu) {
          return h("i", {
            "class": "lemon-icon-image"
          });
        }
      }];
      var tools = [];
      if (Array.isArray(this.tools)) {
        var indexMap = {
          emoji: 0,
          uploadFile: 1,
          uploadImage: 2
        };
        var indexKeys = Object.keys(indexMap);
        tools = this.tools.map(function (item) {
          if (indexKeys.includes(item.name)) {
            return editorvue_type_script_lang_js_objectSpread(editorvue_type_script_lang_js_objectSpread({}, defaultTools[indexMap[item.name]]), item);
          }
          return item;
        });
      } else {
        tools = defaultTools;
      }
      return tools;
    }
  },
  methods: {
    closeClipboardImage: function closeClipboardImage() {
      this.clipboardUrl = "";
      this.clipboardBlob = null;
    },
    sendClipboardImage: function sendClipboardImage() {
      if (!this.clipboardBlob) return;
      this.$emit("upload", this.clipboardBlob);
      this.closeClipboardImage();
    },
    saveRangeToLast: function saveRangeToLast() {
      if (!range) {
        range = document.createRange();
      }
      range.selectNodeContents(textarea.value);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    },
    inertContent: function inertContent(val) {
      var toLast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (toLast) saveRangeToLast();
      this.focusRange();
      command("insertHTML", val);
      this.saveRange();
    },
    saveRange: function saveRange() {
      range = selection.getRangeAt(0);
    },
    focusRange: function focusRange() {
      this.$refs.textarea.focus();
      if (range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    },
    _handleClick: function _handleClick() {
      this.saveRange();
    },
    _handleInput: function _handleInput() {
      this._checkSubmitDisabled();
    },
    _renderEmojiTabs: function _renderEmojiTabs() {
      var _this4 = this;
      var h = this.$createElement;
      var renderImageGrid = function renderImageGrid(items) {
        return items.map(function (item) {
          return h("img", {
            "attrs": {
              "src": item.src,
              "title": item.title
            },
            "class": "lemon-editor__emoji-item",
            "on": {
              "click": function click() {
                return _this4._handleSelectEmoji(item);
              }
            }
          });
        });
      };
      if (emojiData[0].label) {
        var nodes = emojiData.map(function (item, index) {
          return h("div", {
            "slot": "tab-pane",
            "attrs": {
              "index": index,
              "tab": item.label
            }
          }, [renderImageGrid(item.children)]);
        });
        return h("lemon-tabs", {
          "style": "width: 412px"
        }, [nodes]);
      } else {
        return h("div", {
          "class": "lemon-tabs-content",
          "style": "width:406px"
        }, [renderImageGrid(emojiData)]);
      }
    },
    _handleSelectEmoji: function _handleSelectEmoji(item) {
      this.chatArea.insertHtml("<img emoji-name=\"".concat(item.name, "\" src=\"").concat(item.src, "\"></img>"));
      this._checkSubmitDisabled();
    },
    selectFile: function () {
      var _selectFile = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(accept) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.accept = accept;
              _context.next = 3;
              return this.$nextTick();
            case 3:
              this.$refs.fileInput.click();
            case 4:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function selectFile(_x) {
        return _selectFile.apply(this, arguments);
      }
      return selectFile;
    }(),
    _handlePaste: function _handlePaste(e) {
      e.preventDefault();
      var clipboardData = e.clipboardData || window.clipboardData;
      var text = clipboardData.getData("Text");
      if (text) {
        this.submitDisabled = false;
      } else {
        var _this$_getClipboardBl = this._getClipboardBlob(clipboardData),
          blob = _this$_getClipboardBl.blob,
          blobUrl = _this$_getClipboardBl.blobUrl;
        this.clipboardBlob = blob;
        this.clipboardUrl = blobUrl;
      }
    },
    _getClipboardBlob: function _getClipboardBlob(clipboard) {
      var blob, blobUrl;
      for (var i = 0; i < clipboard.items.length; ++i) {
        if (clipboard.items[i].kind == "file" && clipboard.items[i].type.indexOf("image/") !== -1) {
          blob = clipboard.items[i].getAsFile();
          blobUrl = (window.URL || window.webkitURL).createObjectURL(blob);
        }
      }
      return {
        blob: blob,
        blobUrl: blobUrl
      };
    },
    _handleKeyup: function _handleKeyup(e) {
      this.saveRange();
      this._checkSubmitDisabled();
    },
    _handleKeydown: function _handleKeydown(e) {
      if (e.keyCode == 13 || e.keyCode == 13 && e.shiftKey) {
        e.preventDefault();
      }
      if (this.wrapKey(e)) {
        e.preventDefault();
        command("insertLineBreak");
      }
    },
    getFormatValue: function getFormatValue() {
      return this.IMUI.emojiImageToName(this.chatArea.getHtml({
        needUserId: true
      }));
    },
    _checkSubmitDisabled: function _checkSubmitDisabled() {
      this.submitDisabled = !clearHtmlExcludeImg(this.chatArea.getHtml().trim());
    },
    _handleSend: function _handleSend(e) {
      var text = this.getFormatValue();
      this.$emit("send", text);
      this.clear();
      this._checkSubmitDisabled();
    },
    _handleChangeFile: function _handleChangeFile(e) {
      var _this5 = this;
      var fileInput = this.$refs.fileInput;
      Array.from(fileInput.files).forEach(function (file) {
        _this5.$emit("upload", file);
      });
      fileInput.value = "";
    },
    clear: function clear() {
      this.chatArea.clear();
    },
    initEmoji: function initEmoji(data) {
      emojiData = data;
      this.$forceUpdate();
    },
    setValue: function setValue(val) {
      if (val == '') {
        this.clear();
      } else {
        this.chatArea.reverseAnalysis(this.IMUI.emojiNameToImage(val));
      }
      this._checkSubmitDisabled();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/editor.vue?vue&type=script&lang=js
 /* harmony default export */ var components_editorvue_type_script_lang_js = (editorvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/editor.vue?vue&type=style&index=0&id=2ac8dde4&prod&lang=stylus
var editorvue_type_style_index_0_id_2ac8dde4_prod_lang_stylus = __webpack_require__("bd33");

// CONCATENATED MODULE: ./packages/components/editor.vue
var editor_render, editor_staticRenderFns





/* normalize component */

var editor_component = normalizeComponent(
  components_editorvue_type_script_lang_js,
  editor_render,
  editor_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var editor = (editor_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/messages.vue?vue&type=script&lang=js









/* harmony default export */ var messagesvue_type_script_lang_js = ({
  name: "LemonMessages",
  components: {},
  props: {
    //是否隐藏消息发送人昵称
    hideName: Boolean,
    //是否隐藏显示消息时间
    hideTime: Boolean,
    reverseUserId: [String, Number],
    timeRange: {
      type: Number,
      default: 1
    },
    timeFormat: {
      type: Function,
      default: function _default(val) {
        return hoursTimeFormat(val);
      }
    },
    loadingText: {
      type: [String, Function]
    },
    loadendText: {
      type: [String, Function],
      default: "暂无更多消息"
    },
    messages: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    this._lockScroll = false;
    return {
      _loading: false,
      _loadend: false,
      isBottom: true
    };
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    return h("div", {
      "class": "lemon-messages",
      "ref": "wrap",
      "on": {
        "scroll": this._handleScroll
      }
    }, [h("div", {
      "class": ["lemon-messages__load", "lemon-messages__load--".concat(this._loadend ? "end" : "ing")]
    }, [h("span", {
      "class": "lemon-messages__loadend"
    }, [isString(this.loadendText) ? this.loadendText : this.loadendText()]), h("span", {
      "class": "lemon-messages__loading"
    }, [this.loadingText ? isString(this.loadingText) ? this.loadingText : this.loadingText() : h("i", {
      "class": "lemon-icon-loading lemonani-spin"
    })])]), this.messages.map(function (message, index) {
      var node = [];
      var tagName = "lemon-message-".concat(message.type);
      var msgComponet = _this.toCamelCase(tagName);
      if (!_this.$options.components[msgComponet]) {
        message.type = "text";
        message.content = "[暂不支持的消息类型]";
        tagName = "lemon-message-text";
      }
      var prev = _this.messages[index - 1];
      if (prev && _this.msecRange && message.sendTime - prev.sendTime > _this.msecRange) {
        node.push(h("lemon-message-event", helper_default()([{}, {
          "attrs": {
            message: {
              id: "__time__",
              type: "event",
              content: hoursTimeFormat(message.sendTime)
            }
          }
        }])));
      }
      var attrs;
      if (message.type == "event") {
        attrs = {
          message: message
        };
      } else {
        attrs = {
          timeFormat: _this.timeFormat,
          message: message,
          reverse: _this.reverseUserId == message.fromUser.id,
          hideTime: _this.hideTime,
          hideName: _this.hideName
        };
      }
      node.push(h(tagName, helper_default()([{
        "ref": "message",
        "refInFor": true
      }, {
        "attrs": attrs
      }])));
      return node;
    })]);
  },
  computed: {
    msecRange: function msecRange() {
      return this.timeRange * 1000 * 60;
    }
  },
  watch: {},
  methods: {
    loaded: function loaded() {
      this._loadend = true;
      this.$forceUpdate();
    },
    toCamelCase: function toCamelCase(str) {
      return str.replace(/-([a-z])/g, function (g, letter) {
        return letter.toUpperCase();
      });
    },
    resetLoadState: function resetLoadState() {
      var _this2 = this;
      this._lockScroll = true;
      this._loading = false;
      this._loadend = false;
      setTimeout(function () {
        _this2._lockScroll = false;
      }, 200);
    },
    _handleScroll: function () {
      var _handleScroll2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
        var _this3 = this;
        var target, hst, scrollTop, contentHeight, wrap;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this._lockScroll) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              target = e.target;
              contextmenu.hide();
              if (!(target.scrollTop == 0 && this._loading == false && this._loadend == false)) {
                _context2.next = 10;
                break;
              }
              this._loading = true;
              _context2.next = 8;
              return this.$nextTick();
            case 8:
              hst = target.scrollHeight;
              this.$emit("reach-top", /*#__PURE__*/function () {
                var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(isEnd) {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _this3.$nextTick();
                      case 2:
                        target.scrollTop = target.scrollHeight - hst;
                        _this3._loading = false;
                        _this3._loadend = !!isEnd;
                      case 5:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                }));
                return function (_x2) {
                  return _ref.apply(this, arguments);
                };
              }());
            case 10:
              // 当前滚动条垂直位置
              scrollTop = target.scrollTop; // 内容高度
              contentHeight = target.scrollHeight;
              wrap = this.$refs.wrap; // 多预留20px
              this.isBottom = scrollTop + wrap.offsetHeight >= contentHeight - 20 ? true : false;
              this.$emit("is-bottom", this.isBottom);
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function _handleScroll(_x) {
        return _handleScroll2.apply(this, arguments);
      }
      return _handleScroll;
    }(),
    scrollToBottom: function () {
      var _scrollToBottom = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var wrap;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.$nextTick();
            case 2:
              wrap = this.$refs.wrap;
              if (wrap) {
                wrap.scrollTop = wrap.scrollHeight;
              }
            case 4:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function scrollToBottom() {
        return _scrollToBottom.apply(this, arguments);
      }
      return scrollToBottom;
    }()
  },
  created: function created() {},
  mounted: function mounted() {}
});
// CONCATENATED MODULE: ./packages/components/messages.vue?vue&type=script&lang=js
 /* harmony default export */ var components_messagesvue_type_script_lang_js = (messagesvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/messages.vue?vue&type=style&index=0&id=0e79532a&prod&lang=stylus
var messagesvue_type_style_index_0_id_0e79532a_prod_lang_stylus = __webpack_require__("ed7d");

// CONCATENATED MODULE: ./packages/components/messages.vue
var messages_render, messages_staticRenderFns





/* normalize component */

var messages_component = normalizeComponent(
  components_messagesvue_type_script_lang_js,
  messages_render,
  messages_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var messages = (messages_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/message/basic.vue?vue&type=script&lang=js

/* harmony default export */ var basicvue_type_script_lang_js = ({
  name: "lemonMessageBasic",
  inject: {
    IMUI: {
      from: "IMUI",
      default: function _default() {
        return this;
      }
    }
  },
  props: {
    contextmenu: Array,
    message: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    timeFormat: {
      type: Function,
      default: function _default() {
        return "";
      }
    },
    reverse: Boolean,
    hideName: Boolean,
    hideTime: Boolean
  },
  data: function data() {
    return {};
  },
  render: function render() {
    var _this = this;
    var h = arguments[0];
    var _this$message = this.message,
      fromUser = _this$message.fromUser,
      status = _this$message.status,
      sendTime = _this$message.sendTime;
    var hideTitle = this.hideName == true && this.hideTime == true;
    return h("div", {
      "class": ["lemon-message", "lemon-message--status-".concat(status), {
        "lemon-message--reverse": this.reverse,
        "lemon-message--hide-title": hideTitle
      }]
    }, [h("div", {
      "class": "lemon-message__avatar"
    }, [h("lemon-avatar", {
      "attrs": {
        "size": 36,
        "shape": "square",
        "src": fromUser.avatar
      },
      "on": {
        "click": function click(e) {
          _this._emitClick(e, "avatar");
        }
      }
    })]), h("div", {
      "class": "lemon-message__inner"
    }, [h("div", {
      "class": "lemon-message__title"
    }, [this.hideName == false && h("span", {
      "on": {
        "click": function click(e) {
          _this._emitClick(e, "displayName");
        }
      }
    }, [fromUser.displayName]), this.hideTime == false && h("span", {
      "class": "lemon-message__time",
      "on": {
        "click": function click(e) {
          _this._emitClick(e, "sendTime");
        }
      }
    }, [this.timeFormat(sendTime)])]), h("div", {
      "class": "lemon-message__content-flex"
    }, [h("div", {
      "directives": [{
        name: "lemon-contextmenu",
        value: this.IMUI.contextmenu,
        modifiers: {
          "message": true
        }
      }],
      "class": "lemon-message__content",
      "on": {
        "click": function click(e) {
          _this._emitClick(e, "content");
        }
      }
    }, [useScopedSlot(this.$scopedSlots["content"], null, this.message)]), h("div", {
      "class": "lemon-message__content-after"
    }, [useScopedSlot(this.IMUI.$scopedSlots["message-after"], null, this.message)]), h("div", {
      "class": "lemon-message__status",
      "on": {
        "click": function click(e) {
          _this._emitClick(e, "status");
        }
      }
    }, [h("i", {
      "class": "lemon-icon-loading lemonani-spin"
    }), h("i", {
      "class": "lemon-icon-prompt",
      "attrs": {
        "title": "重发消息"
      },
      "style": {
        color: "#ff2525",
        cursor: "pointer"
      }
    })])])])]);
  },
  created: function created() {},
  mounted: function mounted() {},
  computed: {},
  watch: {},
  methods: {
    _emitClick: function _emitClick(e, key) {
      this.IMUI.$emit("message-click", e, key, this.message, this.IMUI);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/message/basic.vue?vue&type=script&lang=js
 /* harmony default export */ var message_basicvue_type_script_lang_js = (basicvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/message/basic.vue?vue&type=style&index=0&id=728e23e7&prod&lang=stylus
var basicvue_type_style_index_0_id_728e23e7_prod_lang_stylus = __webpack_require__("4c77");

// CONCATENATED MODULE: ./packages/components/message/basic.vue
var basic_render, basic_staticRenderFns





/* normalize component */

var basic_component = normalizeComponent(
  message_basicvue_type_script_lang_js,
  basic_render,
  basic_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var basic = (basic_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/message/text.vue?vue&type=script&lang=js







function textvue_type_script_lang_js_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function textvue_type_script_lang_js_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? textvue_type_script_lang_js_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : textvue_type_script_lang_js_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/* harmony default export */ var textvue_type_script_lang_js = ({
  name: "lemonMessageText",
  inheritAttrs: false,
  inject: ["IMUI"],
  render: function render() {
    var _this = this;
    var h = arguments[0];
    return h("lemon-message-basic", helper_default()([{
      "class": "lemon-message-text"
    }, {
      "props": textvue_type_script_lang_js_objectSpread({}, this.$attrs)
    }, {
      "scopedSlots": {
        content: function content(props) {
          var content = _this.IMUI.emojiNameToImage(props.content);
          return h("span", helper_default()([{}, {
            "domProps": {
              innerHTML: content
            }
          }]));
        }
      }
    }]));
  }
});
// CONCATENATED MODULE: ./packages/components/message/text.vue?vue&type=script&lang=js
 /* harmony default export */ var message_textvue_type_script_lang_js = (textvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/message/text.vue?vue&type=style&index=0&id=fc6d50a4&prod&lang=stylus
var textvue_type_style_index_0_id_fc6d50a4_prod_lang_stylus = __webpack_require__("5778");

// CONCATENATED MODULE: ./packages/components/message/text.vue
var text_render, text_staticRenderFns





/* normalize component */

var text_component = normalizeComponent(
  message_textvue_type_script_lang_js,
  text_render,
  text_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var message_text = (text_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/message/image.vue?vue&type=script&lang=js






function imagevue_type_script_lang_js_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function imagevue_type_script_lang_js_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? imagevue_type_script_lang_js_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : imagevue_type_script_lang_js_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/* harmony default export */ var imagevue_type_script_lang_js = ({
  name: "lemonMessageImage",
  inheritAttrs: false,
  render: function render() {
    var h = arguments[0];
    return h("lemon-message-basic", helper_default()([{
      "class": "lemon-message-image"
    }, {
      "props": imagevue_type_script_lang_js_objectSpread({}, this.$attrs)
    }, {
      "scopedSlots": {
        content: function content(props) {
          return h("img", {
            "attrs": {
              "src": props.content
            }
          });
        }
      }
    }]));
  }
});
// CONCATENATED MODULE: ./packages/components/message/image.vue?vue&type=script&lang=js
 /* harmony default export */ var message_imagevue_type_script_lang_js = (imagevue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/message/image.vue?vue&type=style&index=0&id=f4dd6b2a&prod&lang=stylus
var imagevue_type_style_index_0_id_f4dd6b2a_prod_lang_stylus = __webpack_require__("e61c");

// CONCATENATED MODULE: ./packages/components/message/image.vue
var image_render, image_staticRenderFns





/* normalize component */

var image_component = normalizeComponent(
  message_imagevue_type_script_lang_js,
  image_render,
  image_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var message_image = (image_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/message/file.vue?vue&type=script&lang=js






function filevue_type_script_lang_js_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function filevue_type_script_lang_js_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? filevue_type_script_lang_js_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : filevue_type_script_lang_js_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }

/* harmony default export */ var filevue_type_script_lang_js = ({
  name: "lemonMessageFile",
  inheritAttrs: false,
  render: function render() {
    var h = arguments[0];
    return h("lemon-message-basic", helper_default()([{
      "class": "lemon-message-file"
    }, {
      "props": filevue_type_script_lang_js_objectSpread({}, this.$attrs)
    }, {
      "scopedSlots": {
        content: function content(props) {
          return [h("div", {
            "class": "lemon-message-file__inner"
          }, [h("p", {
            "class": "lemon-message-file__name"
          }, [props.fileName]), h("p", {
            "class": "lemon-message-file__byte"
          }, [formatByte(props.fileSize)])]), h("div", {
            "class": "lemon-message-file__sfx"
          }, [h("i", {
            "class": "lemon-icon-attah"
          })])];
        }
      }
    }]));
  }
});
// CONCATENATED MODULE: ./packages/components/message/file.vue?vue&type=script&lang=js
 /* harmony default export */ var message_filevue_type_script_lang_js = (filevue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/message/file.vue?vue&type=style&index=0&id=29a0badd&prod&lang=stylus
var filevue_type_style_index_0_id_29a0badd_prod_lang_stylus = __webpack_require__("85ff");

// CONCATENATED MODULE: ./packages/components/message/file.vue
var file_render, file_staticRenderFns





/* normalize component */

var file_component = normalizeComponent(
  message_filevue_type_script_lang_js,
  file_render,
  file_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var file = (file_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/message/event.vue?vue&type=script&lang=js
/* harmony default export */ var eventvue_type_script_lang_js = ({
  name: "lemonMessageEvent",
  inheritAttrs: false,
  inject: ["IMUI"],
  render: function render() {
    var _this = this;
    var h = arguments[0];
    var content = this.$attrs.message.content;
    return h("div", {
      "class": "lemon-message lemon-message-event"
    }, [h("span", {
      "class": "lemon-message-event__content",
      "on": {
        "click": function click(e) {
          return _this._emitClick(e, "content");
        }
      }
    }, [content])]);
  },
  methods: {
    _emitClick: function _emitClick(e, key) {
      this.IMUI.$emit("message-click", e, key, this.$attrs.message, this.IMUI);
    }
  }
});
// CONCATENATED MODULE: ./packages/components/message/event.vue?vue&type=script&lang=js
 /* harmony default export */ var message_eventvue_type_script_lang_js = (eventvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/message/event.vue?vue&type=style&index=0&id=484db2b4&prod&lang=stylus
var eventvue_type_style_index_0_id_484db2b4_prod_lang_stylus = __webpack_require__("dcc3");

// CONCATENATED MODULE: ./packages/components/message/event.vue
var event_render, event_staticRenderFns





/* normalize component */

var event_component = normalizeComponent(
  message_eventvue_type_script_lang_js,
  event_render,
  event_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var message_event = (event_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("20d6");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js




function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.starts-with.js
var es6_string_starts_with = __webpack_require__("f559");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.sort.js
var es6_array_sort = __webpack_require__("55dd");

// CONCATENATED MODULE: ./packages/utils/constant.js
var EMIT_AVATAR_CLICK = "avatar-click";
var DEFAULT_MENU_LASTMESSAGES = "messages";
var DEFAULT_MENU_CONTACTS = "contacts";
var DEFAULT_MENUS = [DEFAULT_MENU_LASTMESSAGES, DEFAULT_MENU_CONTACTS];
/**
 * 聊天消息类型
 */
var MESSAGE_TYPE = ["voice", "file", "video", "image", "text"];

/**
 * 聊天消息状态
 */
var MESSAGE_STATUS = ["going", "succeed", "failed"];
var CONTACT_TYPE = ["many", "single"];
// CONCATENATED MODULE: ./packages/lastContentRender.js

/* harmony default export */ var packages_lastContentRender = ({
  file: function file(message) {
    return "[文件]";
  },
  image: function image(message) {
    return "[图片]";
  },
  text: function text(message) {
    return this.emojiNameToImage(clearHtmlExcludeImg(message.content));
  },
  event: function event(message) {
    return '[通知]';
  }
});
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
// CONCATENATED MODULE: ./packages/utils/cache/memory.js


var memory_MemoryCache = /*#__PURE__*/function () {
  function MemoryCache() {
    _classCallCheck(this, MemoryCache);
    this.table = {};
  }
  _createClass(MemoryCache, [{
    key: "get",
    value: function get(key) {
      return key ? this.table[key] : this.table;
    }
  }, {
    key: "set",
    value: function set(key, val) {
      this.table[key] = val;
    }
    // setOnly(key, val) {
    //   if (!this.has(key)) this.set(key, val);
    // }
  }, {
    key: "remove",
    value: function remove(key) {
      if (key) {
        delete this.table[key];
      } else {
        this.table = {};
      }
    }
  }, {
    key: "has",
    value: function has(key) {
      return !!this.table[key];
    }
  }]);
  return MemoryCache;
}();

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./packages/components/index.vue?vue&type=script&lang=js



















function componentsvue_type_script_lang_js_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function componentsvue_type_script_lang_js_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? componentsvue_type_script_lang_js_ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : componentsvue_type_script_lang_js_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }






var allMessages = {};
var emojiMap = {};
var componentsvue_type_script_lang_js_toPx = function toPx(val) {
  return isString(val) ? val : "".concat(val, "px");
};
var toPoint = function toPoint(str) {
  return str.replace("%", "") / 100;
};
var renderDrawerContent = function renderDrawerContent() {};
/* harmony default export */ var componentsvue_type_script_lang_js = ({
  name: "LemonImui",
  provide: function provide() {
    return {
      IMUI: this
    };
  },
  props: {
    width: {
      type: [String, Number],
      default: 850
    },
    height: {
      type: [String, Number],
      default: 580
    },
    theme: {
      type: String,
      default: "default"
    },
    simple: {
      type: Boolean,
      default: false
    },
    loadingText: [String, Function],
    loadendText: [String, Function],
    /**
     * 消息时间格式化规则
     */
    messageTimeFormat: Function,
    /**
     * 联系人最新消息时间格式化规则
     */
    contactTimeFormat: Function,
    /**
     * 初始化时是否隐藏抽屉
     */
    hideDrawer: {
      type: Boolean,
      default: true
    },
    /**
     * 是否隐藏导航按钮上的头像
     */
    hideMenuAvatar: Boolean,
    hideMenu: Boolean,
    /**
     * 是否隐藏消息列表内的联系人名字
     */
    hideMessageName: Boolean,
    /**
     * 是否隐藏消息列表内的发送时间
     */
    hideMessageTime: Boolean,
    sendKey: Function,
    wrapKey: Function,
    sendText: String,
    contextmenu: Array,
    contactContextmenu: Array,
    avatarCricle: Boolean,
    user: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    latelyContacts: {
      type: Function,
      default: function _default(list) {
        var data = list.filter(function (item) {
          return !isEmpty(item.lastContent);
        });
        data.sort(function (a1, a2) {
          return a2.lastSendTime - a1.lastSendTime;
        });
        return data;
      }
    }
  },
  data: function data() {
    this.CacheContactContainer = new memory_MemoryCache();
    this.CacheMenuContainer = new memory_MemoryCache();
    this.CacheMessageLoaded = new memory_MemoryCache();
    this.CacheDraft = new memory_MemoryCache();
    return {
      drawerVisible: !this.hideDrawer,
      currentContactId: null,
      // 消息菜单下当前联系人
      currentContactIdSidebarContact: null,
      // 联系人菜单下当前联系人
      currentMessages: [],
      activeSidebar: DEFAULT_MENU_LASTMESSAGES,
      contacts: [],
      menus: [],
      editorTools: [{
        name: "emoji"
      }, {
        name: "uploadFile"
      }, {
        name: "uploadImage"
      }]
    };
  },
  render: function render() {
    return this._renderWrapper([this._renderMenu(), this._renderSidebarMessage(), this._renderSidebarContact(), this._renderContainer(), this._renderDrawer()]);
  },
  created: function created() {
    this.initMenus();
  },
  mounted: function () {
    var _mounted = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return this.$nextTick();
          case 2:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
    function mounted() {
      return _mounted.apply(this, arguments);
    }
    return mounted;
  }(),
  computed: {
    currentContact: function currentContact() {
      var _this = this;
      return this.contacts.find(function (item) {
        return item.id == _this.currentContactId;
      }) || {};
    },
    currentContactSidebarContact: function currentContactSidebarContact() {
      var _this2 = this;
      return this.contacts.find(function (item) {
        return item.id == _this2.currentContactIdSidebarContact;
      }) || {};
    },
    currentMenu: function currentMenu() {
      var _this3 = this;
      return this.menus.find(function (item) {
        return item.name == _this3.activeSidebar;
      }) || {};
    },
    currentIsDefSidebar: function currentIsDefSidebar() {
      return DEFAULT_MENUS.includes(this.activeSidebar);
    },
    lastMessages: function lastMessages() {
      return this.latelyContacts(this.contacts);
    }
  },
  watch: {
    activeSidebar: function activeSidebar() {}
  },
  methods: {
    _menuIsContacts: function _menuIsContacts() {
      return this.activeSidebar == DEFAULT_MENU_CONTACTS;
    },
    _menuIsMessages: function _menuIsMessages() {
      return this.activeSidebar == DEFAULT_MENU_LASTMESSAGES;
    },
    _createMessage: function _createMessage(message) {
      return componentsvue_type_script_lang_js_objectSpread(componentsvue_type_script_lang_js_objectSpread({}, {
        id: generateUUID(),
        type: "text",
        status: "going",
        sendTime: new Date().getTime(),
        toContactId: this.currentContactId,
        fromUser: componentsvue_type_script_lang_js_objectSpread({}, this.user)
      }), message);
    },
    /**
     * 新增一条消息
     */
    appendMessage: function appendMessage(message) {
      var scrollToBottom = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var unread = "+1";
      var messageList = allMessages[message.toContactId];
      // 如果是自己的消息需要push，发送的消息不再增加未读条数
      if (message.type == 'event' || this.user.id == message.fromUser.id) unread = "+0";
      if (messageList === undefined) {
        this.updateContact({
          id: message.toContactId,
          unread: unread,
          lastSendTime: message.sendTime,
          lastContent: this.lastContentRender(message)
        });
      } else {
        // 如果消息存在则不再添加
        var hasMsg = messageList.some(function (_ref) {
          var id = _ref.id;
          return id == message.id;
        });
        if (hasMsg) return;
        this._addMessage(message, message.toContactId, 1);
        var updateContact = {
          id: message.toContactId,
          lastContent: this.lastContentRender(message),
          lastSendTime: message.sendTime
        };
        if (message.toContactId == this.currentContactId) {
          if (scrollToBottom == true) {
            this.messageViewToBottom();
          }
          this.CacheDraft.remove(message.toContactId);
        } else {
          updateContact.unread = unread;
        }
        this.updateContact(updateContact);
      }
    },
    _emitSend: function _emitSend(message, next, file) {
      var _this4 = this;
      this.$emit("send", message, function () {
        var replaceMessage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
          status: "succeed"
        };
        next();
        _this4.updateMessage(Object.assign(message, replaceMessage));
      }, file);
    },
    _handleSend: function _handleSend(text) {
      var _this5 = this;
      var atUserList = this.$refs.editor.chatArea.getCallUserList();
      // 将数组中的id提取出来
      var atUserIds = atUserList.map(function (item) {
        return item.id;
      });
      var message = this._createMessage({
        content: text,
        at: atUserIds
      });
      this.appendMessage(message, true);
      this._emitSend(message, function () {
        _this5.updateContact({
          id: message.toContactId,
          lastContent: _this5.lastContentRender(message),
          lastSendTime: message.sendTime
        });
        _this5.CacheDraft.remove(message.toContactId);
      });
    },
    _handleUpload: function _handleUpload(file) {
      var _this6 = this;
      var imageTypes = ["image/gif", "image/jpeg", "image/png"];
      var joinMessage;
      if (imageTypes.includes(file.type)) {
        joinMessage = {
          type: "image",
          content: URL.createObjectURL(file)
        };
      } else {
        joinMessage = {
          type: "file",
          fileSize: file.size,
          fileName: file.name,
          content: ""
        };
      }
      var message = this._createMessage(joinMessage);
      this.appendMessage(message, true);
      this._emitSend(message, function () {
        _this6.updateContact({
          id: message.toContactId,
          lastContent: _this6.lastContentRender(message),
          lastSendTime: message.sendTime
        });
      }, file);
    },
    _emitPullMessages: function _emitPullMessages(next) {
      var _this7 = this;
      this._changeContactLock = true;
      this.$emit("pull-messages", this.currentContact, function () {
        var messages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var isEnd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        _this7._addMessage(messages, _this7.currentContactId, 0);
        _this7.CacheMessageLoaded.set(_this7.currentContactId, isEnd);
        if (isEnd == true) _this7.$refs.messages.loaded();
        _this7.updateCurrentMessages();
        _this7._changeContactLock = false;
        next(isEnd);
      }, this);
    },
    callIsBottom: function callIsBottom(isBottom) {
      this.$emit('is-bottom', isBottom);
    },
    clearCacheContainer: function clearCacheContainer(name) {
      this.CacheContactContainer.remove(name);
      this.CacheMenuContainer.remove(name);
    },
    _renderWrapper: function _renderWrapper(children) {
      var h = this.$createElement;
      return h("div", {
        "style": {
          width: componentsvue_type_script_lang_js_toPx(this.width),
          height: componentsvue_type_script_lang_js_toPx(this.height)
        },
        "ref": "wrapper",
        "class": ["lemon-wrapper", "lemon-wrapper--theme-".concat(this.theme), {
          "lemon-wrapper--simple": this.simple
        }, this.drawerVisible && "lemon-wrapper--drawer-show"]
      }, [children]);
    },
    _renderMenu: function _renderMenu() {
      var _this8 = this;
      var h = this.$createElement;
      var menuItem = this._renderMenuItem();
      return h("div", {
        "class": "lemon-menu",
        "directives": [{
          name: "show",
          value: !this.hideMenu
        }]
      }, [h("lemon-avatar", {
        "directives": [{
          name: "show",
          value: !this.hideMenuAvatar
        }],
        "on": {
          "click": function click(e) {
            _this8.$emit("menu-avatar-click", e);
          }
        },
        "class": "lemon-menu__avatar",
        "attrs": {
          "src": this.user.avatar
        }
      }), menuItem.top, this.$slots.menu, h("div", {
        "class": "lemon-menu__bottom"
      }, [this.$slots["menu-bottom"], menuItem.bottom])]);
    },
    _renderMenuAvatar: function _renderMenuAvatar() {
      return;
    },
    _renderMenuItem: function _renderMenuItem() {
      var _this9 = this;
      var h = this.$createElement;
      var top = [];
      var bottom = [];
      this.menus.forEach(function (item) {
        var name = item.name,
          title = item.title,
          unread = item.unread,
          render = item.render,
          _click = item.click;
        var node = h("div", {
          "class": ["lemon-menu__item", {
            "lemon-menu__item--active": _this9.activeSidebar == name
          }],
          "on": {
            "click": function click() {
              funCall(_click, function () {
                if (name) _this9.changeMenu(name);
              });
            }
          },
          "attrs": {
            "title": title
          }
        }, [h("lemon-badge", {
          "attrs": {
            "count": unread
          }
        }, [render(item)])]);
        item.isBottom === true ? bottom.push(node) : top.push(node);
      });
      return {
        top: top,
        bottom: bottom
      };
    },
    _renderSidebarMessage: function _renderSidebarMessage() {
      var _this10 = this;
      return this._renderSidebar([useScopedSlot(this.$scopedSlots["sidebar-message-top"], null, this), this.lastMessages.map(function (contact) {
        return _this10._renderContact({
          contact: contact,
          timeFormat: _this10.contactTimeFormat
        }, function () {
          return _this10.changeContact(contact.id);
        }, _this10.$scopedSlots["sidebar-message"]);
      })], DEFAULT_MENU_LASTMESSAGES, useScopedSlot(this.$scopedSlots["sidebar-message-fixedtop"], null, this));
    },
    _renderContact: function _renderContact(props, onClick, slot) {
      var _this11 = this;
      var h = this.$createElement;
      var _props$contact = props.contact,
        customClick = _props$contact.click,
        renderContainer = _props$contact.renderContainer,
        contactId = _props$contact.id;
      var click = function click() {
        funCall(customClick, function () {
          onClick();
          _this11._customContainerReady(renderContainer, _this11.CacheContactContainer, contactId);
        });
      };
      return h("lemon-contact", helper_default()([{
        "class": {
          "lemon-contact--active": this.activeSidebar == DEFAULT_MENU_CONTACTS ? this.currentContactIdSidebarContact == props.contact.id : this.currentContactId == props.contact.id
        },
        "directives": [{
          name: "lemon-contextmenu",
          value: this.contactContextmenu,
          modifiers: {
            "contact": true
          }
        }]
      }, {
        "props": props
      }, {
        "on": {
          "click": click
        },
        "scopedSlots": {
          default: slot
        }
      }]));
    },
    _renderSidebarContact: function _renderSidebarContact() {
      var _this12 = this;
      var h = this.$createElement;
      var prevIndex;
      return this._renderSidebar([useScopedSlot(this.$scopedSlots["sidebar-contact-top"], null, this), this.contacts.map(function (contact) {
        if (!contact.index) return;
        contact.index = contact.index.replace(/\[[0-9]*\]/, "");
        var node = [contact.index !== prevIndex && h("p", {
          "class": "lemon-sidebar__label"
        }, [contact.index]), _this12._renderContact({
          contact: contact,
          simple: true
        }, function () {
          _this12.changeContact(contact.id);
        }, _this12.$scopedSlots["sidebar-contact"])];
        prevIndex = contact.index;
        return node;
      })], DEFAULT_MENU_CONTACTS, useScopedSlot(this.$scopedSlots["sidebar-contact-fixedtop"], null, this));
    },
    _renderSidebar: function _renderSidebar(children, name, fixedtop) {
      var h = this.$createElement;
      return h("div", {
        "class": "lemon-sidebar",
        "directives": [{
          name: "show",
          value: this.activeSidebar == name
        }],
        "on": {
          "scroll": this._handleSidebarScroll
        }
      }, [h("div", {
        "class": "lemon-sidebar__fixed-top"
      }, [fixedtop]), h("div", {
        "class": "lemon-sidebar__scroll"
      }, [children])]);
    },
    _renderDrawer: function _renderDrawer() {
      var h = this.$createElement;
      return this._menuIsMessages() && this.currentContactId ? h("div", {
        "class": "lemon-drawer",
        "ref": "drawer"
      }, [renderDrawerContent(this.currentContact), useScopedSlot(this.$scopedSlots.drawer, "", this.currentContact)]) : "";
    },
    _isContactContainerCache: function _isContactContainerCache(name) {
      return name.startsWith("contact#");
    },
    _renderContainer: function _renderContainer() {
      var _this13 = this;
      var h = this.$createElement;
      var nodes = [];
      var cls = "lemon-container";
      var curact = this.activeSidebar == DEFAULT_MENU_CONTACTS ? this.currentContactSidebarContact : this.currentContact;
      var defIsShow = true;
      for (var name in this.CacheContactContainer.get()) {
        var show = curact.id == name && this.currentIsDefSidebar;
        if (show) defIsShow = !show;
        nodes.push(h("div", {
          "class": cls,
          "directives": [{
            name: "show",
            value: show
          }]
        }, [this.CacheContactContainer.get(name)]));
      }
      for (var _name2 in this.CacheMenuContainer.get()) {
        nodes.push(h("div", {
          "class": cls,
          "directives": [{
            name: "show",
            value: this.activeSidebar == _name2 && !this.currentIsDefSidebar
          }]
        }, [this.CacheMenuContainer.get(_name2)]));
      }
      nodes.push(h("div", {
        "class": cls,
        "directives": [{
          name: "show",
          value: this._menuIsMessages() && defIsShow && curact.id
        }]
      }, [h("div", {
        "class": "lemon-container__title"
      }, [useScopedSlot(this.$scopedSlots["message-title"], h("div", {
        "class": "lemon-container__displayname"
      }, [curact.displayName]), curact)]), h("div", {
        "class": "lemon-vessel"
      }, [h("div", {
        "class": "lemon-vessel__left"
      }, [h("lemon-messages", {
        "ref": "messages",
        "attrs": {
          "loading-text": this.loadingText,
          "loadend-text": this.loadendText,
          "hide-time": this.hideMessageTime,
          "hide-name": this.hideMessageName,
          "time-format": this.messageTimeFormat,
          "reverse-user-id": this.user.id,
          "messages": this.currentMessages
        },
        "on": {
          "reach-top": this._emitPullMessages,
          "is-bottom": this.callIsBottom
        }
      }), h("lemon-editor", {
        "ref": "editor",
        "attrs": {
          "tools": this.editorTools,
          "sendText": this.sendText,
          "sendKey": this.sendKey,
          "wrapKey": this.wrapKey
        },
        "on": {
          "send": this._handleSend,
          "upload": this._handleUpload
        }
      })]), h("div", {
        "class": "lemon-vessel__right"
      }, [useScopedSlot(this.$scopedSlots["message-side"], null, curact)])])]));
      nodes.push(h("div", {
        "class": cls,
        "directives": [{
          name: "show",
          value: !curact.id && this.currentIsDefSidebar
        }]
      }, [this.$slots.cover]));
      nodes.push(h("div", {
        "class": cls,
        "directives": [{
          name: "show",
          value: this._menuIsContacts() && defIsShow && curact.id
        }]
      }, [useScopedSlot(this.$scopedSlots["contact-info"], h("div", {
        "class": "lemon-contact-info"
      }, [h("lemon-avatar", {
        "attrs": {
          "src": curact.avatar,
          "size": 90
        }
      }), h("h4", [curact.displayName]), h("lemon-button", {
        "on": {
          "click": function click() {
            if (isEmpty(curact.lastContent)) {
              _this13.updateContact({
                id: curact.id,
                lastContent: " "
              });
            }
            _this13.changeContact(curact.id, DEFAULT_MENU_LASTMESSAGES);
          }
        }
      }, ["\u53D1\u9001\u6D88\u606F"])]), curact)]));
      return nodes;
    },
    _handleSidebarScroll: function _handleSidebarScroll() {
      contextmenu.hide();
    },
    _addContact: function _addContact(data, t) {
      var type = {
        0: "unshift",
        1: "push"
      }[t];
      this.contacts[type](data);
    },
    _addMessage: function _addMessage(data, contactId, t) {
      var _allMessages$contactI;
      var type = {
        0: "unshift",
        1: "push"
      }[t];
      if (!Array.isArray(data)) data = [data];
      allMessages[contactId] = allMessages[contactId] || [];
      (_allMessages$contactI = allMessages[contactId])[type].apply(_allMessages$contactI, _toConsumableArray(data));
    },
    /**
     * 设置最新消息DOM
     * @param {String} messageType 消息类型
     * @param {Function} render 返回消息 vnode
     */
    setLastContentRender: function setLastContentRender(messageType, render) {
      packages_lastContentRender[messageType] = render;
    },
    lastContentRender: function lastContentRender(message) {
      if (!isFunction(packages_lastContentRender[message.type])) {
        return "[不支持的消息类型]";
      }
      return packages_lastContentRender[message.type].call(this, message);
    },
    /**
     * 将字符串内的 EmojiItem.name 替换为 img
     * @param {String} str 被替换的字符串
     * @return {String} 替换后的字符串
     */
    emojiNameToImage: function emojiNameToImage(str) {
      return str.replace(/\[!(\w+)\]/gi, function (str, match) {
        var file = match;
        return emojiMap[file] ? "<img emoji-name=\"".concat(match, "\" src=\"").concat(emojiMap[file], "\" />") : "[!".concat(match, "]");
      });
    },
    emojiImageToName: function emojiImageToName(str) {
      return str.replace(/<img emoji-name=\"([^\"]*?)\" [^>]*>/gi, "[!$1]");
    },
    updateCurrentMessages: function updateCurrentMessages() {
      if (!allMessages[this.currentContactId]) allMessages[this.currentContactId] = [];
      this.currentMessages = allMessages[this.currentContactId];
    },
    /**
     * 将当前聊天窗口滚动到底部
     */
    messageViewToBottom: function messageViewToBottom() {
      this.$refs.messages.scrollToBottom();
    },
    /**
     * 设置联系人的草稿信息
     */
    setDraft: function setDraft(cid, editorValue) {
      if (isEmpty(cid) || isEmpty(editorValue)) return false;
      var contact = this.findContact(cid);
      var lastContent = contact.lastContent;
      if (isEmpty(contact)) return false;
      if (this.CacheDraft.has(cid)) {
        lastContent = this.CacheDraft.get(cid).lastContent;
      }
      this.CacheDraft.set(cid, {
        editorValue: editorValue,
        lastContent: lastContent
      });
      this.updateContact({
        id: cid,
        lastContent: "<span style=\"color:red;\">[\u8349\u7A3F]</span><span>".concat(this.lastContentRender({
          type: "text",
          content: editorValue
        }), "</span>")
      });
    },
    /**
     * 清空联系人草稿信息
     */
    clearDraft: function clearDraft(contactId) {
      var draft = this.CacheDraft.get(contactId);
      if (draft) {
        var currentContent = this.findContact(contactId).lastContent;
        if (currentContent.indexOf('<span style="color:red;">[草稿]</span>') === 0) {
          this.updateContact({
            id: contactId,
            lastContent: draft.lastContent
          });
        }
        this.CacheDraft.remove(contactId);
      }
    },
    /**
     * 改变聊天对象
     * @param contactId 联系人 id
     */
    changeContact: function () {
      var _changeContact = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(contactId, menuName) {
        var _this14 = this;
        var editorValue, text, draft;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!menuName) {
                _context2.next = 4;
                break;
              }
              this.changeMenu(menuName);
              _context2.next = 6;
              break;
            case 4:
              if (!(this._changeContactLock || this.activeSidebar == DEFAULT_MENU_LASTMESSAGES && this.currentContactId == contactId || this.activeSidebar == DEFAULT_MENU_CONTACTS && this.currentContactIdSidebarContact == contactId)) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return", false);
            case 6:
              //保存上个聊天目标的草稿
              if (this.currentContactId) {
                editorValue = this.$refs.editor.chatArea.getHtml({
                  needUserId: true
                });
                text = this.$refs.editor.chatArea.getText();
                if (text) {
                  this.setDraft(this.currentContactId, editorValue);
                  this.setEditorValue();
                } else {
                  this.clearDraft(this.currentContactId);
                }
              }
              if (this.activeSidebar == DEFAULT_MENU_CONTACTS) {
                this.currentContactIdSidebarContact = contactId;
              } else {
                this.currentContactId = contactId;
              }
              if (this.currentContactId) {
                _context2.next = 10;
                break;
              }
              return _context2.abrupt("return", false);
            case 10:
              this.$emit("change-contact", this.currentContact, this);
              if (!(isFunction(this.currentContact.renderContainer) || this.activeSidebar == DEFAULT_MENU_CONTACTS)) {
                _context2.next = 13;
                break;
              }
              return _context2.abrupt("return");
            case 13:
              //填充草稿内容
              draft = this.CacheDraft.get(contactId);
              if (draft) {
                this.$refs.editor.chatArea.reverseAnalysis(draft.editorValue);
                this.$refs.editor._checkSubmitDisabled();
              }
              if (this.CacheMessageLoaded.has(contactId)) {
                this.$refs.messages.loaded();
              } else {
                this.$refs.messages.resetLoadState();
              }
              if (!allMessages[contactId]) {
                this.updateCurrentMessages();
                this._emitPullMessages(function (isEnd) {
                  _this14.messageViewToBottom();
                });
              } else {
                setTimeout(function () {
                  _this14.updateCurrentMessages();
                  _this14.messageViewToBottom();
                }, 0);
              }
            case 17:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function changeContact(_x, _x2) {
        return _changeContact.apply(this, arguments);
      }
      return changeContact;
    }(),
    /**
     * 删除一条聊天消息
     * @param messageId 消息 id
     * @param contactId 联系人 id
     */
    removeMessage: function removeMessage(messageId) {
      var message = this.findMessage(messageId);
      if (!message) return false;
      var index = allMessages[message.toContactId].findIndex(function (_ref2) {
        var id = _ref2.id;
        return id == messageId;
      });
      allMessages[message.toContactId].splice(index, 1);
      return true;
    },
    /**
     * 修改聊天一条聊天消息
     * @param {Message} data 根据 data.id 查找聊天消息并覆盖传入的值
     * @param contactId 联系人 id
     */
    updateMessage: function updateMessage(message) {
      if (!message.id) return false;
      var historyMessage = this.findMessage(message.id);
      if (!historyMessage) return false;
      historyMessage = Object.assign(historyMessage, message, {
        toContactId: historyMessage.toContactId
      });
      return true;
    },
    /**
     * 手动更新对话消息
     * @param {String} messageId 消息ID，如果为空则更新当前聊天窗口的所有消息
     */
    forceUpdateMessage: function forceUpdateMessage(messageId) {
      if (!messageId) {
        this.$refs.messages.$forceUpdate();
      } else {
        var components = this.$refs.messages.$refs.message;
        if (components) {
          var messageComponent = components.find(function (com) {
            return com.$attrs.message.id == messageId;
          });
          if (messageComponent) messageComponent.$forceUpdate();
        }
      }
    },
    _customContainerReady: function _customContainerReady(render, cacheDrive, key) {
      if (isFunction(render) && !cacheDrive.has(key)) {
        cacheDrive.set(key, render.call(this));
      }
    },
    /**
     * 切换左侧按钮
     * @param {String} name 按钮 name
     */
    changeMenu: function changeMenu(name) {
      this.$emit("change-menu", name);
      this.activeSidebar = name;
    },
    /**
     * 初始化编辑框的 Emoji 表情列表，是 Lemon-editor.initEmoji 的代理方法
     * @param {Array<Emoji,EmojiItem>} data emoji 数据
     * Emoji = {label: 表情,children: [{name: wx,title: 微笑,src: url}]} 分组
     * EmojiItem = {name: wx,title: 微笑,src: url} 无分组
     */
    initEmoji: function initEmoji(data) {
      var flatData = [];
      this.$refs.editor.initEmoji(data);
      if (data[0].label) {
        data.forEach(function (item) {
          var _flatData;
          (_flatData = flatData).push.apply(_flatData, _toConsumableArray(item.children));
        });
      } else {
        flatData = data;
      }
      flatData.forEach(function (_ref3) {
        var name = _ref3.name,
          src = _ref3.src;
        return emojiMap[name] = src;
      });
    },
    initEditorTools: function initEditorTools(data) {
      //this.editorTools = data;
      this.editorTools = data;
      //this.$refs.editor.initTools(data);
    },
    /**
     * 初始化左侧按钮
     * @param {Array<Menu>} data 按钮数据
     */
    initMenus: function initMenus(data) {
      var _this15 = this;
      var h = this.$createElement;
      var defaultMenus = [{
        name: DEFAULT_MENU_LASTMESSAGES,
        title: "聊天",
        unread: 0,
        click: null,
        render: function render(menu) {
          return h("i", {
            "class": "lemon-icon-message"
          });
        },
        isBottom: false
      }, {
        name: DEFAULT_MENU_CONTACTS,
        title: "通讯录",
        unread: 0,
        click: null,
        render: function render(menu) {
          return h("i", {
            "class": "lemon-icon-addressbook"
          });
        },
        isBottom: false
      }];
      var menus = [];
      if (Array.isArray(data)) {
        var indexMap = {
          messages: 0,
          contacts: 1
        };
        var indexKeys = Object.keys(indexMap);
        menus = data.map(function (item) {
          if (indexKeys.includes(item.name)) {
            return componentsvue_type_script_lang_js_objectSpread(componentsvue_type_script_lang_js_objectSpread(componentsvue_type_script_lang_js_objectSpread({}, defaultMenus[indexMap[item.name]]), item), {
              renderContainer: null
            });
          }
          if (item.renderContainer) {
            _this15._customContainerReady(item.renderContainer, _this15.CacheMenuContainer, item.name);
          }
          return item;
        });
      } else {
        menus = defaultMenus;
      }
      this.menus = menus;
    },
    /**
     * 初始化联系人数据
     * @param {Array<Contact>} data 联系人列表
     */
    initContacts: function initContacts(data) {
      this.contacts = data;
      this.sortContacts();
    },
    /**
     * 使用 联系人的 index 值进行排序
     */
    sortContacts: function sortContacts() {
      this.contacts.sort(function (a, b) {
        if (!a.index) return;
        return a.index.localeCompare(b.index);
      });
    },
    appendContact: function appendContact(contact) {
      if (isEmpty(contact.id) || isEmpty(contact.displayName)) {
        console.error("id | displayName cant be empty");
        return false;
      }
      if (this.hasContact(contact.id)) return true;
      this.contacts.push(Object.assign({
        id: "",
        displayName: "",
        avatar: "",
        index: "",
        unread: 0,
        lastSendTime: "",
        lastContent: ""
      }, contact));
      return true;
    },
    removeContact: function removeContact(id) {
      var index = this.findContactIndexById(id);
      if (index === -1) return false;
      this.contacts.splice(index, 1);
      this.CacheDraft.remove(id);
      this.CacheMessageLoaded.remove(id);
      return true;
    },
    /**
     * 修改联系人数据
     * @param {Contact} data 修改的数据，根据 Contact.id 查找联系人并覆盖传入的值
     */
    updateContact: function updateContact(data) {
      var contactId = data.id;
      delete data.id;
      var index = this.findContactIndexById(contactId);
      if (index !== -1) {
        var unread = data.unread;
        if (isString(unread)) {
          if (unread.indexOf("+") === 0 || unread.indexOf("-") === 0) {
            data.unread = parseInt(unread) + parseInt(this.contacts[index].unread);
          }
        }
        this.$set(this.contacts, index, componentsvue_type_script_lang_js_objectSpread(componentsvue_type_script_lang_js_objectSpread({}, this.contacts[index]), data));
      }
    },
    /**
     * 根据 id 查找联系人的索引
     * @param contactId 联系人 id
     * @return {Number} 联系人索引，未找到返回 -1
     */
    findContactIndexById: function findContactIndexById(contactId) {
      return this.contacts.findIndex(function (item) {
        return item.id == contactId;
      });
    },
    /**
     * 根据 id 查找判断是否存在联系人
     * @param contactId 联系人 id
     * @return {Boolean}
     */
    hasContact: function hasContact(contactId) {
      return this.findContactIndexById(contactId) !== -1;
    },
    findMessage: function findMessage(messageId) {
      for (var key in allMessages) {
        var message = allMessages[key].find(function (_ref4) {
          var id = _ref4.id;
          return id == messageId;
        });
        if (message) return message;
      }
    },
    findContact: function findContact(contactId) {
      return this.getContacts().find(function (_ref5) {
        var id = _ref5.id;
        return id == contactId;
      });
    },
    /**
     * 返回所有联系人
     * @return {Array<Contact>}
     */
    getContacts: function getContacts() {
      return this.contacts;
    },
    //返回当前聊天窗口联系人信息
    getCurrentContact: function getCurrentContact() {
      return this.currentContact;
    },
    getCurrentMessages: function getCurrentMessages() {
      return this.currentMessages;
    },
    setEditorValue: function setEditorValue() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (!isString(val)) return false;
      this.$refs.editor.setValue(this.emojiNameToImage(val));
    },
    getEditorValue: function getEditorValue() {
      return this.$refs.editor.getFormatValue();
    },
    /**
     * 清空某个联系人的消息，切换到该联系人时会重新触发pull-messages事件
     */
    clearMessages: function clearMessages(contactId) {
      if (contactId) {
        delete allMessages[contactId];
        this.CacheMessageLoaded.remove(contactId);
        this.CacheDraft.remove(contactId);
      } else {
        allMessages = {};
        this.CacheMessageLoaded.remove();
        this.CacheDraft.remove();
      }
      return true;
    },
    /**
     * 返回所有消息
     * @return {Object<Contact.id,Message>}
     */
    getMessages: function getMessages(contactId) {
      return (contactId ? allMessages[contactId] : allMessages) || [];
    },
    changeDrawer: function changeDrawer(params) {
      this.drawerVisible = !this.drawerVisible;
      if (this.drawerVisible == true) this.openDrawer(params);
    },
    // openDrawer(data) {
    //   renderDrawerContent = data || new Function();
    //   this.drawerVisible = true;
    // },
    openDrawer: function openDrawer(params) {
      renderDrawerContent = isFunction(params) ? params : params.render || new Function();
      var wrapperWidth = this.$refs.wrapper.clientWidth;
      var wrapperHeight = this.$refs.wrapper.clientHeight;
      var width = params.width || 200;
      var height = params.height || wrapperHeight;
      var offsetX = params.offsetX || 0;
      var offsetY = params.offsetY || 0;
      var position = params.position || "right";
      if (isString(width)) width = wrapperWidth * toPoint(width);
      if (isString(height)) height = wrapperHeight * toPoint(height);
      if (isString(offsetX)) offsetX = wrapperWidth * toPoint(offsetX);
      if (isString(offsetY)) offsetY = wrapperHeight * toPoint(offsetY);
      this.$refs.drawer.style.width = "".concat(width, "px");
      this.$refs.drawer.style.height = "".concat(height, "px");
      var left = 0;
      var top = 0;
      var shadow = "";
      if (position == "right") {
        left = wrapperWidth;
      } else if (position == "rightInside") {
        left = wrapperWidth - width;
        shadow = "-15px 0 16px -14px rgba(0,0,0,0.08)";
      } else if (position == "center") {
        left = wrapperWidth / 2 - width / 2;
        top = wrapperHeight / 2 - height / 2;
        shadow = "0 0 20px rgba(0,0,0,0.08)";
      }
      left += offsetX;
      top += offsetY + -1;
      this.$refs.drawer.style.top = "".concat(top, "px");
      this.$refs.drawer.style.left = "".concat(left, "px");
      this.$refs.drawer.style.boxShadow = shadow;
      this.drawerVisible = true;
    },
    closeDrawer: function closeDrawer() {
      this.drawerVisible = false;
    },
    setAtUserList: function setAtUserList(data, callEvery) {
      this.$refs.editor.chatArea.updateConfig({
        userList: data,
        needCallEvery: callEvery
      });
    },
    setUserTag: function setUserTag(data) {
      this.$refs.editor.chatArea.setUserTag(data);
      this.$refs.editor._checkSubmitDisabled();
    }
  }
});
// CONCATENATED MODULE: ./packages/components/index.vue?vue&type=script&lang=js
 /* harmony default export */ var packages_componentsvue_type_script_lang_js = (componentsvue_type_script_lang_js); 
// EXTERNAL MODULE: ./packages/components/index.vue?vue&type=style&index=0&id=4b7eee71&prod&lang=stylus
var componentsvue_type_style_index_0_id_4b7eee71_prod_lang_stylus = __webpack_require__("b25a");

// CONCATENATED MODULE: ./packages/components/index.vue
var components_render, components_staticRenderFns





/* normalize component */

var components_component = normalizeComponent(
  packages_componentsvue_type_script_lang_js,
  components_render,
  components_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var components = (components_component.exports);
// EXTERNAL MODULE: ./packages/styles/common/index.styl
var common = __webpack_require__("6a2b");

// CONCATENATED MODULE: ./packages/index.js


















var version = "1.4.2";
var packages_components = [components, components_contact, messages, editor, avatar, badge, components_button, popover, tabs, basic, message_text, message_image, file, message_event];
var packages_install = function install(Vue) {
  Vue.directive("LemonContextmenu", contextmenu);
  packages_components.forEach(function (component) {
    Vue.component(component.name, component);
  });
};
if (typeof window !== "undefined" && window.Vue) {
  packages_install(window.Vue);
}
/* harmony default export */ var packages_0 = ({
  version: version,
  install: packages_install
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (packages_0);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
});