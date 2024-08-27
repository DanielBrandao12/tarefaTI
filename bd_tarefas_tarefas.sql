-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bd_tarefas
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tarefas`
--

DROP TABLE IF EXISTS `tarefas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tarefas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tarefa` longtext DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `nivel_prioridade` varchar(100) DEFAULT NULL,
  `status_tarefa` varchar(100) DEFAULT NULL,
  `data_criacao` datetime DEFAULT NULL,
  `data_concluida` datetime DEFAULT NULL,
  `observacao` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tarefas`
--

LOCK TABLES `tarefas` WRITE;
/*!40000 ALTER TABLE `tarefas` DISABLE KEYS */;
INSERT INTO `tarefas` VALUES (1,'Organizar sevidor yy','Daniel ','Prioridade Média','concluída','2024-08-22 15:13:30','2024-08-27 15:19:55','Nada nadaa'),(2,'Organizar sevidor s','Daniel Rodrigues Brandão','Prioridade Alta','concluída','2024-08-22 20:39:33','2024-08-27 14:49:05','Nada nadaa'),(3,'formatars','Márcio','Prioridade Alta','em aberto','2024-08-22 21:15:26',NULL,'nadakk'),(4,'Formatar tudo','Wilson','Prioridade Alta','em aberto','2024-08-22 21:36:59',NULL,'Fazer tudo'),(5,'Fazer tudo','Wilson','Prioridade Alta','concluída','2024-08-23 15:12:15','2024-08-26 21:21:47',''),(6,'fd','fds','Prioridade Baixa','concluída','2024-08-26 14:13:27','2024-08-26 21:21:44',''),(7,'Mudar dns dos labs',' Wilson Pereira','Prioridade Média','concluída','2024-08-26 21:01:09','2024-08-26 21:12:35',''),(8,'Mudar gateway','Daniel','Prioridade Média','em aberto','2024-08-27 15:17:38',NULL,''),(9,'Instalação do Sistema Operacional e Atualizações:\n\nVerificar e instalar a versão mais recente do sistema operacional (Ubuntu 22.04 LTS).\nAplicar todas as atualizações de segurança e correções disponíveis.\nInstalação de Ferramentas e Dependências:\n\nNode.js e npm: Instalar a versão mais recente do Node.js e npm.\nMySQL: Instalar e configurar o MySQL, criando um banco de dados de desenvolvimento e um usuário com permissões adequadas.\nServidor Web (Nginx): Instalar e configurar o Nginx para servir a aplicação e o frontend.\nGit: Instalar o Git e configurar o acesso ao repositório de código.\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\n\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\nconst [prioridadeNew, setPrioridadeNew] = useState()\n','Daniel','Prioridade Baixa','em aberto','2024-08-27 20:42:42',NULL,'s'),(10,'Instalação do Sistema Operacional e Atualizações:\n\nVerificar e instalar a versão mais recente do sis','Daniel','Prioridade Alta','em aberto','2024-08-27 20:44:03',NULL,'');
/*!40000 ALTER TABLE `tarefas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-27 18:10:04
