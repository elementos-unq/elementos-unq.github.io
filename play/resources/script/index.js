var fill_code, load, save, save_code;

load = function() {
  return '';
};

save = function() {};

save_code = function() {};

fill_code = function() {};

window.onload = function() {
  var MODE, action_text, allow_execute_change, ast, asynk, boardContainer, board_height, board_width, countdown, error_change, error_text, execcode, fix_body_css, handle_key, input, iterator, makeloop, makeloop_synk, output, pretty, processing_change, reset_count_down, scope, second_pass, show_error, show_processing_change, stopped_change, storage_key, swap_state, time_left_change, timeout_text, vh_support;
  input = document.querySelector('#codeInput');
  output = document.querySelector('#codeOutput');
  pretty = document.querySelector('#codePreety');
  iterator = document.querySelector('#iterator');
  board_width = iterator.querySelector('#boardWidth');
  board_height = iterator.querySelector('#boardHeight');
  boardContainer = document.querySelector('#boardContainer');
  error_text = document.querySelector('#error');
  execcode = document.querySelector('#execCode');
  action_text = execcode.querySelector('#action');
  timeout_text = execcode.querySelector('#timeout');
  allow_execute_change = function() {
    if (scope.allow_execute) {
      return action_text.innerHTML = 'Ejecutar';
    } else {
      return action_text.innerHTML = 'Restante: ';
    }
  };
  time_left_change = function() {
    if (scope.time_left > 0) {
      return timeout_text.innerHTML = scope.time_left;
    } else {
      return timeout_text.innerHTML = '';
    }
  };
  processing_change = function() {
    var PROCESSING;
    PROCESSING = 'processing';
    if (scope.processing) {
      return iterator.classList.add(PROCESSING);
    } else {
      return iterator.classList.remove(PROCESSING);
    }
  };
  show_processing_change = function() {
    var SHOW_PROCESSING;
    SHOW_PROCESSING = 'show-processing';
    if (scope.show_processing) {
      return iterator.classList.add(SHOW_PROCESSING);
    } else {
      return iterator.classList.remove(SHOW_PROCESSING);
    }
  };
  stopped_change = function() {
    var STOPPED;
    STOPPED = 'stopped';
    if (scope.stopped) {
      return iterator.classList.add(STOPPED);
    } else {
      return iterator.classList.remove(STOPPED);
    }
  };
  error_change = function() {
    var ERROR;
    ERROR = 'error';
    if (scope.error) {
      return iterator.classList.add(ERROR);
    } else {
      return iterator.classList.remove(ERROR);
    }
  };
  scope = {};
  second_pass = function() {
    scope.time_left -= 1;
    if (!scope.allow_execute) {
      return countdown();
    }
  };
  countdown = function() {
    return window.setTimeout(second_pass, 1000);
  };
  reset_count_down = function() {
    scope.reset_time_left();
    return countdown();
  };
  (function() {
    var WAIT_TIME, allow_execute, has_error, processing, show_processing, stopped, time_left;
    processing = null;
    Object.defineProperty(scope, 'processing', {
      get: function() {
        return processing;
      },
      set: function(next) {
        if (next !== processing) {
          processing = next;
          return processing_change();
        }
      }
    });
    show_processing = null;
    Object.defineProperty(scope, 'show_processing', {
      get: function() {
        return show_processing;
      },
      set: function(next) {
        if (next !== show_processing) {
          show_processing = next;
          return show_processing_change();
        }
      }
    });
    stopped = null;
    Object.defineProperty(scope, 'stopped', {
      get: function() {
        return stopped;
      },
      set: function(next) {
        if (next !== stopped) {
          stopped = next;
          return stopped_change();
        }
      }
    });
    has_error = null;
    Object.defineProperty(scope, 'error', {
      get: function() {
        return has_error;
      },
      set: function(next) {
        if (next !== has_error) {
          has_error = next;
          return error_change();
        }
      }
    });
    WAIT_TIME = 3;
    time_left = WAIT_TIME;
    allow_execute = false;
    Object.defineProperty(scope, 'time_left', {
      get: function() {
        return time_left;
      },
      set: function(next) {
        time_left = next;
        time_left_change();
        if (time_left > 0 && allow_execute) {
          allow_execute = false;
          allow_execute_change();
        }
        if (time_left === 0 && !allow_execute) {
          allow_execute = true;
          return allow_execute_change();
        }
      }
    });
    Object.defineProperty(scope, 'allow_execute', {
      get: function() {
        return allow_execute;
      },
      set: function(next) {
        throw new Error('cannot set allow_execute property');
      }
    });
    return scope.reset_time_left = function() {
      return scope.time_left = WAIT_TIME;
    };
  })();
  MODE = {
    INPUT: 'input-mode',
    PRETTY: 'pretty-mode',
    ITERATE: 'iterate-mode'
  };
  MODE.CURRENT = MODE.INPUT;
  ast = null;
  swap_state = function(state) {
    document.body.classList.remove(MODE.CURRENT);
    MODE.CURRENT = state;
    return document.body.classList.add(state);
  };
  vh_support = function() {
    var actual, support, testvh, unexpected, vh_val;
    testvh = document.createElement('div');
    vh_val = '10vh';
    unexpected = '1px';
    testvh.style.height = unexpected;
    testvh.style.height = vh_val;
    document.body.appendChild(testvh);
    actual = window.getComputedStyle(testvh).height;
    support = actual !== unexpected;
    document.body.removeChild(testvh);
    return support;
  };
  fix_body_css = function() {
    if (!vh_support()) {
      return document.body.classList.add('force-vh-support');
    }
  };
  if (typeof Storage !== 'undefined') {
    storage_key = 'elementos.code';
    save = function(code) {
      return localStorage.setItem(storage_key, code);
    };
    load = function(code) {
      return localStorage.getItem(storage_key);
    };
    save_code = function() {
      return save(input.value);
    };
  }
  input.value = load();
  fix_body_css();
  fill_code = function() {
    var evnt, parser;
    while (pretty.firstChild) {
      pretty.removeChild(pretty.firstChild);
    }
    parser = new elementos.Parser;
    try {
      ast = parser.parse(input.value);
    } catch (_error) {
      evnt = _error;
      ast = null;
      pretty.innerHTML = evnt.message.replace(/\n/g, '</br>');
    }
    if (ast) {
      coder.process(ast);
      pretty.appendChild(ast.view);
    }
    return swap_state(MODE.PRETTY);
  };
  boardContainer.appendChild(environment.view);
  show_error = function(error) {
    error_text.innerHTML = error;
    scope.error = true;
    return scope.stopped = true;
  };
  window.exec_code = function() {
    var evnt;
    if (ast && scope.allow_execute) {
      scope.error = false;
      scope.stopped = false;
      swap_state(MODE.ITERATE);
      try {
        interpreter.load(ast, environment);
      } catch (_error) {
        evnt = _error;
        show_error(evnt);
      }
      reset_count_down();
    }
    return document.activeElement.blur();
  };
  asynk = function(callback) {
    return window.setTimeout(callback, 1);
  };
  window.step = function() {
    document.activeElement.blur();
    if (!(scope.processing || scope.error || (MODE.CURRENT !== MODE.ITERATE))) {
      scope.processing = true;
      return asynk(function() {
        return interpreter.step().success(function(end) {
          scope.processing = false;
          if (end) {
            return scope.stopped = true;
          }
        }).error(function(error) {
          scope.processing = false;
          return show_error(error);
        });
      });
    }
  };
  makeloop = function() {
    var on_error, on_success;
    on_error = function(error) {
      scope.processing = false;
      return show_error(error);
    };
    on_success = function(end) {
      if (end) {
        scope.processing = false;
        return scope.stopped = true;
      } else {
        return asynk(function() {
          return interpreter.step().success(on_success).error(on_error);
        });
      }
    };
    return asynk(function() {
      return interpreter.step().success(on_success).error(on_error);
    });
  };
  makeloop_synk = function() {
    var on_error, on_success;
    on_error = function() {
      scope.processing = false;
      scope.show_processing = false;
      return show_error(error);
    };
    on_success = function(end) {
      if (end) {
        scope.processing = false;
        scope.show_processing = false;
        return scope.stopped = true;
      } else {
        return interpreter.step().success(on_success).error(on_error);
      }
    };
    return interpreter.step().success(on_success).error(on_error);
  };
  window.run = function() {
    document.activeElement.blur();
    if (!(scope.processing || scope.error)) {
      scope.processing = true;
      return makeloop();
    }
  };
  window.run_all = function() {
    document.activeElement.blur();
    if (!(scope.processing || scope.error)) {
      scope.processing = true;
      scope.show_processing = true;
      return asynk(makeloop_synk);
    }
  };
  window.reset = function() {
    document.activeElement.blur();
    if (!scope.processing) {
      scope.processing = true;
      scope.stopped = false;
      scope.error = false;
      interpreter.deactivate();
      interpreter.load(ast, environment);
      return scope.processing = false;
    }
  };
  window.resize = function() {
    var h, h_val, w, w_val;
    document.activeElement.blur();
    w_val = board_width.value;
    h_val = board_height.value;
    w = w_val && w_val > 0 ? w_val : 1;
    h = h_val && h_val > 0 ? h_val : 1;
    return environment.resize(w, h);
  };
  window.input_mode = function() {
    interpreter.deactivate();
    return swap_state(MODE.INPUT);
  };
  window.pretty_mode = function() {
    if (MODE.CURRENT === MODE.ITERATE) {
      interpreter.deactivate();
      return swap_state(MODE.PRETTY);
    }
  };
  handle_key = function(evnt) {
    var keyCode;
    keyCode = evnt.keyCode;
    if (keyCode === 13) {
      window.step();
    }
    if (keyCode === 37) {
      environment.left();
    }
    if (keyCode === 39) {
      environment.right();
    }
    if (keyCode === 38) {
      environment.up();
    }
    if (keyCode === 40) {
      return environment.down();
    }
  };
  document.addEventListener('keydown', handle_key, false);
  return reset_count_down();
};
