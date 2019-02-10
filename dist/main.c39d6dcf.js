// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"ts/State/State.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var State =
/**
 * Crea un estado.
 *
 * @param id {identidiacdor del estado}
 */
function State(id) {
  var _this = this;

  _classCallCheck(this, State);

  /**
   * Agrega una transición al conjunto de transiciones del estado.
   *
   * @param {Transition} t {transición a ser agregada}
   * @memberof State
   */
  this.addTransition = function (t) {
    _this.transitions.add(t);
  };
  /**
   * Obtiene el subconjunto del conjunto de transiciones que tengan el símbolo symbol.
   *
   * @param {string} symbol {símbolo con el que se hace la transición}
   * @memberof State
   */


  this.getTransitionsBySymbol = function (symbol) {
    return _toConsumableArray(_this.transitions).filter(function (transition) {
      if (transition.hasLimitSymbol()) {
        return symbol.length === 1 ? transition.symbol <= symbol && symbol <= transition.limitSymbol : false;
      } else {
        return transition.symbol === symbol;
      }
    });
  };

  this.id = id;
  this.transitions = new Set();
};

exports.State = State;
},{}],"ts/Transition/Transition.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Transition = function Transition(symbol, targetState, limitSymbol) {
  var _this = this;

  _classCallCheck(this, Transition);

  this.hasLimitSymbol = function () {
    return _this.limitSymbol ? true : false;
  }; // Se establece el símbolo límite (para rangos), si existe.


  if (limitSymbol) {
    if (symbol.length != 1 || limitSymbol.length != 1) {
      console.log("La longitud de ambos símbolos para un rango debe ser 1");
      return null;
    }

    if (limitSymbol.charCodeAt(0) <= symbol.charCodeAt(0)) {
      console.log("No es posible crear la transición con ese rango.");
      return null;
    }

    this.limitSymbol = limitSymbol;
  } else {
    this.limitSymbol = null;
  } // Se sgrega el símbolo principal de la transición.


  this.symbol = symbol; // Se establece el estado objetivo.

  this.targetState = targetState;
};

exports.Transition = Transition;
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"css/table.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/css-loader.js"}],"ts/Automaton/Automaton.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var State_1 = require("../State/State");

var Transition_1 = require("../Transition/Transition");

require("../../css/table.css");

var Automaton =
/**
 * Genera un autómata vacío.
 *
 * @memberof Automaton
 */
function Automaton(name) {
  var _this = this;

  _classCallCheck(this, Automaton);

  this.getName = function () {
    return _this.name;
  };
  /**
   * Crea un autómata básico de una transición con el símbolo symbol.
   *
   * @param {string} symbol {es el símbolo con el que se genera la transición}
   * @param {string} [limitSymbol] {es un símbolo opcional que delimita el rango [symbol, limitSymbol]}
   * @memberof Automaton
   */


  this.createBasic = function (symbol, limitSymbol) {
    var state0, state1;

    if (_this.states.size == 0) {
      state0 = new State_1.State(0);
      state1 = new State_1.State(1);
    } else {
      state0 = new State_1.State(_this.states.size);
      state1 = new State_1.State(_this.states.size + 1);
    }

    var transition = new Transition_1.Transition(symbol, state1, limitSymbol);
    state0.addTransition(transition); // Se agregan los símbolos que abarca el rango (symbol, limitSymbol) a sigma.

    if (transition.hasLimitSymbol()) {
      for (var ascii = symbol.charCodeAt(0); ascii <= limitSymbol.charCodeAt(0); ascii++) {
        _this.sigma.add(String.fromCharCode(ascii));
      }
    } else {
      _this.sigma.add(symbol);
    } // Agregamos los estados a los conjuntos y establecemos estados inicial y finales.


    _this.states.add(state0);

    _this.states.add(state1);

    _this.startState = state0;

    _this.acceptStates.add(state1);
  };
  /**
   * Une un autómata a otro conservando la integridad de las transiciones.
   *
   * @param {Automaton} automaton {es el automata que se va a unir con this}
   * @memberof Automaton
   */


  this.unirAFN = function (automaton) {
    var stateIni = new State_1.State(_this.states.size + automaton.states.size);
    var stateEnd = new State_1.State(_this.states.size + automaton.states.size + 1);
    var finalTransition = new Transition_1.Transition(Automaton.epsilon, stateEnd);
    var initialTransitionAFN_1 = new Transition_1.Transition(Automaton.epsilon, _this.startState);
    var initialTransitionAFN_2 = new Transition_1.Transition(Automaton.epsilon, automaton.startState); // Se agrega la transición final nueva a todos los estados finales del AFN this.

    _toConsumableArray(_this.states).filter(function (state) {
      return _this.acceptStates.has(state);
    }).forEach(function (acceptState) {
      acceptState.addTransition(finalTransition);
    }); // Se agrega la transición final nueva a todos los estados finales del AFN que recibimos como parametro.


    _toConsumableArray(automaton.states).filter(function (state) {
      return automaton.acceptStates.has(state);
    }).forEach(function (acceptState) {
      acceptState.addTransition(finalTransition);
    }); // Se limpia el conjunto de estados finales.


    _this.acceptStates.clear(); // Y se reemplaza solo por el nuevo estado final.


    _this.acceptStates.add(stateEnd); //Se agregan los estados del AFN2 al AFN1


    for (var i = 0; i < automaton.states.size; i++) {
      _this.states.add(_toConsumableArray(automaton.states)[i]);
    } //Se agregan los simbolos del AFN2 al AFN1


    for (var _i = 0; _i < automaton.sigma.size; _i++) {
      _this.sigma.add(_toConsumableArray(automaton.sigma)[_i]);
    } // Se agregan los estados nuevos al conjunto de estados.


    _this.states.add(stateIni);

    _this.states.add(stateEnd); //Se reordenan los id para evitar duplicidades


    for (var _i2 = 0; _i2 < _this.states.size; _i2++) {
      _toConsumableArray(_this.states)[_i2].id = _i2; // "0", "1", "2", ... "n"
    } // Se reemplaza el nuevo estado inicial.


    _this.startState = stateIni; // Se le agregan las transiciones al inicio antiguo del autómata y al final del mismo.

    _this.startState.addTransition(initialTransitionAFN_1);

    _this.startState.addTransition(initialTransitionAFN_2); // Se agregan los símbolos que abarca el rango (symbol, limitSymbol) a sigma.

  };
  /**
   * Crea la cerradura opcional del autómata.
   *
   * @memberof Automaton
   */


  this.makeOptional = function () {
    // Se crea el estado inicial auxiliar.
    var nextBeginState = new State_1.State(_this.states.size); // Se crea el estado final auxiliar.

    var nextFinalState = new State_1.State(_this.states.size + 1); // Se crea transición épsilon que va al estado final.

    var finalTransition = new Transition_1.Transition(Automaton.epsilon, nextFinalState); // Se crea transición épsilon que partirá del nuevo estado inicial.

    var firstTransition = new Transition_1.Transition(Automaton.epsilon, _this.startState); // Se agrega la transición final nueva a todos los estados finales.

    _toConsumableArray(_this.states).filter(function (state) {
      return _this.acceptStates.has(state);
    }).forEach(function (acceptState) {
      acceptState.addTransition(finalTransition);
    }); // Se limpia el conjunto de estados finales.


    _this.acceptStates.clear(); // Y se reemplaza solo por el nuevo estado final.


    _this.acceptStates.add(nextFinalState); // Se agregan los estados nuevos al conjunto de estados.


    _this.states.add(nextBeginState);

    _this.states.add(nextFinalState); // Se reemplaza el nuevo estado inicial.


    _this.startState = nextBeginState; // Se le agregan las transiciones al inicio antiguo del autómata y al final del mismo.

    _this.startState.addTransition(firstTransition);

    _this.startState.addTransition(finalTransition);
  };
  /**
   * Crea la cerradura positiva del autómata.
   *
   * @memberof Automaton
   */


  this.makePositive = function () {
    // Nos aseguramos de que solo haya un estado final.
    if (_this.acceptStates.size != 1) {
      console.log("El autómata no tiene un único estado final.");
      return;
    } // Se crea el estado inicial auxiliar.


    var nextBeginState = new State_1.State(_this.states.size); // Se crea el estado final auxiliar.

    var nextFinalState = new State_1.State(_this.states.size + 1); // Se crea transición épsilon que va al estado final.

    var finalTransition = new Transition_1.Transition(Automaton.epsilon, nextFinalState); // Se crea transición épsilon que va hacia el viejo estado inicial.

    var toPrevStartTransition = new Transition_1.Transition(Automaton.epsilon, _this.startState); // Agregamos transiciones a los respectivos estados.

    /* const prevFinalState = [...this.states].filter(state =>
        this.acceptStates.has(state)
    )[0];*/

    var prevFinalState = _toConsumableArray(_this.acceptStates)[0];

    prevFinalState.addTransition(toPrevStartTransition);
    prevFinalState.addTransition(finalTransition);
    nextBeginState.addTransition(toPrevStartTransition);

    _this.acceptStates.clear();

    _this.acceptStates.add(nextFinalState);

    _this.startState = nextBeginState;

    _this.states.add(nextBeginState);

    _this.states.add(nextFinalState);
  };
  /**
   * Crea la cerradura de Kleene del autómata.
   *
   * @memberof Automaton
   */


  this.makeKleene = function () {
    // Se hace la cerradura positiva del autómata
    _this.makePositive();

    var transitionToEnd = new Transition_1.Transition(Automaton.epsilon, _toConsumableArray(_this.acceptStates)[0]); // Se agrega la transición épsilon del inicio al fin del autómata.

    _this.startState.addTransition(transitionToEnd);
  };
  /**
   * Obtiene un estado mediante el identificador suministrado. Se puede indicar si es un estado terminal.
   *
   * @private
   * @param {number} id {identificador del estado en this.states}
   * @param {boolean} [final] {bandera que indica si pertenece a this.acceptStates}
   * @returns {State} {estado que coincide con la consulta}
   * @memberof Automaton
   */


  this.getState = function (id, final) {
    if (final) {
      return _toConsumableArray(_this.acceptStates).filter(function (state) {
        return state.id === id;
      })[0];
    }

    return _toConsumableArray(_this.states).filter(function (state) {
      return state.id === id;
    })[0];
  };

  this.toHTMLTable = function () {
    var tmpSigma = new Set([].concat(_toConsumableArray(_this.sigma), [Automaton.epsilon])); // Encabezado de la tabla.

    var head = "<tr>" + _toConsumableArray(tmpSigma).reduce(function (tableHead, symbol) {
      return tableHead + "<th>".concat(symbol, "</th>");
    }, "<th>Estado</th>") + "</tr>"; // Cuerpo (filas) de la tabla.

    var body = _toConsumableArray(_this.states).map(function (state) {
      // Celda del estado actual.
      var stateCell;

      if (_this.startState === state) {
        stateCell = "<td class=\"state-cell start\"><p>".concat(state.id, "</p></td>");
      } else if (_this.acceptStates.has(state)) {
        stateCell = "<td class=\"state-cell accept\"><p>".concat(state.id, "</p></td>");
      } else {
        stateCell = "<td class=\"state-cell\"><p>".concat(state.id, "</p></td>");
      } // Resto de la fila.


      var targetStatesRow = "";
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = tmpSigma[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var symbol = _step.value;
          var targetStates = state.getTransitionsBySymbol(symbol).map(function (transition) {
            return "".concat(transition.targetState.id);
          }).join(", ");
          var cell = "<td>{".concat(targetStates.length > 0 ? targetStates : " ", "}</td>");
          targetStatesRow += cell;
        } //Fila completa.

      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return "<tr>".concat(stateCell).concat(targetStatesRow, "</tr>");
    }) // Se unen (concatenan) todas las filas
    .join("");

    return "<table>".concat(head).concat(body, "</table>");
  };

  this.sigma = new Set();
  this.sigma.clear();
  this.states = new Set();
  this.states.clear();
  this.startState = null;
  this.acceptStates = new Set();
  this.acceptStates.clear();
  this.name = name;
  alert("Aut\xF3mata ".concat(name, " creado exitosamente."));
};
/**
 * Símbolo que actúa como la cadena vacía del autómata.
 *
 * @static
 * @type {string}
 * @memberof Automaton
 */


Automaton.epsilon = "\u03B5";
exports.Automaton = Automaton;
},{"../State/State":"ts/State/State.ts","../Transition/Transition":"ts/Transition/Transition.ts","../../css/table.css":"css/table.css"}],"main.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Automaton_1 = require("./ts/Automaton/Automaton"); // Arreglo de autómatas creados localmente.


var automata = [];
document.querySelector("#tools").style.display = "none";
document.querySelector("#target").style.display = "none"; // Listener para crear autómatas simples

document.querySelector(".btn-creator").addEventListener("click", function () {
  var name_element = document.querySelector("#name");
  var symbol_element = document.querySelector("#symbol");
  var name = name_element.value;

  if (name.length === 0) {
    alert("Debe ingresar un nombre para el autómata.");
    return;
  } else if (automata.find(function (automaton) {
    return automaton.getName() === name;
  })) {
    alert("Ingrese otro nombre para el autómata.");
    return;
  }

  var symbol = symbol_element.value;
  var symbols = symbol.split("-");

  switch (symbols.length) {
    case 1:
      {
        var automaton = new Automaton_1.Automaton(name);
        automaton.createBasic(symbols[0]);
        automata.push(automaton);
        break;
      }

    case 2:
      {
        if (symbols.find(function (_symbol) {
          return _symbol.length !== 1;
        })) {
          alert("El rango se da solamente con símbolos de longitud 1");
          return;
        }

        var _automaton = new Automaton_1.Automaton(name);

        _automaton.createBasic(symbols[0], symbols[1]);

        automata.push(_automaton);
        break;
      }

    default:
      {
        alert("Inserte un símbolo o rango adecuado.");
        return;
      }
  }

  var option_one = document.createElement("option");
  option_one.text = name;
  option_one.value = name;
  var option_two = document.createElement("option");
  option_two.text = name;
  option_two.value = name;
  var automaton_select = document.querySelector("#automaton");
  var target_select = document.querySelector("#target-automaton");
  automaton_select.appendChild(option_one);
  automaton_select.value = name;
  target_select.appendChild(option_two);
  name_element.value = "";
  symbol_element.value = "";
}); // Listeners para mostrar tabla de autómata según se seleccione.

document.querySelector("#automaton").addEventListener("DOMNodeInserted", function (event) {
  var selector = event.target;

  if (selector.childElementCount !== 0) {
    return;
  }

  document.querySelector("#automaton-table").innerHTML = automata.find(function (automaton) {
    return automaton.getName() === selector.value;
  }).toHTMLTable();
  document.querySelector("#tools").style.display = "inline-block";
});
document.querySelector("#automaton").addEventListener("change", function (event) {
  var name = event.target.value;
  document.querySelector("#automaton-table").innerHTML = automata.find(function (automaton) {
    return automaton.getName() === name;
  }).toHTMLTable();
}); // Listeners para controlar comportamiento de sección "target".

document.querySelector("#operation").addEventListener("change", function (event) {
  var operation = event.target.value;

  if (operation === "unirAFN" || operation === "concatenarAFN") {
    document.querySelector("#target").style.display = "inline-block";
    document.querySelector(".btn-execute__one").style.display = "none";
  } else {
    document.querySelector("#target").style.display = "none";
    document.querySelector(".btn-execute__one").style.display = "initial";
  }
}); // Listeners para realizar las operaciones unarias.

document.querySelector(".btn-execute__one").addEventListener("click", function () {
  var operation = document.querySelector("#operation").value;
  var automaton = automata.find(function (a) {
    var name = document.querySelector("#automaton").value;
    return a.getName() === name;
  });
  automaton[operation]();
  document.querySelector("#automaton-table").innerHTML = automaton.toHTMLTable();
}); // Listeners para realizar las operaciones binarias.

document.querySelector(".btn-execute__two").addEventListener("click", function () {
  var operation = document.querySelector("#operation").value;
  var a1 = automata.find(function (a) {
    var name = document.querySelector("#automaton").value;
    return a.getName() === name;
  });
  var a2 = automata.find(function (a) {
    var name = document.querySelector("#target-automaton").value;
    return a.getName() === name;
  });
  a1[operation](a2);
  document.querySelector("#automaton-table").innerHTML = a1.toHTMLTable();
});
},{"./ts/Automaton/Automaton":"ts/Automaton/Automaton.ts"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55051" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.map