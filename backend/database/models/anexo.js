module.exports = (sequelize, DataTypes) => {
    const Anexo = sequelize.define(
        "Anexo",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            tipo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            arquivo: {
                type: DataTypes.BLOB("long"),
                allowNull: true,
            },
            ticket_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            resposta_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "anexos",
            timestamps: false,
        }
    );

    // 🔹 Definição dos relacionamentos
    Anexo.associate = function (models) {
        Anexo.belongsTo(models.Tickets, {
            as: "ticket",
            foreignKey: "ticket_id",
            
        });

        Anexo.belongsTo(models.Respostas, {
            as: "resposta",
            foreignKey: "resposta_id",
            
        });
    };

    return Anexo;
};
