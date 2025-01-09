const { Usuarios } = require('../database/models');
const bcrypt = require("bcrypt");


// Função auxiliar para verificação de duplicidade de e-mail e nome de usuário
const checkDuplicate = async (email, nome_usuario, id = null) => {
    // Verificar se o usuário existe (apenas para a função de atualização)
    if (id) {
        const user = await Usuarios.findByPk(id);
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
    }

    // Verificação de duplicidade de e-mail
    const existingEmail = await Usuarios.findOne({ where: { email } });
    if (existingEmail) {
        return { emailExists: true, usernameExists: false };
    }

    // Verificação de duplicidade de nome de usuário
    const existingUsername = await Usuarios.findOne({ where: { nome_usuario } });
    if (existingUsername) {
        return { emailExists: false, usernameExists: true };
    }

    return { emailExists: false, usernameExists: false };
};

// Função auxiliar para hash da senha
const hashPassword = async (senha) => {
    return bcrypt.hash(senha, 10);
};

//get usuario por id
// Get usuário all
const getUserAll = async (req, res) => {
    try {
        // Procurar todos os usuários, retornando apenas 'id' e 'nome_usuario'
        const users = await Usuarios.findAll({
            attributes: ['id_usuario','nome_completo', 'email', 'nome_usuario'], // Seleciona apenas os campos necessários
        });

        // Retornar usuários com os campos especificados
        return res.status(200).json(users);
    } catch (error) {
        // Tratar erros inesperados
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};
// Get usuário por ID
const getUserId = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se o ID é válido
        if (!id) {
            return res.status(400).json({ message: "ID não fornecido." });
        }

        // Procurar o usuário pelo ID
        const user = await Usuarios.findByPk(id);

        // Verificar se o usuário foi encontrado
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Retornar as informações do usuário
        return res.status(200).json({
            message: "Usuário encontrado com sucesso!",
            nomeUser: user.nome_usuario,
        });
    } catch (error) {
        // Tratar erros inesperados
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

// Criação de usuário
const createUser = async (req, res) => {
    try {
        const { nome_completo, nome_usuario, email, senha, perfil } = req.body;

        // Validação básica de entrada
        if (!nome_completo || !nome_usuario || !email || !senha || !perfil) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Verificação de duplicidade
        const { emailExists, usernameExists } = await checkDuplicate(email, nome_usuario);
        if (emailExists) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
        }
        if (usernameExists) {
            return res.status(400).json({ message: "Nome de usuário já cadastrado." });
        }

        // Hash da senha
        const senhaBcrypt = await hashPassword(senha);

        // Criação do usuário
        const newUser = await Usuarios.create({
            nome_completo,
            nome_usuario,
            email,
            senha_hash: senhaBcrypt,
            perfil
        });

        // Remover a senha da resposta
        const { senha_hash, ...userWithoutPassword } = newUser.toJSON();

        // Resposta de sucesso
        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            user: userWithoutPassword
        });
    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao criar o usuário: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao criar usuário, tente novamente mais tarde.",
        });
    }
};

// Atualização de usuário, cada usuário poderá alterar seu próprio usuário!
//futuramente vamos ter nivel de acesso para service desk 2.1
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // ID do usuário a ser atualizado
        const { nome_completo, nome_usuario, email, senha, perfil } = req.body;

        // Verificar se o usuário existe
        const user = await Usuarios.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Verificação de duplicidade (excluindo o próprio usuário)
        const { emailExists, usernameExists } = await checkDuplicate(email, nome_usuario, id);
        if (emailExists) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
        }
        if (usernameExists) {
            return res.status(400).json({ message: "Nome de usuário já cadastrado." });
        }

        // Atualizar dados do usuário
        user.nome_completo = nome_completo || user.nome_completo;
        user.nome_usuario = nome_usuario || user.nome_usuario;
        user.email = email || user.email;
        user.perfil = perfil || user.perfil;

        // Atualizar a senha, se fornecida
        if (senha) {
            user.senha_hash = await hashPassword(senha);
        }

        // Salvar alterações no banco de dados
        await user.save();

        // Remover a senha da resposta
        const { senha_hash, ...updatedUser } = user.toJSON();

        // Resposta de sucesso
        return res.status(200).json({
            message: "Usuário atualizado com sucesso!",
            user: updatedUser
        });
    } catch (error) {
        // Log de erro para depuração
        console.error("Erro ao atualizar o usuário: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao atualizar usuário, tente novamente mais tarde.",
        });
    }
};



module.exports = {
    createUser,
    updateUser,
    getUserId,
    getUserAll
};
