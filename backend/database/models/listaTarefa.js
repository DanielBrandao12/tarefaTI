module.exports = (sequelize, DataTypes) => {
    const ListaTarefa = sequelize.define(
        "ListaTarefa",
        {
            id_lista_tarefa: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            assunto: {
                type: DataTypes.STRING,
                allowNull: false, // Torna o campo obrigatório
            },
            status_tarefa: {
                type: DataTypes.STRING,
                allowNull: false, // Torna o campo obrigatório
            },
            id_ticket: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'tickets',
                    key: 'id_ticket'
                }
            },
        },
        {
            tableName: "lista_tarefa",
            timestamps: false, // Altere para true se precisar de timestamps
        }
    );

    return ListaTarefa;
};
