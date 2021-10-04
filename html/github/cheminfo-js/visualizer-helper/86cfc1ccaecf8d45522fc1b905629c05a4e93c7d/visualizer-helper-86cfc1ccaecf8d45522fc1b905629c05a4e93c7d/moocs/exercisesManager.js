"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

define(['src/util/api'], function (API) {
  function exercisesManager(_x, _x2, _x3) {
    return _exercisesManager.apply(this, arguments);
  }

  function _exercisesManager() {
    _exercisesManager = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(action, allExercises, options) {
      var state, _state, loadState, saveState, loadExercises;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              loadExercises = function _loadExercises(allExercises) {
                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                // need to check is we have some cookie that contains the existing exercises
                var state = loadState(options.cookieName);
                var myResults = state.myResults;
                var selectedExercises;

                if (state.selectedExercises.length !== options.numberExercises) {
                  // need to recreate a serie
                  allExercises.sort(function () {
                    return Math.random() - 0.5;
                  });
                  selectedExercises = allExercises.slice(0, options.numberExercises);
                } else {
                  // we need to reload the exercises based on the cookie
                  selectedExercises = allExercises.filter(function (a) {
                    return state.selectedExercises.includes(a.id);
                  });
                }

                selectedExercises.forEach(function (a) {
                  if (state.myResults[a.id]) a.myResult = state.myResults[a.id];
                });
                state.selectedExercises = selectedExercises.map(function (a) {
                  return a.id;
                });
                saveState(options.cookieName, state);
                return API.createData('exercises', selectedExercises).then(function (exercises) {
                  exercises.onChange(function (evt) {
                    if (evt.target.__name === 'myResult') {
                      var target = evt.target.__parent;

                      if (target) {
                        myResults[target.id] = target.myResult;
                      }

                      saveState(options.cookieName, state);
                    }
                  });
                  return exercises;
                });
              };

              saveState = function _saveState(cookieName, state) {
                window.localStorage.setItem(cookieName, JSON.stringify(state));
              };

              loadState = function _loadState(cookieName) {
                return JSON.parse(window.localStorage.getItem(cookieName) || '{"selectedExercises":[],"myResults":{}}');
              };

              _context.t0 = action;
              _context.next = _context.t0 === 'init' ? 6 : _context.t0 === 'clear' ? 9 : _context.t0 === 'regenerate' ? 15 : 21;
              break;

            case 6:
              _context.next = 8;
              return loadExercises(allExercises, options);

            case 8:
              return _context.abrupt("break", 22);

            case 9:
              state = loadState(options.cookieName);
              state.myResults = {};
              saveState(options.cookieName, state);
              _context.next = 14;
              return loadExercises(allExercises, options);

            case 14:
              return _context.abrupt("break", 22);

            case 15:
              _state = loadState(options.cookieName);
              _state.selectedExercises = [];
              saveState(options.cookieName, _state);
              _context.next = 20;
              return loadExercises(allExercises, options);

            case 20:
              return _context.abrupt("break", 22);

            case 21:
              throw new Error('Exercise manager: unexpected action');

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _exercisesManager.apply(this, arguments);
  }

  return exercisesManager;
});