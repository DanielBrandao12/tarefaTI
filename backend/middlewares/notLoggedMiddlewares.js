const notLoggedMiddlewares = (req, res, next) => {
  if (req.session.userLogged) {
    next();
  } else {
    res.status(401).json('Usuário não autenticado');
  }

};

module.exports = notLoggedMiddlewares;