
const { Categorias } = require('../database/models')


const createCategoria = async (req, res) => {

    try {


        const { nome, criado_por, status } = req.body

        const categoria = await Categorias.create({
            nome,
            criado_por,
            status,
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


        const { id_categoria, nome, criado_por, status } = req.body

        const categoriaEditada = await Categorias.update({
            nome,
            criado_por,
            status,
        },{
        where: {id_categoria}
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
        const { id_categoria, status } = req.body;
        if(status !== 'Ativo'){

            const categoriaRemovida = await Categorias.destroy({
                where: { id_categoria }
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
    deleteCategoria
}