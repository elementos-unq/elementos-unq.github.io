var coder;

coder = {};

(function() {
  var add_classes, exp_nodes, fill_procedure, indent, mk_block, mk_div, mk_pre, mk_signature, mk_single, mk_span, mkindent, mkstatement;
  indent = '    ';
  mkstatement = {
    INVOCATION: function(invocation, level) {
      var arg, arg_node, args, index, last, view, _i, _j, _len, _len1, _ref;
      view = invocation.view = mk_div(['invocation']);
      view.appendChild(mk_span(mkindent(level)));
      view.appendChild(mk_span('[', ['bracket-start']));
      view.appendChild(mk_span(invocation.name, ['name']));
      if (args = invocation.args) {
        view.appendChild(mk_span(' {', ['brace-start']));
        last = args.length - 1;
        for (index = _i = 0, _len = args.length; _i < _len; index = ++_i) {
          arg = args[index];
          view.appendChild(mk_span(arg.name, ['arg-name']));
          view.appendChild(mk_span(':'));
          _ref = exp_nodes(arg.value);
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            arg_node = _ref[_j];
            view.appendChild(arg_node);
          }
          if (index < last) {
            view.appendChild(mk_span(', '));
          }
        }
        view.appendChild(mk_span('}', ['brace-end']));
      }
      view.appendChild(mk_span(']', ['bracket-end']));
      return view;
    },
    CONDITIONAL: function(conditional, level) {
      var condition_row, view;
      view = conditional.view = mk_div(['conditional']);
      condition_row = mk_div(['condition-row']);
      condition_row.appendChild(mk_span(mkindent(level)));
      condition_row.appendChild(mk_span('Si', ['conditional-if']));
      condition_row.appendChild(mk_span('(', ['semi-start']));
      if (conditional.negate) {
        condition_row.appendChild(mk_span('no ', ['negation']));
      }
      condition_row.appendChild(mk_span(conditional.condition, ['condition']));
      condition_row.appendChild(mk_span(')', ['semi-end']));
      condition_row.appendChild(mk_span('Entonces', ['conditional-then']));
      view.appendChild(condition_row);
      view.appendChild(mk_block(conditional.positive, level));
      if (conditional.negative) {
        view.appendChild(mk_single('Else', level, ['conditional-else']));
        view.appendChild(mk_block(conditional.negative, level));
      }
      return view;
    },
    REPEAT: function(repeat, level) {
      var end_row, exp_node, statement, view, _i, _j, _len, _len1, _ref, _ref1;
      view = repeat.view = mk_div(['repeat']);
      view.appendChild(mk_single('(', level, ['repeat-start']));
      _ref = repeat.statements;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statement = _ref[_i];
        view.appendChild(mkstatement[statement.TYPE](statement, level + 1));
      }
      end_row = mk_div(['end-row']);
      end_row.appendChild(mk_span(mkindent(level)));
      end_row.appendChild(mk_span(')', ['repeat-end']));
      _ref1 = exp_nodes(repeat.index);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        exp_node = _ref1[_j];
        end_row.appendChild(exp_node);
      }
      view.appendChild(end_row);
      return view;
    },
    ACTION: function(action, level) {
      var view;
      view = action.view = mk_div(['action']);
      view.appendChild(mk_single(action.name, level, ['action-name']));
      return view;
    }
  };
  exp_nodes = function(value) {
    var plus;
    switch (value.TYPE) {
      case 'IDENTIFIER':
        return [mk_span(value.name, ['arg-identifier'])];
      case 'NUMERIC':
        return [mk_span(value.value, ['arg-number'])];
      case 'ADD':
        plus = mk_span(' + ', ['arg-add']);
        return exp_nodes(value.left).concat([plus]).concat(exp_nodes(value.right));
      case 'SUB':
        plus = mk_span(' - ', ['arg-sub']);
        return exp_nodes(value.left).concat([plus]).concat(exp_nodes(value.right));
    }
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
  mk_pre = function(classes) {
    return add_classes(document.createElement('pre'), classes);
  };
  mk_single = function(text, level, classes) {
    var single;
    single = mk_div(classes);
    single.appendChild(mk_span(mkindent(level) + text));
    return single;
  };
  mk_block = function(statements, level) {
    var block, statement, _i, _len;
    block = mk_div(['block']);
    block.appendChild(mk_single('Inicio', level, ['block-start']));
    for (_i = 0, _len = statements.length; _i < _len; _i++) {
      statement = statements[_i];
      block.appendChild(mkstatement[statement.TYPE](statement, level + 1));
    }
    block.appendChild(mk_single('Fin', level, ['block-end']));
    return block;
  };
  mk_signature = function(procedure) {
    var index, last, param, param_text, params, signature, _i, _len;
    procedure.view.params = [];
    signature = mk_div(['signature']);
    signature.appendChild(mk_span(mkindent(0) + procedure.name, ['name']));
    if (params = procedure.params) {
      signature.appendChild(mk_span(' {', ['brace-start']));
      last = params.length - 1;
      for (index = _i = 0, _len = params.length; _i < _len; index = ++_i) {
        param = params[index];
        param_text = mk_span(param, ['param-name']);
        param_text.param_name = param;
        procedure.view.params.push(param_text);
        signature.appendChild(param_text);
        if (index < last) {
          signature.appendChild(mk_span(', '));
        }
      }
      signature.appendChild(mk_span('}', ['brace-end']));
    }
    signature.appendChild(mk_span(':'));
    return signature;
  };
  fill_procedure = function(procedure) {
    var view;
    view = procedure.view = mk_div(['procedure']);
    view.appendChild(mk_signature(procedure));
    return view.appendChild(mk_block(procedure.statements, 0));
  };
  mkindent = function(level) {
    var space;
    level = level > 0 ? level : 0;
    space = ' ';
    while (level--) {
      space += indent;
    }
    return space;
  };
  return coder.process = function(ast) {
    var main, procedure, _i, _len;
    main = mk_pre(['ast']);
    for (_i = 0, _len = ast.length; _i < _len; _i++) {
      procedure = ast[_i];
      fill_procedure(procedure);
      main.appendChild(procedure.view);
      main.appendChild(mk_single('', 0));
    }
    return ast.view = main;
  };
})();
