const Note = require('../models/NoteModel')

module.exports.index = (req, res) => {
    res.render('note', { note: {} })
}

module.exports.register = async (req, res) => {
    try {
        const note = new Note({ idUser: req.session.user._id, ...req.body })
        await note.register()
        if (note.errors.length > 0) {
            req.flash('errors', note.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
        req.flash('success', 'nota adicionada com sucesso')
        req.session.save(() => res.redirect('/'))
    } catch (error) {
        res.render('404')
        console.log(error)
    }
}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404')
    const note = await Note.findNote(req.params.id)
    if (!note) res.render('404')
    res.render('note', { note })
}

module.exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404')
        const note = new Note({ idUser: req.session.user._id, 
                                alteradoEm: Date.now(),
                                ...req.body })
        await note.edit(req.params.id)
        if (note.errors.length > 0) {
            req.flash('errors', note.errors)
            req.session.save(() => res.redirect('back'))
            return
        }
        req.flash('success', 'nota alterada com sucesso')
        req.session.save(() => res.redirect('/'))
    } catch (error) {
        res.render('404')
        console.log(error)
    }
}

module.exports.delete = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404')
        const note = await Note.deleteById(req.params.id)
        if (!note) return res.render('404')
        req.flash('success', 'nota deletada com sucesso')
        req.session.save(() => res.redirect('back'))
    } catch (error) {
        res.render('404')
        console.log(error)
    }
}