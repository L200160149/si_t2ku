module.exports = {
    viewDashboard: async (req, res) => {
        try {
            res.render("admin/dashboard/view_dashboard", {
                title: 'T2KU BMCK Jateng | Dashboard'
            })
        } catch (error) {
            console.log(error)
        }
    }
}