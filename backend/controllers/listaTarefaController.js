const { ListaTarefa } = require('../database/models');

const addItem = async (req, res) => {
    try {
        const { id_ticket, assunto } = req.body;

        const itemCriado = await ListaTarefa.create({
            id_ticket,
            assunto,
            status_tarefa: 'não concluída'
        });

        return res.status(201).json({
            message: 'Item adicionado com sucesso',
            itemCriado
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao adicionar item',
            error: error.message
        });
    }
};

const alterarStatus = async (req, res) => {
    try {
        const { id_lista_tarefa, check } = req.body;

        // Converte "true" ou "false" em valores booleanos
        const isChecked = check === 'true' ? true : check === 'false' ? false : check;

        // Atualiza o status da tarefa
        const [updated] = await ListaTarefa.update({
            status_tarefa: isChecked ? 'Concluída' : 'Não concluída'
        }, {
            where: { id_lista_tarefa }
        });

        // Verifica se a atualização foi bem-sucedida
        if (updated) {
            return res.status(200).json({
                message: 'Status da tarefa atualizado com sucesso',
            });
        } else {
            return res.status(404).json({
                message: 'Tarefa não encontrada'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar status da tarefa',
            error: error.message
        });
    }
};

const removerItem = async (req, res) => {
    try {
        const { id_lista_tarefa } = req.body;

        const itemRemovido = await ListaTarefa.destroy({
            where: { id_lista_tarefa }
        });

        if (itemRemovido) {
            return res.status(200).json({
                message: 'Item removido com sucesso',
            });
        } else {
            return res.status(404).json({
                message: 'Item não encontrado'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao remover item',
            error: error.message
        });
    }
};

module.exports = {
    addItem,
    alterarStatus,
    removerItem
};
