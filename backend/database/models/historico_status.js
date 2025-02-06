const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes)  => {
  const Historico_status = sequelize.define('Historico_status', {
    id_historico: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
    },
    id_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id_status'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    }
  }, {
    sequelize,
    tableName: 'historico_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_historico" },
        ]
      },
      {
        name: "id_ticket",
        using: "BTREE",
        fields: [
          { name: "id_ticket" },
        ]
      },
      {
        name: "id_status",
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
      {
        name: "id_usuario",
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });
  return Historico_status
};
