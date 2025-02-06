
const { Categorias } = require('../database/models')

const getAllCategoria = async (req, res) => {
    try {
        const categoriasAll = await Categorias.findAll(); // Corrigido para "findAll"

        // Retorna as categorias em formato JSON
        return res.status(200).json(categoriasAll);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);

        // Retorna um erro genérico ao cliente
        return res.status(500).json({
            mensagem: 'Erro ao buscar categorias.',
            erro: error.message,
        });
    }
};
const getIdCategoria = async (req, res) => {

    const {id} = req.params
    try {
        const categorias = await Categorias.findByPk(id); // Corrigido para "findAll"

        // Retorna as categorias em formato JSON
        return res.status(200).json(categorias);
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);

        // Retorna um erro genérico ao cliente
        return res.status(500).json({
            mensagem: 'Erro ao buscar categoria.',
            erro: error.message,
        });
    }
};

const createCategoria = async (req, res) => {

    try {


        const { nomeCategoria, statusCategoria } = req.body

        const categoria = await Categorias.create({
            nome:nomeCategoria,
            criado_por:'Daniel',
            status:statusCategoria,
            data_criacao: new Date()
        })


        return res.status(201).json({
            message: 'Categoria Criada com suceso',
            categoria
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao adicionar item',
            error: error.message
        });
    }
}

const updateCategoria = async (req, res) => {

    try {


        const { idCategory, nomeCategoria,  statusCategoria } = req.body

        const categoriaEditada = await Categorias.update({
            nome:nomeCategoria,
            
            status:statusCategoria,
        },{
        where: {id_categoria:idCategory}
    })


        return res.status(201).json({
            message: 'Categoria editada com suceso',
            categoriaEditada
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao editar item',
            error: error.message
        });
    }
}

const deleteCategoria = async (req, res) => {
    try {
        const { id, status } = req.query; // Obtém os parâmetros da query string
        console.log(id, status)
        if(status !== 'Ativo'){

            const categoriaRemovida = await Categorias.destroy({
                where: { id_categoria:id }
            });

            if (categoriaRemovida) {
                return res.status(200).json({
                    message: 'Categoria removida com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Categoria não encontrada'
                });
            }
        }else{
            return res.status(200).json({
                message: 'Categoria em uso, não é possível excluir categoria'
            })
        }

     
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao remover Categoria',
            error: error.message
        });
    }
};
module.exports = {
    createCategoria,
    updateCategoria,
    deleteCategoria,
    getAllCategoria,
    getIdCategoria
}