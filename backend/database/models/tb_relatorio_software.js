const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_relatorio_software', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_maquina: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_maquina',
        key: 'id'
      }
    },
    id_software: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_software',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tb_relatorio_software',
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
        name: "id_maquina",
        using: "BTREE",
        fields: [
          { name: "id_maquina" },
        ]
      },
      {
        name: "id_software",
        using: "BTREE",
        fields: [
          { name: "id_software" },
        ]
      },
    ]
  });
};
