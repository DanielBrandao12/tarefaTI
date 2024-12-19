const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) =>{
  const Tickets = sequelize.define('Tickets', {
    id_ticket: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigo_ticket: {
      type: DataTypes.STRING,
      allowNull: true
    },
    assunto: {
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
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    nivel_prioridade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_conclusao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    atribuido_a: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categorias',
        key: 'id_categoria'
      }
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id_status'
      }
    }
  }, {
    sequelize,
    tableName: 'tickets',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_ticket" },
        ]
      },
      {
        name: "id_categoria",
        using: "BTREE",
        fields: [
          { name: "id_categoria" },
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
        name: "id_status",
        using: "BTREE",
        fields: [
          { name: "id_status" },
        ]
      },
    ]
  });

  return Tickets
};
