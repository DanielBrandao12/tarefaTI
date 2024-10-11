const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define(
    'Usuarios', 
    {
    id_usuario: {
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
    senha_hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nome_usuario: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_usuario" },
        ]
      },
    ]
  });

  return Usuarios
};
