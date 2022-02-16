module.exports = {
    // dashboard
    viewDashboard: async (req, res) => {
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'Dashboard | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    // akhir dashboard

    // pegawai
    viewPegawai: async (req, res) => {
        try {
            res.render("admin/pegawai/view_pegawai", {
                title: 'Data Pegawai | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    addPegawai: async (req, res) => {
        try {
            const { name, unker, nik, npwp, no_rek_jateng, no_rek_bni, no_bpjs_kes, no_bpjs_ket } = req.body;
             
        } catch (error) {
            
        }
    },
    // akhir pegawai

    viewSk: async (req, res) => {
        try {
            res.render("admin/sk/view_sk", {
                title: 'Data SK | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
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