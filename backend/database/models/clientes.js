const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Clientes = sequelize.define('Clientes', {
    id_cliente: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome_completo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assunto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_hora: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_ticket: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tickets',
        key: 'id_ticket'
      }
    }
  }, {
    sequelize,
    tableName: 'clientes',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_cliente" },
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
  return Clientes
};
