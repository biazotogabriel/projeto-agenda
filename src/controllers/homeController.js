const Contato = require('../models/ContatoModel')
const Note = require('../models/NoteModel')

exports.index = async (req, res) => {
    if (req.session.user) {
        const contatos = await Contato.buscaContatos(req.session.user._id)
        const notes = await Note.findNotes(req.session.user._id)
        return res.render('index', { contatos, notes })
    }
    res.render('index', { contatos: null, notes: null }) 
}