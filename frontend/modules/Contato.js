import validator from 'validator'

export default class Contato {
    constructor(form) {
        this.form = document.querySelector(form)
        this.telefone = this.form.querySelector('input[name="telefone"]')
        console.dir(this.telefone)
    }
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault()
                this.valida()
                console.log(this.errors)
                if (this.errors.length > 0) {
                    this.printErrors()
                } else {
                    e.target.submit()
                }
            })
            this.telefone.addEventListener('change', (e) => {
                this.telefone.value = this.telefone.value.replace(/^(\d{2})(\d{5})(\d{4}).*/,"($1) $2-$3")
            })
        }
    }
    valida() {
        const nome = this.form.querySelector('input[name="nome"]').value
        const email = this.form.querySelector('input[name="email"]').value
        const telefone = this.telefone.value
        //const errors = []
        this.errors = []
        if (!nome) this.errors.push('Nome é um campo obrigatório')
        if (!email && !telefone) this.errors.push('Favor enviar algum dado de contato (email ou telefone)')
        if (email && !validator.isEmail(email)) this.errors.push('email inválido')
        return
    }
    printErrors() {
        const messages = document.querySelector('#messages')
        let html = ''
        html = ' <div class="row"> ' +
               '   <div class="col my-3"> ' +
               '     <div class="alert alert-danger"> '
        this.errors.forEach(error => html +=' '+ error + '<br> ');
        html +='     </div> ' +
               '   </div> ' +
               ' </div> '
        messages.innerHTML = html
    }
}

//var value = "11912345678"
//var formatted = value.replace(/^(\d{2})(\d{5})(\d{4}).*/,"($1) $2-$3");
//alert(formatted);