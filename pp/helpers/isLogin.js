const session = require('express-session')

function isLogin(req,res,next){
    if(req.session.login){
        return next()
    } else {
        return res.redirect('/login?err=please login first')
    }
}

module.exports = isLogin