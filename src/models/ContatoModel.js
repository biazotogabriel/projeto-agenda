const mongoose = require('mongoose')
const validator = require('validator')
//const { ValidationError } = require('webpack')

const ContatoSchema = new mongoose.Schema({
    idLogin: { type: String, required: true },
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now() }
})

const ContatoModel = mongoose.model('Contato', ContatoSchema)

function Contato(body) {
    this.body = body
    this.errors = []
    this.contato = null
}

Contato.prototype.register = async function () {
    this.valida()
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valida = function () {
    this.cleanUp()
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório')
    if (!this.body.email && !this.body.telefone) this.errors.push('Favor enviar algum dado de contato (email ou telefone)')
    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('email inválido')
}

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = ''
        }
    }
    this.body = {
        idLogin: this.body.idLogin,
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }
}

Contato.prototype.edit = async function (id) {
    if (typeof id !== 'string') return
    this.valida()
    if (this.errors.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })
}

//Metodos estáticos
Contato.deletaPorId = async (id) => {
    if (typeof id !== 'string') return;
    const contato = await ContatoModel.findByIdAndDelete(id)
    return contato
}

Contato.buscaPorId = async function (id) {
    if (typeof (id) !== 'string') return
    const user = await ContatoModel.findById(id)
    return user
}

Contato.buscaContatos = async function (id) {
    const contatos = await ContatoModel.find()
        .where({ idLogin: id })
        .sort({ criadoEm: -1 })
    return contatos
}


module.exports = Contato