const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const { ValidationError } = require('webpack')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body
        this.errors = []
        this.user = null
    }
    valida() {
        this.cleanUp()
        // validar os campos
        // o email precisa ser valido
        if (!validator.isEmail(this.body.email)) this.errors.push('e-mail inválido')
        // a senha precisa ter entre 3 e 50 caracteres
        if (this.body.senha.length < 3 || this.body.senha.length > 50) this.errors.push('senha deve ter entre 3 e 50 caracteres')
    }
    async login() {
        this.valida()
        if (this.errors.length > 0) return
        this.user = await LoginModel.findOne({ email: this.body.email })
        if (!this.user) {
            this.errors.push('usuário ou senha inválidos')
            return
        }
        if (!bcryptjs.compareSync(this.body.senha, this.user.senha)) {
            this.errors.push('senha invalida')
            this.user = null
            return
        }
    }
    async register() {
        this.valida()
        if (this.errors.length > 0) return
        await this.userExists()
        if (this.errors.length > 0) return
        const salt = bcryptjs.genSaltSync()
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt)
        this.user = await LoginModel.create(this.body)
    }
    cleanUp() { //garante que tudo o que está dentro do body é uma string
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = ''
            }
        }
    }
    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('este email já existe')
    }
}

module.exports = Login