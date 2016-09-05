var viewer;

viewer = {};

(function() {
  var add_classes, mk, mk_div, mk_expression, mk_img, mk_index, mk_pre, mk_ref, mk_rule, mk_single, mk_span, process_children, process_errors, process_expression;
  process_errors = function(node, error) {
    if (!node.ok) {
      if (error) {
        return node.view.appendChild(mk_img(['state-error'], 'assets/error.png'));
      } else {
        return node.view.appendChild(mk_img(['state-not-ok'], 'assets/warning.png'));
      }
    }
  };
  mk_expression = {
    BINARY: function(expression) {
      var root;
      root = mk_div(['binary']);
      root.appendChild(process_expression(expression.left));
      root.appendChild(mk_span(expression.connector.content, ['connector']));
      root.appendChild(process_expression(expression.right));
      return root;
    },
    ELEMENT: function(expression) {
      return mk_span(expression.identifier, ['element']);
    },
    NEGATION: function(expression) {
      var root;
      root = mk_div(['negation']);
      root.appendChild(mk_span(expression.content, ['negation-content']));
      root.appendChild(process_expression(expression.expression));
      return root;
    },
    CLOSE_EXP: function(expression) {
      var root;
      root = mk_div(['close-exp']);
      root.appendChild(mk_span('(', ['parenthesis', 'start']));
      root.appendChild(process_expression(expression.expression));
      root.appendChild(mk_span(')', ['parenthesis', 'end']));
      return root;
    },
    CONTRADICTION: function(expression) {
      return mk_span(expression.content, ['contradiction']);
    }
  };
  mk = {
    CLOSE_ITERATION_ERROR: function(node) {
      node.view = mk_div(['iteration-close']);
      node.view.appendChild(mk_span('<<', ['iteration-close-text']));
      return process_errors(node, true);
    },
    PREMISE: function(node, error) {
      node.view = mk_div(['premise']);
      node.view.appendChild(process_expression(node.expression));
      node.view.appendChild(mk_span('premisa', ['premise-text']));
      return process_errors(node, error);
    },
    SUPPOSED: function(node, error) {
      node.view = mk_div(['supposed']);
      node.view.appendChild(process_expression(node.expression));
      node.view.appendChild(mk_span('supuesto', ['supposed-text']));
      return process_errors(node, error);
    },
    ASSERTION: function(node, error) {
      node.view = mk_div(['assertion']);
      node.view.appendChild(process_expression(node.expression));
      mk_rule(node.rule);
      node.view.appendChild(node.rule.view);
      return process_errors(node, error);
    },
    ITERATION: function(node, error) {
      node.view = mk_div(['iteration']);
      return process_children(node, error);
    },
    ERROR: function(node) {
      var error, error_view, _i, _len, _ref, _results;
      node.view = mk_div(['errors']);
      _ref = node.content;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        error_view = mk_div(['error']);
        node.view.appendChild(error_view);
        _results.push(error_view.appendChild(mk_span(error, ['error-text'])));
      }
      return _results;
    }
  };
  mk_rule = function(rule) {
    rule.view = mk_div(['rule']);
    if (rule.action === 'DOUBLE_NOT') {
      rule.view.appendChild(mk_span('¬¬', ['rule-type']));
    } else if (rule.action === 'EFSQ') {
      rule.view.appendChild(mk_span('EFSQ', ['rule-type']));
    } else if (rule.action === 'REPEAT') {
      rule.view.appendChild(mk_span('R', ['rule-type']));
    } else {
      rule.view.appendChild(mk_span(rule.action, ['rule-type']));
      rule.view.appendChild(mk_span(rule.connector.content, ['rule-connector']));
    }
    return mk_ref(rule);
  };
  mk_ref = function(rule) {
    var index, indices, _i, _ref;
    rule.view.appendChild(mk_span('(', ['parenthesis', 'ref']));
    if (rule.references.type === 'ARRAY') {
      indices = rule.references.indices;
      for (index = _i = 0, _ref = indices.length - 1; 0 <= _ref ? _i < _ref : _i > _ref; index = 0 <= _ref ? ++_i : --_i) {
        rule.view.appendChild(mk_span(indices[index], ['reference-index']));
        rule.view.appendChild(mk_span(',', ['reference-reparator']));
      }
      rule.view.appendChild(mk_span(indices[indices.length - 1], ['reference-index']));
    } else {
      rule.view.appendChild(mk_span(rule.references.first, ['reference-index']));
      rule.view.appendChild(mk_span('-', ['reference-reparator']));
      rule.view.appendChild(mk_span(rule.references.last, ['reference-index']));
    }
    return rule.view.appendChild(mk_span(')', ['parenthesis', 'ref']));
  };
  process_expression = function(expression) {
    return mk_expression[expression.type](expression);
  };
  process_children = function(parent, error) {
    var node, _i, _len, _ref, _results;
    _ref = parent.children;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      mk[node.type](node, error);
      _results.push(parent.view.appendChild(node.view));
    }
    return _results;
  };
  mk_index = function(ast) {
    var elem, rules, width_klass, _i, _len, _ref, _results;
    width_klass = 'index-container-' + ast.length.toString().length;
    rules = mk_div(['index-container', width_klass]);
    ast.root.view.appendChild(rules);
    _ref = ast.indices;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      elem = _ref[_i];
      _results.push(rules.appendChild(mk_span(elem.index, ['index', elem.klass])));
    }
    return _results;
  };
  viewer.process = function(ast) {
    var lines, node, _i, _len, _ref;
    ast.root.view = mk_div(['root']);
    mk_index(ast);
    lines = mk_div(['lines']);
    _ref = ast.root.children;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      mk[node.type](node, ast.error);
      lines.appendChild(node.view);
      add_classes(node.view, ['first-level']);
    }
    return ast.root.view.appendChild(lines);
  };
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
  mk_span = function(text, classes) {
    var view;
    view = document.createElement('span');
    text = document.createTextNode(text);
    view.appendChild(text);
    return add_classes(view, classes);
  };
  mk_div = function(classes) {
    return add_classes(document.createElement('div'), classes);
  };
  mk_img = function(classes, src) {
    var image;
    image = add_classes(document.createElement('IMG'), classes);
    image.src = src;
    return image;
  };
  mk_pre = function(classes) {
    return add_classes(document.createElement('pre'), classes);
  };
  return mk_single = function(text, level, classes) {
    var single;
    single = mk_div(classes);
    single.appendChild(mk_span(mkindent(level) + text));
    return single;
  };
})();
