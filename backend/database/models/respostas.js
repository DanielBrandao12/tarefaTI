const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
  const Respostas =  sequelize.define('Respostas', {
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
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_ticket: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tickets',
        key: 'id_ticket'
      }
    },
    lida: {
      type: DataTypes.BOOLEAN,
      default: false,
    }
  }, {
    sequelize,
    tableName: 'respostas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_resposta" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
      {
        name: "id_ticket",
        using: "BTREE",
        fields: [
          { name: "id_ticket" },
        ]
      },
    ]
  });
  return Respostas
};
