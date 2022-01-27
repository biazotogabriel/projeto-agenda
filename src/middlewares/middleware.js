exports.middleWareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user
    next()
}

exports.checkCsrfError = (err, req, res, next) => {
    //if (err && err.code === 'EBADCSRFTOKEN') {
    if (err) {
        return res.render('404') //geralmente se renderiza uma página 404
    }
    //}
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash('errors', 'você precisa fazer login')
        req.session.save(() => res.redirect('/'))
        return
    }
    next()
}