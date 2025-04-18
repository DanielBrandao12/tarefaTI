const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const usersTarefa = require('./routes/routeTarefa')
const usersLogin = require('./routes/login')

//Novas rotas service desk 2.1
const usuarioRouter =require('./routes/usuariosRoute')
const ticketRouter = require('./routes/ticketsRoute')
const listaTarefaRouter = require('./routes/listaTarefaRoute')
const categoriaRouter = require('./routes/categoriasRoute')
const historicoStatusRouter = require('./routes/historicoStatusRoute')
const respostaRouter = require('./routes/respostaRoute')
const statusRouter = require('./routes/statusRoute') 
const emailService = require('./services/emailService')
const anexoRouter = require('./routes/anexoRoute')
const relatorioRouter = require('./routes/relatorioRoute')

const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Configuração do CORS
const corsOptions = {

 
  origin: process.env.DOMINIO_HOST, // Substitua pelo domínio do seu frontend


  credentials: true, // Permite que cookies e outras credenciais sejam enviadas
};

app.use(cors(corsOptions));
// Configuração do middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'novasessaoti', // Troque por uma chave secreta
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Se estiver usando HTTPS, defina isso como true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tarefas', usersTarefa)
app.use('/login', usersLogin)

//Novas rotas service desk 2.1
app.use('/usuarios', usuarioRouter)
app.use('/tickets', ticketRouter)
app.use('/listaTarefa', listaTarefaRouter)
app.use('/categoria', categoriaRouter)
app.use('/historicoStatus', historicoStatusRouter)
app.use('/resposta', respostaRouter)
app.use('/status', statusRouter)
app.use('/anexo', anexoRouter)
app.use('/relatorio', relatorioRouter)


// Verificar e-mails periodicamente (a cada 5 minutos)
setInterval(async () => {
  console.log('Verificando novos e-mails...');
  await emailService.checkEmails();
},  1 * 30 * 1000); // 5 minutos em milissegundos

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'test' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
