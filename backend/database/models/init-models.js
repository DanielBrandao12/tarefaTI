var DataTypes = require("sequelize").DataTypes;
var _categorias = require("./categorias");
var _clientes = require("./clientes");
var _historico_status = require("./historico_status");
var _respostas = require("./respostas");
var _status = require("./status");
var _tickets = require("./tickets");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var categorias = _categorias(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var historico_status = _historico_status(sequelize, DataTypes);
  var respostas = _respostas(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);
  var tickets = _tickets(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);

  tickets.belongsTo(categorias, { as: "id_categoria_categoria", foreignKey: "id_categoria"});
  categorias.hasMany(tickets, { as: "tickets", foreignKey: "id_categoria"});
  historico_status.belongsTo(status, { as: "id_status_status", foreignKey: "id_status"});
  status.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_status"});
  tickets.belongsTo(status, { as: "id_status_status", foreignKey: "id_status"});
  status.hasMany(tickets, { as: "tickets", foreignKey: "id_status"});
  clientes.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket"});
  tickets.hasMany(clientes, { as: "clientes", foreignKey: "id_ticket"});
  historico_status.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket"});
  tickets.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_ticket"});
  respostas.belongsTo(tickets, { as: "id_ticket_ticket", foreignKey: "id_ticket"});
  tickets.hasMany(respostas, { as: "resposta", foreignKey: "id_ticket"});
  historico_status.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(historico_status, { as: "historico_statuses", foreignKey: "id_usuario"});
  respostas.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(respostas, { as: "resposta", foreignKey: "id_usuario"});
  tickets.belongsTo(usuarios, { as: "id_usuario_usuario", foreignKey: "id_usuario"});
  usuarios.hasMany(tickets, { as: "tickets", foreignKey: "id_usuario"});

  return {
    categorias,
    clientes,
    historico_status,
    respostas,
    status,
    tickets,
    usuarios,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
