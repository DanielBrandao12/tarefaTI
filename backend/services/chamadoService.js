const Chamado = require('../database/models/tickets');

async function criarChamado(chamado) {
  return await Chamado.create(chamado);
}

module.exports = { criarChamado };
