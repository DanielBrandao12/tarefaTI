const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Software = sequelize.define('Software', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    vendor: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tb_software',
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
    ]
  });

  return Software
};
