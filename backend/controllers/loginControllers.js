const {Users} = require('../database/models');

const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/secrets");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    con
    try{
        const { nome, nome_user, senha } = req.body;
             console.log(nome, nome_user, senha)
 
   const senhaBcrypt = bcrypt.hashSync(senha, 10)
    
     const newUser = await Users.create({
       nome,
       nome_user,
       senha:senhaBcrypt,
       charset: 'utf8mb4'
       
     });
   
     return res.json(newUser)
 }catch(error){
   
            res.error(error)
 }

}


const handleLogin = async (req, res) =>{
   
    const { nome_user, senha } = req.body;
   
    const token = jwt.sign({ nome_user }, jwtKey, { expiresIn: "1h" });
    res.cookie("token", token);
  
   const  logon = await Users.findOne({
      where: {
        nome_user,
      }
  
    })

    
  

       const check = bcrypt.compareSync(senha, logon.dataValues.senha)
  
        if (check) {
          //tirar a senha antes de ir para sessão, para não exibir minha senha 
          delete logon.dataValues.senha
          //sessão recebe os dados dos usuário logado para poder usar em todas as minhas views
         // req.session.userLogged = data.dataValues
          res.json( logon)
          console.log('Logado')
        } else {
          console.log( "E-mail ou senha incorretos");
          res.json('erro')
        }
      
      

  };


module.exports = {
    createUser,
    handleLogin
}