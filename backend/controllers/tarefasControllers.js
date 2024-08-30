const { Tarefas } = require('../database/models'); // Importa o modelo diretamente


// Função para obter todas as tarefas
const getTarefas = async (req, res) => {
    try {
      // Aguarda a resolução da Promise retornada por Tarefas.findAll()
      const tarefas = await Tarefas.findAll();
      
      // Envia a lista de tarefas como resposta com status 200
      res.status(200).json(tarefas);
    } catch (error) {
      // Captura e trata erros durante a consulta
      console.error('Erro ao obter tarefas:', error);
      res.status(500).json({ error: 'Erro ao obter tarefas' });
    }
  };

// Função para criar uma nova tarefa
const createTarefa = async (req, res) => {
  try {
    const { nome, tarefa, nivel_prioridade, observacao } = req.body;

    // Validação básica para garantir que todos os campos necessários estão presentes
    if (!nome || !tarefa || !nivel_prioridade) {
      return res.status(400).json({ error: 'Campos obrigatórios não fornecidos' });
    }

    // Cria a nova tarefa
    const novaTarefa = await Tarefas.create({
      nome,
      tarefa,
      nivel_prioridade,
      observacao,
      data_criacao: new Date(),
      status_tarefa: 'em aberto',
      id_users: 1
    });

    // Retorna a nova tarefa criada com status 201
    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

// Função para editar uma tarefa existente
const editTarefa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tarefa, nivel_prioridade, observacao } = req.body;

    // Validação básica para garantir que todos os campos necessários estão presentes
    if (!nome && !tarefa && !nivel_prioridade && !observacao) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
    }

    // Atualiza a tarefa com o ID especificado
    const [rowsAffected] = await Tarefas.update(
      {
        nome,
        tarefa,
        nivel_prioridade,
        observacao,
        data_concluida: null // Exemplo de atualização adicional, se necessário
      },
      {
        where: { id }
      }
    );

    // Verifica se a tarefa foi encontrada e atualizada
    if (rowsAffected === 0) {
      return res.status(404).json({ error: 'Tarefa não encontrada' });
    }

    // Retorna uma mensagem de sucesso
    res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};


const concluirTarefa = async (req, res) =>{
    try {
        const { id } = req.params;
        
    
       
    
        // Atualiza a tarefa com o ID especificado
        const [rowsAffected] = await Tarefas.update(
          {
           status_tarefa:'concluída',
            data_concluida: new Date() 
          },
          {
            where: { id }
          }
        );
    
        // Verifica se a tarefa foi encontrada e atualizada
        if (rowsAffected === 0) {
          return res.status(404).json({ error: 'Tarefa não encontrada' });
        }
    
        // Retorna uma mensagem de sucesso
        res.status(200).json({ message: 'Tarefa concluida com sucesso' });
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
      }
} 

module.exports = {
  createTarefa,
  editTarefa,
  concluirTarefa,
  getTarefas
};
