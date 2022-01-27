import validator from 'validator'

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
    }
    init() {
        this.events()
    }
    events() {
        if(!this.form) return
        this.form.addEventListener('submit', evento => {
            evento.preventDefault()
            const errors = this.validate()
            if (errors.length === 0) {
                evento.target.submit()
            } else {
                this.printErrors(errors)
            }
        })
    }
    validate() {
        const emailInput = this.form.querySelector('input[name="email"]')
        const emailSenha = this.form.querySelector('input[name="senha"]')
        const errors = []
        if (!validator.isEmail(emailInput.value)) errors.push('email invalido')
        if (emailSenha.value.length < 3 || emailSenha.value.length > 50) errors.push('senha invalida')
        return errors
    }
    printErrors(errors) {
        const messages = document.querySelector('#messages')
        let html = ''
        html = ' <div class="row"> ' +
               '   <div class="col my-3"> ' +
               '     <div class="alert alert-danger"> '
        errors.forEach(error => html +=' '+ error + '<br> ');
        html +='     </div> ' +
               '   </div> ' +
               ' </div> '
        messages.innerHTML = html
    }
}