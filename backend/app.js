const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const usersTarefa = require('./routes/routeTarefa')
const usersLogin = require('./routes/login')

//Novas rotas service desk 2.0
const usuarioRouter =require('./routes/usuariosRoute')
const ticketRouter = require('./routes/ticketsRoute')
const listaTarefaRouter = require('./routes/listaTarefaRoute')
const categoriaRouter = require('./routes/categoriasRoute')
const relatorioInventarioRouter = require('./routes/relatorioInventarioRoute')
const maquinaRouter = require('./routes/maquinaRoute')
const historicoStatusRouter = require('./routes/historicoStatusRoute')
const respostaRouter = require('./routes/respostaRoute')
const statusRouter = require('./routes/statusRoute') 


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
 // origin: 'http://servicedesk:3000', // Substitua pelo domínio do seu frontend
  origin: 'http://localhost:3000', // Substitua pelo domínio do seu frontend

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

//Novas rotas service desk 2.0
app.use('/usuarios', usuarioRouter)
app.use('/tickets', ticketRouter)
app.use('/listaTarefa', listaTarefaRouter)
app.use('/categoria', categoriaRouter)
app.use('/relatorioInventario', relatorioInventarioRouter)
app.use('/maquinas', maquinaRouter)
app.use('/historicoStatus', historicoStatusRouter)
app.use('/resposta', respostaRouter)
app.use('/status', statusRouter)

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
