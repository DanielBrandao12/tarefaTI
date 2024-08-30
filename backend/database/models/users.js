module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define(
      "Users",
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
          type: DataTypes.STRING,
        },
        nome_user: {
          type: DataTypes.STRING,
        },
        senha: {
          type: DataTypes.STRING,
        },
 
      },
      {
        tableName: "users",
        timestamps: false,
      }
    );
  
    return Users;
};
