//const { render } = require('ejs')
const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    return res.render('contato', { contato: {} })
}

exports.registrar = async (req, res) => {
    try {
        const contato = new Contato({ idLogin: req.session.user._id, ...req.body })
        await contato.register()
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
        req.flash('success', 'contato cadastrado com sucesso')
        req.session.save(() => res.redirect('/'))
        return
    } catch (error) {
        console.log(e)
        res.render('404')
    }
}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404')
    const contato = await Contato.buscaPorId(req.params.id)
    if (!contato) res.render('404')
    res.render('contato', { contato })
}

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404')
        const contato = new Contato(req.body)
        await contato.edit(req.params.id)
        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
        req.flash('success', 'contato atualizado com sucesso')
        req.session.save(() => res.redirect('/'))
        return
    } catch (error) {
        console.log(e)
        res.render('404')
    }
}

exports.delete = async function(req, res) {
    try {
        if(!req.params.id) return res.render('404')
        const contato = await Contato.deletaPorId(req.params.id)
        if (!contato) return res.render('404')
        req.flash('success', 'contato deletado com sucesso')
        return req.session.save(() => res.redirect('back')) 
    } catch (e) {
        console.log(e)
        return res.render('404')
    }
    
}