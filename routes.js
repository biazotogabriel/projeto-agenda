const express = require('express')
const route = express.Router()
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')
const contatoController = require('./src/controllers/contatoController')
const noteController = require('./src/controllers/noteController')

const { loginRequired } = require('./src/middlewares/middleware')

route.use((req, res, next) => { //exemplo de middleware no route. passa req, res e next
//    console.log('executei o roue') // a posição dele importa para a orden de execução das rptas
    next() // se ele vem antes das rodas é preciso o next() senão todos pararão aqui
    // caso venha depois todas as rotas terão que ter o next senão não serão enviadas para ele.
})

// rotas da home
route.get('/', homeController.index)

// rotas de login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

// rotas de contato
route.get('/contato/index', loginRequired, contatoController.index)
route.post('/contato/register', contatoController.registrar)
route.get('/contato/index/:id', loginRequired, contatoController.editIndex)
route.post('/contato/edit/:id', loginRequired, contatoController.edit)
route.get('/contato/delete/:id', loginRequired, contatoController.delete)

// note routes
route.get('/nota/index', loginRequired, noteController.index)
route.post('/nota/register', loginRequired, noteController.register)
route.get('/nota/index/:id', loginRequired, noteController.editIndex)
route.post('/nota/edit/:id', loginRequired, noteController.edit)
route.get('/nota/delete/:id', loginRequired, noteController.delete)


module.exports = route