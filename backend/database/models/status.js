const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Status = sequelize.define('Status', {
    id_status: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
    ]
  });

  return Status
};
