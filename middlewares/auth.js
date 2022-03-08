const isLogin = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alertMessage', 'Session telah habis');
        req.flash('alertStatus', 'danger');
        res.redirect('/auth');
    } else {
        next();
    }
}

module.exports = isLogin;