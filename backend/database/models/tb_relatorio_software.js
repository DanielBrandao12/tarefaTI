const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const RelatorioSoftware = sequelize.define('RelatorioSoftware', {
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
    id_softwares: {
      type: DataTypes.JSON,
      allowNull: true // Removida a referência, pois não é aplicável a um tipo JSON
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
      }
    ]
  });

  return RelatorioSoftware;
};
