var link, resolved, synck;

synck = function(chain) {
  var data, error, has_error, has_success, instance, invoke, success;
  chain && chain.hold();
  has_success = false;
  has_error = false;
  success = [];
  error = [];
  data = void 0;
  invoke = function(callback) {
    return callback.apply({}, data);
  };
  instance = {
    success: function(callback) {
      if (has_error) {
        return this;
      }
      if (has_success) {
        invoke(callback);
        return this;
      }
      success.push(callback);
      return this;
    },
    error: function(callback) {
      if (has_error) {
        invoke(callback);
        return this;
      }
      if (has_success) {
        return this;
      }
      error.push(callback);
      return this;
    },
    always: function(callback) {
      if (has_error || has_success) {
        invoke(callback);
        return this;
      }
      error.push(callback);
      success.push(callback);
      return this;
    },
    resolve: function() {
      has_success = true;
      data = arguments;
      success.forEach(invoke);
      instance.close();
      return this;
    },
    failure: function() {
      has_error = true;
      data = arguments;
      error.forEach(invoke);
      instance.close(true);
      return this;
    },
    bind_error: function(other) {
      this.error(function() {
        other.failure(arguments);
      });
      return this;
    },
    bind_success: function(other) {
      this.success(function() {
        other.resolve(arguments);
      });
      return this;
    },
    close: function(with_error) {
      chain && chain.leave(with_error);
      this.resolve = this.failure = function() {
        console.log('WARNING: promise has end');
      };
    }
  };
  return instance;
};

resolved = function(result) {
  var args, instance;
  args = Array.prototype.slice.call(arguments, 1);
  instance = {
    success: function(callback) {
      if (result) {
        callback.apply(window, args);
      }
      return instance;
    },
    error: function(callback) {
      if (!result) {
        callback.apply(window, args);
      }
      return instance;
    },
    always: function(callback) {
      callback.apply(window, args);
      return instance;
    }
  };
  return instance;
};

link = function() {
  var always, call_all, error, has_error, instance, requests, success;
  requests = 0;
  success = [];
  error = [];
  always = [];
  has_error = void 0;
  call_all = function(callbacks) {
    callbacks.forEach(function(callback) {
      callback();
    });
  };
  instance = {
    subscribe: function(promise) {
      instance.hold();
      promise.success(instance.leave()).error(instance.leave(true));
    },
    hold: function() {
      requests += 1;
    },
    call_leave: function(error) {
      return function() {
        instance.leave(error);
      };
    },
    leave: function(with_error) {
      has_error = has_error || with_error;
      requests -= 1;
      if (requests === 0) {
        call_all(!has_error && success || error);
        call_all(always);
        instance.hold = function() {
          console.log('trying to hold blocked link');
        };
        success = error = always = [];
      }
    },
    success: function(callback) {
      if (!has_error) {
        if (requests === 0) {
          callback();
        } else {
          success.push(callback);
        }
      }
      return this;
    },
    error: function(callback) {
      if (requests === 0) {
        has_error && callback(has_error);
      } else {
        error.push(callback);
      }
      return this;
    },
    always: function(callback) {
      if (requests === 0) {
        callback(has_error);
      } else {
        always.push(callback);
      }
      return this;
    }
  };
  return instance;
};
