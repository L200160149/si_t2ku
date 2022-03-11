const mongoose = require('mongoose');

const suratKeluarSchema = new mongoose.Schema({
    judul: {
        type: String,
        required: true
    },
    tanggal: {
        type: Date,
        required: true
    },
    surat_keluar: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Suratkeluar', suratKeluarSchema)