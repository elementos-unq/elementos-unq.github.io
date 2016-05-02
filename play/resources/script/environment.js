var environment;

environment = {};

(function() {
  var actions, conditions, count, current;
  count = 0;
  current = {
    x: 1,
    y: 1,
    max_x: 7,
    min_x: 0,
    max_y: 7,
    min_y: 0
  };
  actions = {
    MoverNorte: function() {
      if (current.y > current.min_y) {
        current.y -= 1;
        board.set_current(current);
        return {
          error: false
        };
      } else {
        return {
          error: true,
          description: 'Fin del tablero al norte'
        };
      }
    },
    MoverOeste: function() {
      if (current.x > current.min_x) {
        current.x -= 1;
        board.set_current(current);
        return {
          error: false
        };
      } else {
        return {
          error: true,
          description: 'Fin del tablero al Oeste'
        };
      }
    },
    MoverSur: function() {
      if (current.y < current.max_y) {
        current.y += 1;
        board.set_current(current);
        return {
          error: false
        };
      } else {
        return {
          error: true,
          description: 'Fin del tablero al Sur'
        };
      }
    },
    MoverEste: function() {
      if (current.x < current.max_x) {
        current.x += 1;
        board.set_current(current);
        return {
          error: false
        };
      } else {
        return {
          error: true,
          description: 'Fin del tablero al Este'
        };
      }
    },
    PintarNegro: function() {
      board.PintarNegro();
      return {
        error: false
      };
    },
    PintarVerde: function() {
      board.PintarVerde();
      return {
        error: false
      };
    },
    PintarRojo: function() {
      board.PintarRojo();
      return {
        error: false
      };
    },
    Despintar: function() {
      board.Despintar();
      return {
        error: false
      };
    }
  };
  conditions = {
    estaPintado: function() {
      return board.estaPintado();
    },
    estaPintadoDeNegro: function() {
      return board.estaPintadoDeNegro();
    },
    estaPintadoDeVerde: function() {
      return board.estaPintadoDeVerde();
    },
    estaPintadoDeRojo: function() {
      return board.estaPintadoDeRojo();
    },
    puedoMoverSur: function() {
      return current.y < current.max_y;
    },
    puedoMoverNorte: function() {
      return current.y > current.min_y;
    },
    puedoMoverEste: function() {
      return current.x < current.max_x;
    },
    puedoMoverOeste: function() {
      return current.x > current.min_x;
    }
  };
  environment.examine = function(key) {
    var result;
    result = conditions[key]();
    return resolved(true, result);
  };
  environment.effect = function(key) {
    var result;
    result = actions[key]();
    return resolved(!result.error, result.description);
  };
  environment.view = board.view;
  board.resize(current);
  environment.resize = function(w, h) {
    current.max_y = h - 1;
    current.max_x = h - 1;
    if (current.x > current.max_x) {
      current.x = current.max_x;
    }
    if (current.y > current.max_y) {
      current.y = current.max_y;
    }
    return board.resize(current);
  };
  environment.left = function() {
    return conditions.puedoMoverOeste() && actions.MoverOeste();
  };
  environment.right = function() {
    return conditions.puedoMoverEste() && actions.MoverEste();
  };
  environment.up = function() {
    return conditions.puedoMoverNorte() && actions.MoverNorte();
  };
  return environment.down = function() {
    return conditions.puedoMoverSur() && actions.MoverSur();
  };
})();
