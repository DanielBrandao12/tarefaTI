const {Status} = require('../database/models')


const getStatus = async (req, res) => {
    try{
        const listaStatus = await Status.findAll()

        res.status(200).json(listaStatus)
    }catch(error) {

        console.error("Não encontrado: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Não encontrado, tente novamente mais tarde.",
        });
    }
}


const createStatus = async (req, res) => {
    try{

        const {nome, ativo} = req.body
    
        const statusCriado = await Status.create({
            nome,
            ativo
        })
    
        res.status(200).json(statusCriado)
    }catch(error) {

        console.error("Erro ao tentar criar status: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao tentar criar status, tente novamente mais tarde.",
        });
    }
}

const updateStatus = async (req, res) => {
    
    try {


        const { id_status, nome, ativo } = req.body

        const statusEditado = await Status.update({
            nome,
           ativo,
        },{
        where: {id_status}
    })


        return res.status(201).json({
            message: 'Status editada com suceso',
            statusEditado
        });


    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao editar item',
            error: error.message
        });
    }
}
const deleteStatus = async (req, res) => {
    try {

        const { id_status, ativo } = req.body;
        if(ativo == 0){
    
            const statusRemovido = await Status.destroy({
                where: { id_status }
            });
    
            if (statusRemovido) {
                return res.status(200).json({
                    message: 'Status removido com sucesso',
                });
            } else {
                return res.status(404).json({
                    message: 'Status não encontrado'
                });
            }
        }else{
            return res.status(200).json({
                message: 'Status em uso, não é possível excluir Status'
            })
        }
    }catch (error){
        console.error("Erro ao tentar excluir status: ", error);

        // Resposta de erro
        return res.status(500).json({
            message: error.message || "Erro ao tentar excluir status, tente novamente mais tarde.",
        });
    }
}

module.exports = {
    getStatus,
    createStatus,
    updateStatus,
    deleteStatus
}