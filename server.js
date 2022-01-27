require('dotenv').config()

const express = require('express')
const app = express()

const mongoose = require('mongoose') // modela a base de dados e garante que os dados sejam salvos da forma correta
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        console.log('Base de dados conectada')
        app.emit('pronto')
    })
    .catch(e => console.log('Erro ao conectar'))

const session = require('express-session') // para armazenar dados na sessão
const MongoStore = require('connect-mongo') // armazena as sessões na base de dados
const flash = require('connect-flash') // flash messages (mensagens auto-destrutivas)

const routes = require('./routes') //configura as rotas
const path = require('path')
//const helmet = require('helmet') // deixa a aplicação mais segura
const csrf = require('csurf') // csrf tokens para garantir que aplicativos externos consigam postar coisas para nossa aplicação
const { middleWareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware.js') //associação via desestruturação dos middlewares

//app.use(helmet())// desativando o helmet
app.use(express.urlencoded({ extended: true })) // permite a postagem de formularios para dentro da aplicação
app.use(express.json()) // permite a postagem de json
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret: 'dafsdf89hosagsg',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // = sete dias
    },
    httpOnly: true
})
app.use(sessionOptions)

app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views')) // localização das views que serão renderizadas
app.set('view engine', 'ejs') // define a engine que será usada para renderizar as páginas

//csrf
app.use(csrf())
app.use(csrfMiddleware)
app.use(checkCsrfError)

//nossos prórpios middleware
app.use(middleWareGlobal) // chama o middleware
app.use(routes) // chamas as rotas

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('Servidor escutando na porta 3000')
    })
})