var EXCEPTION;

EXCEPTION = {};

EXCEPTION.DuplicatedProcedure = (function() {
  var error;
  error = function(name) {
    this.name = 'DuplicatedProcedure';
    return this.message = "Duplicated procedure '" + name + "'";
  };
  error.prototype = Error.prototype;
  return error;
})();

EXCEPTION.ProcedureNotExist = (function() {
  var error;
  error = function(name) {
    this.name = 'ProcedureNotExist';
    return this.message = "'" + name + "' procedure not implemented";
  };
  error.prototype = Error.prototype;
  return error;
})();
