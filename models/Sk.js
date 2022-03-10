const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const skSchema = new mongoose.Schema({
    tanggal: {                   
        type: Date,
        required: true
    },
    file_Sk: {                   
        type: String,
        required: true
    },
    pegawaiId: {
        type: ObjectId,
        ref: 'Pegawai'
    },
})

module.exports = mongoose.model('Sk', skSchema)