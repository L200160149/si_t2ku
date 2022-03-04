const mongoose = require('mongoose');

const pemasukanSchema = new mongoose.Schema({
    jumlah_iuran: {                   
        type: Number,
        required: true
    },
    tanggal: {
        type: Date,
        required: true
    },
    keterangan: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Pemasukan', pemasukanSchema)