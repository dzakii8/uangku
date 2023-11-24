const express = require('express')
const Controller = require('./controllers/controller')
const app = express()
const port = 3000
const session = require('express-session')
const isAdmin = require('./helpers/isAdmin')
const isLogin = require('./helpers/isLogin')
//isLogin

//UserId dan role di hooks

app.use(express.urlencoded({extended : false}))
app.set('view engine', 'ejs')

app.use(session({
    secret : 'apaaja',
    resave : false,
    saveUninitialized : true,
    cookie : {
        secure : false,
        sameSite : true
    }
}))

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', Controller.loginForm)
app.post('/login', Controller.loginProcess)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.registerProcess)

//session is login
app.use(isLogin)

app.get('/home', Controller.home)
//session is admin

//home search by category / 1 lg search by desc
//home sort
app.get('/listProfile',isAdmin,Controller.listProfile)
app.get('/listProfile/:id/delete',Controller.deleteProfile)

app.get('/addBudget', Controller.addBudgetForm)
app.post('/addBudget', Controller.addBudgetProcess)

app.get('/transaction', Controller.addTransactionForm)
app.post('/transaction', Controller.addTransactionProcess)

app.get('/analysis', Controller.randerAnalysis) // update
app.get('/category', Controller.randerCategory)
app.get('/category/:id', Controller.randerCategoryById)

app.get('/account', Controller.randerAccount)

app.get('/logout', Controller.logout)




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})