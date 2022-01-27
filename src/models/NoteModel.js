const mongoose = require('mongoose')

const NoteSchema = new mongoose.Schema({
    idUser: { type: String, required: true },
    title: { type: String, required: true },
    information: { type: String, required: true },
    criadoEm: { type: Date, required: false, default: Date.now() },
    alteradoEm: { type: Date, required: false, default: Date.now() }
})

const NoteModel = mongoose.model('Note', NoteSchema)

class Note {
    constructor(body) {
        this.body = body
        this.errors = []
        this.note = null
    }
    async register() {
        this.valida()
        if (this.errors.length > 0) return
        this.note = await NoteModel.create(this.body)
    }
    async edit(id) {
        this.valida()
        if (this.errors.length > 0) return
        this.note = await NoteModel.findByIdAndUpdate(id, this.body, { new: true })
    }
    valida() {
        if (!this.body.title) this.errors.push('titulo não preenchido')
        if (!this.body.information) this.errors.push('nenhuma informaçao preenchida')
    }
    static async findNotes(idUser) {
        return await NoteModel.find().where({ idUser: idUser }).sort({ criadaEm: -1 })
    }
    static async findNote(id) {
        return await NoteModel.findById(id)
    }
    static async deleteById(id) {
        const nota = await NoteModel.findByIdAndDelete(id)
        console.log(nota)
        return nota
    }
}



module.exports = Note