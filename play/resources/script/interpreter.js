var interpreter;

interpreter = {};

(function() {
  var ACTIVE, TERMINATED, ast, context, environment, get_procedure, invocation, mkscope, root;
  ast = null;
  environment = null;
  invocation = function(name) {
    return {
      TYPE: 'INVOCATION',
      name: name
    };
  };
  mkscope = function(parent) {
    var scope;
    scope = {};
    scope.__proto__ = parent;
    return scope;
  };
  root = function() {
    return {
      activate: function() {
        return resolved(true, true);
      },
      deactivate: function() {},
      step: function() {
        return resolved(true, true);
      }
    };
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
          var creator, next;
          if (statements.length > this.index) {
            next = statements[this.index];
            creator = context[next.TYPE];
            return context.set_current(creator(next, this));
          } else {
            return context.set_current(parent);
          }
        }
      };
    },
    INVOCATION: function(invocation, parent) {
      var procedure;
      procedure = get_procedure(invocation.name);
      return {
        view: procedure.view,
        activate: function() {
          if (!this.processed) {
            this.processed = true;
            return context.set_current(context.BLOCK(procedure.statements, this));
          } else {
            return context.set_current(parent);
          }
        },
        deactivate: function() {}
      };
    },
    CONDITIONAL: function(conditional, parent) {
      return {
        view: conditional.view,
        activate: function() {
          var promise;
          if (!this.processed) {
            promise = synck();
            this.processed = true;
            environment.examine(conditional.condition).success((function(_this) {
              return function(result) {
                var defer;
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
        view: repeat.view,
        processed: 0,
        amount: repeat.index.value,
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
