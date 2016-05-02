var interpreter;

interpreter = {};

(function() {
  var ACTIVE, TERMINATED, ast, context, environment, eval_exp, get_procedure, invocation, not_defined, root;
  ast = null;
  environment = null;
  invocation = function(name) {
    return {
      TYPE: 'INVOCATION',
      name: name
    };
  };
  not_defined = {};
  root = function() {
    return {
      activate: function() {
        return resolved(true, true);
      },
      deactivate: function() {},
      step: function() {
        return resolved(true, true);
      },
      scope: {}
    };
  };
  eval_exp = function(exp, scope) {
    switch (exp.TYPE) {
      case 'IDENTIFIER':
        return scope[exp.name];
      case 'NUMERIC':
        return parseInt(exp.value);
      case 'ADD':
        return eval_exp(exp.left, scope) + eval_exp(exp.right, scope);
      case 'SUB':
        return eval_exp(exp.left, scope) - eval_exp(exp.right, scope);
    }
  };
  get_procedure = function(name) {
    var procedure, required, _i, _len;
    required = null;
    for (_i = 0, _len = ast.length; _i < _len; _i++) {
      procedure = ast[_i];
      if (procedure.name === name) {
        if (!required) {
          required = procedure;
        } else {
          throw new EXCEPTION.DuplicatedProcedure(name);
        }
      }
    }
    if (!required) {
      throw new EXCEPTION.ProcedureNotExist(name);
    }
    return required;
  };
  ACTIVE = 'active';
  TERMINATED = 'terminated';
  context = {
    BLOCK: function(statements, parent) {
      return {
        scope: parent.scope,
        index: -1,
        activate: function() {
          this.index += 1;
          parent.view.scrollIntoView(false);
          if (statements.length > this.index) {
            statements[this.index].view.classList.add(ACTIVE);
          } else {
            parent.view.classList.add(TERMINATED);
          }
          return resolved(true);
        },
        deactivate: function() {
          if (statements.length > this.index) {
            statements[this.index].view.classList.remove(ACTIVE);
          }
          return parent.view.classList.remove(TERMINATED);
        },
        step: function() {
          var creator, evnt, next, next2;
          if (statements.length > this.index) {
            next = statements[this.index];
            creator = context[next.TYPE];
            try {
              next2 = creator(next, this);
            } catch (_error) {
              evnt = _error;
              return resolved(null, evnt.message);
            }
            return context.set_current(next2);
          } else {
            return context.set_current(parent);
          }
        }
      };
    },
    INVOCATION: function(invocation, parent) {
      var arg, procedure, scope, _i, _len, _ref;
      procedure = get_procedure(invocation.name);
      scope = {};
      _ref = invocation.args || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        arg = _ref[_i];
        scope[arg.name] = eval_exp(arg.value, parent.scope);
      }
      return {
        scope: scope,
        view: procedure.view,
        deactive_params: function() {
          var param_view, _j, _len1, _ref1, _results;
          _ref1 = procedure.view.params;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            param_view = _ref1[_j];
            param_view.setAttribute('title', '');
            _results.push(param_view.classList.remove(ACTIVE));
          }
          return _results;
        },
        activate: function() {
          var index, param_view, params_clone, _j, _k, _len1, _len2, _ref1, _ref2;
          if (!this.processed) {
            this.processed = true;
            params_clone = procedure.params && procedure.params.slice() || [];
            _ref1 = invocation.args || [];
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              arg = _ref1[_j];
              index = params_clone.indexOf(arg.name);
              if (index > -1) {
                params_clone.splice(index, 1);
              } else {
                this.deactive_params();
                return resolved(null, 'line ' + invocation.line + ': ' + procedure.name + ': no se esperaba el argumento ' + arg.name);
              }
            }
            if (params_clone.length) {
              this.deactive_params();
              return resolved(null, 'line ' + invocation.line + ': ' + procedure.name + ': argumentos faltantes [' + params_clone.join(',') + ']');
            }
            _ref2 = procedure.view.params;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              param_view = _ref2[_k];
              param_view.setAttribute('title', this.scope[param_view.param_name]);
              param_view.classList.add(ACTIVE);
            }
            return context.set_current(context.BLOCK(procedure.statements, this));
          } else {
            this.deactive_params();
            return context.set_current(parent);
          }
        },
        deactivate: function() {}
      };
    },
    CONDITIONAL: function(conditional, parent) {
      return {
        scope: parent.scope,
        view: conditional.view,
        activate: function() {
          var promise;
          if (!this.processed) {
            promise = synck();
            this.processed = true;
            environment.examine(conditional.condition).success((function(_this) {
              return function(result) {
                var defer;
                if (conditional.negate) {
                  result = !result;
                }
                if (result) {
                  return context.set_current(context.BLOCK(conditional.positive, _this)).success(function() {
                    return promise.resolve();
                  }).error(function() {
                    return promise.failure();
                  });
                } else {
                  if (conditional.negative) {
                    defer = context.set_current(context.BLOCK(conditional.negative, _this));
                  } else {
                    defer = context.set_current(parent);
                  }
                  defer.success(function() {
                    return promise.resolve();
                  });
                  return defer.error(function() {
                    return promise.failure();
                  });
                }
              };
            })(this));
            return promise;
          } else {
            return context.set_current(parent);
          }
        },
        deactivate: function() {
          return conditional.view.classList.remove(ACTIVE);
        }
      };
    },
    REPEAT: function(repeat, parent) {
      return {
        scope: parent.scope,
        view: repeat.view,
        processed: 0,
        amount: eval_exp(repeat.index, parent.scope),
        activate: function() {
          if (this.processed < this.amount) {
            this.processed += 1;
            return context.set_current(context.BLOCK(repeat.statements, this));
          } else {
            return context.set_current(parent);
          }
        },
        deactivate: function() {
          return repeat.view.classList.remove(ACTIVE);
        }
      };
    },
    ACTION: function(action, parent) {
      return {
        scope: parent.scope,
        activate: function() {
          var promise;
          promise = synck();
          environment.effect(action.name).success((function(_this) {
            return function() {
              return context.set_current(parent).success(function() {
                return promise.resolve();
              }).error(function() {
                return promise.failure();
              });
            };
          })(this)).error((function(_this) {
            return function(data) {
              return promise.failure(data);
            };
          })(this));
          return promise;
        },
        deactivate: function() {
          return action.view.classList.remove(ACTIVE);
        }
      };
    }
  };
  (function() {
    var current;
    current = null;
    Object.defineProperty(context, 'current', {
      get: function() {
        return current;
      },
      set: function(next) {
        throw new Error('cannot set current as attribute');
      }
    });
    return context.set_current = function(next) {
      current && current.deactivate();
      current = next;
      return current.activate();
    };
  })();
  interpreter.reset = function() {
    return context.set_current(context.INVOCATION({
      name: 'main'
    }, root()));
  };
  interpreter.load = function(next_ast, next_environment) {
    ast = next_ast;
    environment = next_environment;
    return this.reset();
  };
  interpreter.step = function() {
    return context.current.step();
  };
  return interpreter.deactivate = function() {
    return context.current && context.current.deactivate();
  };
})();
