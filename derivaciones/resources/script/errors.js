var errors, errors_all;

window.onload = function() {
  var ast, error, errorsInput, index, parser, _i, _len, _results;
  errorsInput = document.querySelector('#errorsPreety');
  parser = new elementos.Parser;
  _results = [];
  for (index = _i = 0, _len = errors.length; _i < _len; index = ++_i) {
    error = errors[index];
    ast = validator.validate(error, parser);
    if (ast) {
      viewer.process(ast);
      if (index % 3 === 0) {
        ast.root.view.classList.add('pull-left');
      }
      ast.root.view.title = error;
      _results.push(errorsInput.appendChild(ast.root.view));
    } else {
      _results.push(errorsInput.appendChild(document.createTextNode('error al procesar')));
    }
  }
  return _results;
};

errors = [" 1:¬q premisa      \n" + " 2:q→r premisa     \n" + " 3:q supuesto      \n" + " 4:¬r R(1)         \n" + " 5:r E→(1,2)       \n" + " 6:⊥ E¬(5,6)       \n" + " <<                \n" + " 7:(q→r)→q I→(2-3)   ", " 1:¬q premisa      \n" + " 2:q→r premisa     \n" + " 3:q supuesto      \n" + " 4:¬r R(1,2)       \n" + " 5:r E→(1,2)       \n" + " 6:⊥ E¬(5,6)       \n" + " <<                \n" + " 7:(q→r)→q I→(2-3)   ", " 1:r premisa       \n" + " 2:q→r supuesto    \n" + " <<                \n" + " 3:q supuesto      \n" + " 4:(q→r)→q I→(2-3)   ", " 1:¬(qΛr) premisa  \n" + " 2:(qΛr) premisa   \n" + " 3:⊥ E¬(1,2)       \n" + " 4:m EFSQ(1,2)   ", " 1:¬(qΛr) premisa  \n" + " 2:(qΛs) premisa   \n" + " 3:m EFSQ(1)   ", " 1:¬¬(qΛr) premisa  \n" + " 2:(qΛs) ¬¬(1)      ", " 1:¬(qΛr) premisa  \n" + " 2:(qΛr) ¬¬(1)      ", " 1:qΛq premisa     \n" + " 2:q→r premisa     \n" + " 3:r EV(1,2)         ", " 1:qVr premisa     \n" + " 2:r→s premisa     \n" + " 3:q→s premisa     \n" + " 4:r EV(1,2,3)         ", " 1:qVq premisa     \n" + " 2:q→r premisa     \n" + " 3:r EV(1)         ", " 1:qVr premisa     \n" + " 2:r→s premisa     \n" + " 3:q→s premisa     \n" + " 4:s EV(1,2)         ", " 1:r premisa       \n" + " 2:q→r supuesto    \n" + " 3:q E→(1,2)       \n" + " <<                \n" + " 4:(q→r)→q I→(2-3)   ", " 1:r premisa      \n" + " 2:¬q supuesto    \n" + " 3:⊥ E¬(1,2)      \n" + " <<               \n" + " 4:¬r → ⊥ I→(2-3)    ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:⊥ E¬(2)      \n" + " <<               \n" + " 4:¬r → ⊥ I→(2-3)    ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:p E¬(1,2)      \n" + " <<               \n" + " 4:r → p I→(2-3)    ", " 1:r premisa      \n" + " 2:¬r  I¬(2-3)      ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:⊥ E¬(1,2)      \n" + " <<               \n" + " 4:r I¬(2-3)        ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:⊥ E¬(1,2)      \n" + " <<               \n" + " 4:r → ⊥  I→(2-3)   ", " 1:r premisa      \n" + " 2:¬r → ⊥  I→(2-3)  ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:⊥ E¬(1,2)      \n" + " <<               \n" + " 4:¬r Λ ⊥  I→(2-3)  ", " 1:q Λ r premisa  \n" + " 2:s Λ r premisa  \n" + " 3:s V q IV(1,2)", " 1:q premisa      \n" + " 2:q IV(1)          ", " 1:q premisa      \n" + " 2:s Λ r premisa  \n" + " 3:q Λ (s Λ r) IΛ(2)", " 1:q premisa      \n" + " 2:s Λ r premisa  \n" + " 3:r Λ (s Λ r) IΛ(2)", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:q IΛ(2)          ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:q EΛ(2)          ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s EΛ(1,2)        ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s supuesto     \n" + " 4:r supuesto     \n" + " <<               \n" + " <<                 ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " <<               \n" + " 3:¬q I¬(3-5)       ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s EΛ(2)        \n" + " 4:q supuesto     \n" + " 5:s E→(1,2)      \n" + " 6:⊥ E¬(2,3)      \n" + " <<               \n" + " 7:¬q I¬(3-5)       ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s EΛ(2)        \n" + " 4:q supuesto     \n" + " 5:s E→(1,2)      \n" + " 6:⊥ E¬(2,3)      \n" + " <<               \n" + " 7:¬q I¬(3,4)       ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s EΛ(4)          ", " 1:q → ¬s premisa \n" + " 2:s Λ r premisa  \n" + " 3:s EΛ(3)          "];

errors_all = [];
