const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
  const View_Respostas = sequelize.define('View_Respostas', {
    id_resposta: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true
    },
    conteudo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_ticket: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nome_usuario: {
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

    
  }, {
    sequelize,
    tableName: 'view_respostas',
    timestamps: false,
  });

  return View_Respostas
};
