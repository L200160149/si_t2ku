const mongoose = require('mongoose');

const suratMasukSchema = new mongoose.Schema({
    tanggal: {
        type: Date,
        required: true
    },
    judul: {
        type: String,
        required: true
    },
    surat_masuk: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Suratmasuk', suratMasukSchema)