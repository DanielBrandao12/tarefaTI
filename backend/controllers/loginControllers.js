const { Usuarios } = require("../database/models");
const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/secrets");
const bcrypt = require("bcrypt");

// ✅ Função para lidar com o login
const handleLogin = async (req, res) => {
  try {
    const { nome_usuario, senha_hash } = req.body;

    // Buscar usuário no banco
    const logon = await Usuarios.findOne({ where: { nome_usuario } });
    if (!logon) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    // Comparar a senha fornecida com a do banco
    const check = bcrypt.compareSync(senha_hash, logon.senha_hash);
    if (!check) {
      return res.status(401).json({ message: "E-mail ou senha incorretos" });
    }

    // Criar token JWT
    const { id_usuario, nome_completo } = logon;
    const token = jwt.sign({ id_usuario, nome_usuario, nome_completo }, jwtKey, { expiresIn: "1h" });

    // Configurar cookie seguro
    res.cookie("token", token, {
      httpOnly: true, // Evita acesso via JavaScript
      secure: process.env.NODE_ENV === "production", // Ativa apenas em HTTPS
      sameSite: "Strict",
    });

    // Remover senha do objeto de resposta
    const userData = { id_usuario, nome_usuario, nome_completo };

    // Armazenar na sessão (caso esteja usando sessões)
    req.session.userLogged = userData;

    res.json({ message: "Login bem-sucedido", user: userData });
    console.log("Logado com sucesso!");
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
};

// ✅ Função para logout
const logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }

      // Remover cookies
      res.clearCookie("connect.sid", { path: "/" });
      res.clearCookie("token", { path: "/" });

      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao sair" });
  }
};

// ✅ Função para verificar se o usuário está autenticado
const verify = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ authenticated: false });
    }

    const decoded = jwt.verify(token, jwtKey);
    return res.json({ authenticated: true, user: decoded });
  } catch (error) {
    return res.json({ authenticated: false });
  }
};

module.exports = { handleLogin, logout, verify };
