const Pegawai = require("../models/Pegawai")

module.exports = {
    // dashboard
    viewDashboard: async (req, res) => {
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'Dashboard | T2KU BMCK Jateng'
            })
            console.log(Pegawai)
        } catch (error) {
            console.log(error)
        }
    },
    // akhir dashboard

    // pegawai
    viewPegawai: async (req, res) => {
        try {
            const pegawai = await Pegawai.find();
            // alert
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { 
                message: alertMessage, 
                status: alertStatus,
            };

            res.render("admin/pegawai/view_pegawai", {
                title: 'Data Pegawai | T2KU BMCK Jateng',
                alert,
                pegawai
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPegawai: async (req, res) => {
        try {
            const { nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket } = req.body;
            await Pegawai.create({ 
                nama,
                unker, 
                nik, 
                npwp, 
                no_rek_jateng, 
                no_rek_bni, 
                no_bpjs_kes, 
                no_bpjs_ket,
                file_SK: `uploads/SK/${req.file.filename}` 
            });
            req.flash('alertMessage', 'Berhasil menambahkan data Pegawai');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pegawai");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    editPegawai: async (req, res) => {
        try {
            const { id, nama, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket} = req.body;
            const pegawai = await Pegawai.findOne({_id: id});
            pegawai.nama = nama;
            pegawai.unker = unker;
            pegawai.nik = nik;
            pegawai.npwp = npwp;
            pegawai.no_rek_jateng = no_rek_jateng;
            pegawai.no_rek_bni = no_rek_bni;
            pegawai.no_bpjs_kes = no_bpjs_kes;
            pegawai.no_bpjs_ket = no_bpjs_ket;
            await pegawai.save();

            req.flash('alertMessage', 'Berhasil mengubah data Pegawai');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pegawai");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    deletePegawai: async (req, res) => {
        try {
            const { id } = req.params;
            const pegawai = await Pegawai.findOne({_id: id});
            await pegawai.remove();
            req.flash('alertMessage', 'Berhasil menghapus data Pegawai');
            req.flash('alertStatus', 'success');
            res.redirect("/admin/pegawai");
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect("/admin/pegawai");
        }
    },
    // akhir pegawai

    viewGaji: async (req, res) => {
        try {
            res.render("admin/gaji/view_gaji", {
                title: 'Data Gaji | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    viewPemasukan: async (req, res) => {
        try {
            res.render("admin/pemasukan/view_pemasukan", {
                title: 'Data Pemasukan | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    viewPengeluaran: async (req, res) => {
        try {
            res.render("admin/pengeluaran/view_pengeluaran", {
                title: 'Data Pengeluaran | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
}