const {Users} = require('../database/models');


const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/secrets");
const bcrypt = require("bcrypt");


const createUser = async (req, res) => {
    
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


const handleLogin = async (req, res) => {
  const { nome_user, senha } = req.body;

  // Encontre o usuário no banco de dados
  const logon = await Users.findOne({
    where: {
      nome_user,
    }
  });
  
  if (!logon) {
    return res.status(401).json('E-mail ou senha incorretos');
  }

  // Compare a senha fornecida com a senha armazenada
  const check = bcrypt.compareSync(senha, logon.dataValues.senha);

  if (check) {
    // Remover a senha dos dados do usuário antes de armazenar na sessão
    delete logon.dataValues.senha;
    const id =logon.dataValues.id 
    const nome = logon.dataValues.nome
    // Criar um token JWT (opcional)
    const token = jwt.sign({ id, nome_user, nome }, jwtKey, { expiresIn: "1h" });
    res.cookie("token", token);

    // Armazenar os dados do usuário na sessão
    req.session.userLogged = logon.dataValues;

    // Enviar resposta ao cliente
    res.json(logon.dataValues);
    console.log('Logado');
  } else {
    console.log("E-mail ou senha incorretos");
    res.status(401).json('E-mail ou senha incorretos');
  }
};


const logout = async (req, res) => {
  // Destruir a sessão
  req.session.destroy((err) => {
      if (err) {
          return res.status(500).send('Erro ao fazer logout');
      }

      // Excluir o cookie da sessão
      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('token', { path: '/' });
      
      // Enviar resposta de sucesso
      res.status(200).send('Logout realizado com sucesso');
  });
}

module.exports = {
    createUser,
    handleLogin, 
    logout
}