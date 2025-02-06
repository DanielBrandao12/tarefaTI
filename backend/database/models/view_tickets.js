const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
  const View_Ticket = sequelize.define('View_Ticket', {
    id_ticket: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigo_ticket: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assunto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nome_requisitante: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nivel_prioridade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    atribuido_a: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true
    },

    
  }, {
    sequelize,
    tableName: 'view_tickets_status',
    timestamps: false,
  });

  return View_Ticket
};
