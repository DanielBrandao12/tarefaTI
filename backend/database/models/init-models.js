var DataTypes = require("sequelize").DataTypes;
var _tb_lab_sala = require("./tb_lab_sala");
var _tb_maquina = require("./tb_maquina");
var _tb_software = require("./tb_software");
var _tb_relatorio_software = require("./tb_relatorio_software");

var _categorias = require("./categorias");
var _clientes = require("./clientes");
var _historico_status = require("./historico_status");
var _respostas = require("./respostas");
var _status = require("./status");
var _tickets = require("./tickets");
var _usuarios = require("./usuarios");

function initModels(sequelize) {
  var tb_lab_sala = _tb_lab_sala(sequelize, DataTypes);
  var tb_maquina = _tb_maquina(sequelize, DataTypes);
  var tb_software = _tb_software(sequelize, DataTypes);
  var tb_relatorio_software = _tb_relatorio_software(sequelize, DataTypes);

  var categorias = _categorias(sequelize, DataTypes);
  var clientes = _clientes(sequelize, DataTypes);
  var historico_status = _historico_status(sequelize, DataTypes);
  var respostas = _respostas(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);
  var tickets = _tickets(sequelize, DataTypes);
  var usuarios = _usuarios(sequelize, DataTypes);
  
  tb_maquina.belongsTo(tb_lab_sala, { as: "id_lab_sala_tb_lab_sala", foreignKey: "id_lab_sala"});
  tb_lab_sala.hasMany(tb_maquina, { as: "tb_maquinas", foreignKey: "id_lab_sala"});
  tb_relatorio_software.belongsTo(tb_maquina, { as: "id_maquina_tb_maquina", foreignKey: "id_maquina"});
  tb_maquina.hasMany(tb_relatorio_software, { as: "tb_relatorio_softwares", foreignKey: "id_maquina"});
 

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
    tb_lab_sala,
    tb_maquina,
    tb_software,
    tb_relatorio_software,
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
