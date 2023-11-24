const session = require('express-session')

function isAdmin(req,res,next){
    if(req.session.role == 'admin'){
        return next()
    } else {
        return res.redirect('/home?err=only admin')
    }
}

module.exports = isAdmin