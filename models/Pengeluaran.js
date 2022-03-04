const mongoose = require('mongoose');

const pengeluaranSchema = new mongoose.Schema({
    jumlah_pengeluaran: {
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

module.exports = mongoose.model('Pengeluaran', pengeluaranSchema)