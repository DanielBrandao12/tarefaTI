module.exports = (sequelize, DataTypes) => {
    const Tarefas = sequelize.define(
      "Tarefas",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
        },
        tarefa: {
          type: DataTypes.STRING,
        },
        nivel_prioridade: {
          type: DataTypes.STRING,
        },
        status_tarefa: {
          type: DataTypes.STRING,
        },
        data_criacao: {
          type: DataTypes.DATE,
        },
        data_concluida: {
          type: DataTypes.DATE,
        },
        observacao: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: "tarefas",
        timestamps: false,
      }
    );
  
    return Tarefas;
};
