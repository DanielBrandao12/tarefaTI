const {Usuarios} = require('../database/models');


const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/secrets");
const bcrypt = require("bcrypt");





const handleLogin = async (req, res) => {
  const { nome_usuario, senha_hash } = req.body;

  // Encontre o usuário no banco de dados
  const logon = await Usuarios.findOne({
    where: {
      nome_usuario,
    }
  });
  
  if (!logon) {
    return res.status(401).json('E-mail ou senha incorretos');
  }

  // Compare a senha fornecida com a senha armazenada
  const check = bcrypt.compareSync(senha_hash, logon.dataValues.senha_hash);

  if (check) {
    // Remover a senha dos dados do usuário antes de armazenar na sessão
    delete logon.dataValues.senha_hash;
    const id =logon.dataValues.id_usuario 
    const nome_completo = logon.dataValues.nome_completo
    // Criar um token JWT (opcional)
    const token = jwt.sign({ id, nome_usuario, nome_completo }, jwtKey, { expiresIn: "1h" });
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
    
    handleLogin, 
    logout
}