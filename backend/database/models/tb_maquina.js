const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_maquina', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome_maquina: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    id_lab_sala: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_lab_sala',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tb_maquina',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_lab_sala",
        using: "BTREE",
        fields: [
          { name: "id_lab_sala" },
        ]
      },
    ]
  });
};
