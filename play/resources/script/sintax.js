var check_code, fill_code, load, save, save_code;

load = function() {
  return '';
};

save = function() {};

save_code = function() {};

check_code = function() {};

fill_code = function() {};

window.onload = function() {
  var input, output, pretty, storage_key;
  input = document.querySelector('#codeInput');
  output = document.querySelector('#codeOutput');
  pretty = document.querySelector('#codePreety');
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
  check_code = function() {
    var ast, evnt, parsed, parser;
    parser = new elementos.Parser;
    try {
      ast = parser.parse(input.value);
      parsed = JSON.stringify(ast, null, 2);
    } catch (_error) {
      evnt = _error;
      parsed = evnt.message;
    }
    return output.value = parsed;
  };
  return fill_code = function() {
    var ast, evnt, parser;
    while (pretty.firstChild) {
      pretty.removeChild(pretty.firstChild);
    }
    parser = new elementos.Parser;
    try {
      ast = parser.parse(input.value);
      coder.process(ast);
      return pretty.appendChild(ast.view);
    } catch (_error) {
      evnt = _error;
      return pretty.innerHTML = evnt.message.replace(/\n/g, '</br>');
    }
  };
};
