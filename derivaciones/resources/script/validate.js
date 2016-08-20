var validate;

window.onload = function() {
  var ast, example, index, parser, validateInput, _i, _len, _results;
  validateInput = document.querySelector('#validatePreety');
  parser = new elementos.Parser;
  _results = [];
  for (index = _i = 0, _len = validate.length; _i < _len; index = ++_i) {
    example = validate[index];
    ast = validator.validate(example, parser);
    if (ast) {
      viewer.process(ast);
      if (index % 3 === 0) {
        ast.root.view.classList.add('pull-left');
      }
      ast.root.view.title = example;
      _results.push(validateInput.appendChild(ast.root.view));
    } else {
      _results.push(validateInput.appendChild(document.createTextNode('error al procesar')));
    }
  }
  return _results;
};

validate = [" 1. (p | t) → ¬¬r premisa      \n" + " 2. ¬(p → r) premisa           \n" + "    -------------------        \n" + " 3.| (q → p) supuesto  |       \n" + "   | ----------------  |       \n" + " 4.|| p supuesto     | |       \n" + " 5.|| (p | t) Iv(4)  | |       \n" + " 6.|| ¬¬r E→(1,5)    | |       \n" + " 7.|| r ¬¬(6)        | |       \n" + "   | ----------------  |       \n" + " <<                            \n" + " 8.| (p → r) I→(4-7)   |       \n" + " 9.| ⊥ E¬(2,8)         |       \n" + "    -------------------        \n" + " <<                            \n" + "10. ¬(q → p) I¬(3-9)             ", " 1. p → q premisa        \n" + " 2. p ∨ r premisa        \n" + " --------------          \n" + " 3.| p supuesto   |      \n" + " 4.| q E →(1,3)   |      \n" + " 5.| q v r Iv(4)  |      \n" + "    --------------       \n" + "   <<                    \n" + " 6. p → (q v r) I→(3-5)  \n" + "    --------------       \n" + " 7.| r supuesto   |      \n" + " 8.| q v r Iv(7)  |      \n" + "    --------------       \n" + "   <<                    \n" + " 9. r → (q v r) I→(7-8)  \n" + "10. q v r Ev(2, 6, 9)    ", " 1. (p ∧ q ) → r premisa     \n" + "    -------------------      \n" + " 2.| p supuesto        |     \n" + "   | ----------------  |     \n" + " 3.|| q supuesto     | |     \n" + " 4.|| p ∧ q I∧(2,3)  | |     \n" + " 5.|| r E→(1,4)      | |     \n" + "   | ----------------  |     \n" + "   | <<                |     \n" + " 6.| (q → r) I→(3-5)   |     \n" + "    <<                       \n" + "    -------------------      \n" + " 7. p → (q → r) I → (2-6)    ", " 1. q → r premisa        \n" + " 2. (t V u) → q premisa  \n" + " 3. ¬s → ¬¬q premisa     \n" + " 4. (t V ¬s) supuesto    \n" + " 5. ¬s supuesto          \n" + " 6. ¬¬q E→(3,5)          \n" + " 7. q ¬¬(6)              \n" + "<<                       \n" + " 8. ¬s → q I→(5-7)       \n" + " 9. t supuesto           \n" + "10. (t V u) IV(9)        \n" + "11. q E→(2,10)           \n" + "<<                       \n" + "12. t → q I→(9-11)       \n" + "13. q EV(4,8,12)         \n" + "14. r E→(1,13)           \n" + "<<                       \n" + "15. (t V ¬s) → r I→(4-14)  ", " 1:¬¬(qVr) premisa \n" + " 2:q→r premisa     \n" + " 3:qVr ¬¬(1)         ", " 1:qVq premisa     \n" + " 2:q→r premisa     \n" + " 3:r EV(1,2)         ", " 1:qVr premisa     \n" + " 2:r→s premisa     \n" + " 3:q→s premisa     \n" + " 4:s EV(1,2,3)         ", " 1:r premisa       \n" + " 2:r→q supuesto    \n" + " 3:q E→(1,2)       \n" + " <<                \n" + " 4:(r→q)→q I→(2-3)   ", " 1:r premisa      \n" + " 2:¬r supuesto    \n" + " 3:⊥ E¬(1,2)      \n" + " <<               \n" + " 4:¬r → ⊥ I→(2-3)   ", " 1:q premisa      \n" + " 2:q Λ q IΛ(1)", " 1:q premisa      \n" + " 2:r premisa      \n" + " 3:q Λ r IΛ(1,2)", " 1:q premisa      \n" + " 2:q V q IV(1)", " 1:q premisa      \n" + " 2:q V r IV(1)"];
