const { View_Ticket, Usuarios } = require("../database/models");
const { Op } = require("sequelize");

const getViewTickets = async (req, res) => {
  try {
    const { intervalo, tipoRelatorio, dateStart, dateEnd } = req.query;

    if (!intervalo && !dateStart && dateEnd || !tipoRelatorio) {
      return res.status(400).json({ erro: "Parâmetros inválidos" });
    }

    let whereClause = {};

    // Filtro por data de criação
    if (dateStart && dateEnd) {
      whereClause.data_criacao = {
        [Op.between]: [new Date(`${dateStart} 00:00:00`), new Date(`${dateEnd} 23:59:59`)],
      };
    }

    // Filtro por intervalo de tempo (só aplica se não houver `dateStart` e `dateEnd`)
    if (!dateStart && !dateEnd) {
      switch (intervalo) {
        case "hoje":
          whereClause.data_criacao = {
            [Op.gte]: new Date().setHours(0, 0, 0, 0),
          };
          break;
        case "semana":
          const inicioSemana = new Date();
          inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
          whereClause.data_criacao = { [Op.gte]: inicioSemana };
          break;
        case "mes":
          whereClause.data_criacao = {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          };
          break;
        case "ano":
          whereClause.data_criacao = {
            [Op.gte]: new Date(new Date().getFullYear(), 0, 1),
          };
          break;
        case "todos":
          break;
        default:
          return res.status(400).json({ erro: "Intervalo inválido" });
      }
    }

    // Buscar tickets
    const tickets = await View_Ticket.findAll({ where: whereClause });

    // Criar um array com os IDs dos técnicos atribuídos
    const idsTecnicos = [...new Set(tickets.map((t) => parseInt(t.atribuido_a, 10)))].filter(
      (id) => !isNaN(id)
    );

    // Buscar os nomes dos usuários atribuídos
    const usuarios = await Usuarios.findAll({
      where: { id_usuario: idsTecnicos },
      attributes: ["id_usuario", "nome_usuario"],
    });

    // Criar um mapa { id_usuario: nome }
    const mapaUsuarios = usuarios.reduce((acc, usuario) => {
      acc[usuario.id_usuario] = usuario.nome_usuario;
      return acc;
    }, {});

    // Adicionar os nomes dos técnicos nos tickets
    const ticketsComUsuarios = tickets.map((ticket) => ({
      ...ticket.toJSON(),
      usuarioAtribuido: mapaUsuarios[parseInt(ticket.atribuido_a, 10)] || "Não atribuído",
    }));

    // Agrupamento dos tickets
    let agrupados = {};
    switch (tipoRelatorio) {
      case "dia":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const data = ticket.data_criacao.toISOString().split("T")[0];
          acc[data] = acc[data] || [];
          acc[data].push(ticket);
          return acc;
        }, {});
        break;
      case "mes":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const mes = new Date(ticket.data_criacao).getMonth();
          acc[mes] = acc[mes] || [];
          acc[mes].push(ticket);
          return acc;
        }, {});
        break;
      case "tecnico":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const tecnico = ticket.usuarioAtribuido || "Não atribuído";
          acc[tecnico] = acc[tecnico] || [];
          acc[tecnico].push(ticket);
          return acc;
        }, {});
        break;
      case "categoria":
        agrupados = ticketsComUsuarios.reduce((acc, ticket) => {
          const categoria = ticket.categorias || "Sem categoria";
          acc[categoria] = acc[categoria] || [];
          acc[categoria].push(ticket);
          return acc;
        }, {});
        break;
      default:
        return res.status(400).json({ erro: "Tipo de relatório inválido" });
    }

    return res.json(agrupados);
  } catch (error) {
    console.error("Erro ao buscar tickets", error);
    return res.status(500).json({
      message: error.message || "Erro ao buscar tickets, tente novamente mais tarde.",
    });
  }
};

module.exports = { getViewTickets };
