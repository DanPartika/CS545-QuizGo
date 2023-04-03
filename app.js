// Setup server, session and middleware here.
const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

// Authentication middleware
app.use('/protected', async (req, res, next) => {
  if (req.session.user) next()
  else {
    return res.status(403).render('forbiddenAccess')
  }
})

// Logging middleware
app.use(async (req, res, next) => {
  const timestamp = new Date().toUTCString()
  const method = req.method
  const route = req.originalUrl
  const authCookie = `${req.session.user ? 'Authenticated' : 'Non-Authenticated'} User`
  const log = `[${timestamp}]: ${method} ${route} (${authCookie})`
  console.log(log)
  next()
})

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')




configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
