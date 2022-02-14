module.exports = {
    viewDashboard: async (req, res) => {
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'Dashboard | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
    viewPegawai: async (req, res) => {
        try {
            res.render("admin/pegawai/view_pegawai", {
                title: 'Data Pegawai | T2KU BMCK Jateng'
            })
        } catch (error) {
            console.log(error)
        }
    },
}