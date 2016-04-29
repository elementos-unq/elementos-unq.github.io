var board;

board = {};

(function() {
  var COLOR, COLORS, add_classes, mk_div, paint, prop, rows, scope, switch_color;
  COLOR = {
    BLACK: 'black',
    GREEN: 'green',
    RED: 'red'
  };
  COLORS = (function() {
    var _results;
    _results = [];
    for (prop in COLOR) {
      _results.push(COLOR[prop]);
    }
    return _results;
  })();
  rows = [];
  add_classes = function(element, classes) {
    var klass, _i, _len;
    if (classes == null) {
      classes = [];
    }
    for (_i = 0, _len = classes.length; _i < _len; _i++) {
      klass = classes[_i];
      element.classList.add(klass);
    }
    return element;
  };
  mk_div = function(classes) {
    return add_classes(document.createElement('div'), classes);
  };
  board.view = mk_div(['board']);
  paint = function(cell, color) {
    cell.color && cell.view.classList.remove(cell.color);
    cell.color = color;
    return cell.color && cell.view.classList.add(cell.color);
  };
  board.pintar = function(color) {
    return paint(scope.current, color);
  };
  board.PintarNegro = function() {
    return this.pintar(COLOR.BLACK);
  };
  board.PintarVerde = function() {
    return this.pintar(COLOR.GREEN);
  };
  board.PintarRojo = function() {
    return this.pintar(COLOR.RED);
  };
  scope = {};
  (function() {
    var current, currentClass;
    currentClass = 'current';
    current = null;
    return Object.defineProperty(scope, 'current', {
      get: function() {
        return current;
      },
      set: function(next) {
        current && current.view.classList.remove(currentClass);
        current = next;
        return current && current.view.classList.add(currentClass);
      }
    });
  })();
  board.set_current = function(config) {
    var cell, row;
    row = rows[config.y - config.min_y];
    if (!row) {
      return;
    }
    cell = row.cells[config.x - config.min_x];
    if (!cell) {
      return;
    }
    return scope.current = cell;
  };
  switch_color = function(cell) {
    return function() {
      var color, index, next, _i, _len;
      if (!cell.color) {
        next = COLORS[0];
      } else {
        for (index = _i = 0, _len = COLORS.length; _i < _len; index = ++_i) {
          color = COLORS[index];
          if (cell.color === color) {
            next = COLORS[index + 1];
          }
        }
      }
      return paint(cell, next);
    };
  };
  return board.resize = function(config) {
    var cell, col_index, content, row, row_index, _i, _ref, _ref1, _results;
    _results = [];
    for (row_index = _i = _ref = config.min_y, _ref1 = config.max_y; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row_index = _ref <= _ref1 ? ++_i : --_i) {
      row = {
        view: mk_div(['row']),
        cells: []
      };
      row.index = row_index;
      board.view.appendChild(row.view);
      rows.push(row);
      _results.push((function() {
        var _j, _ref2, _ref3, _results1;
        _results1 = [];
        for (col_index = _j = _ref2 = config.min_x, _ref3 = config.max_x; _ref2 <= _ref3 ? _j <= _ref3 : _j >= _ref3; col_index = _ref2 <= _ref3 ? ++_j : --_j) {
          cell = {
            view: mk_div(['cell'])
          };
          content = mk_div(['content']);
          cell.col_index = col_index;
          cell.view.appendChild(content);
          if (row_index === config.y && col_index === config.x) {
            scope.current = cell;
          }
          row.view.appendChild(cell.view);
          row.cells.push(cell);
          _results1.push(cell.view.addEventListener('click', switch_color(cell), false));
        }
        return _results1;
      })());
    }
    return _results;
  };
})();
