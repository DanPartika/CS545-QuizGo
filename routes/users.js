//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const { checkUsername, checkPassword } = require('../helpers');
const { createUser, checkUser } = require('../data/users');
const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) return res.redirect('/protected');
    else return res.render('userLogin', {title: "Login"});
  });

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) return res.redirect('/protected');
    else return res.render('userAccount/register', {user:req.session.user});
  })
  .post(async (req, res) => {
    //code here for POST
    //let { usernameInput, passwordInput } = req.body
    let userData = req.body;
    let username = userData.usernameInput
    let password = userData.passwordInput
    let register = {}
    try {
      let user = checkUsername(username)
      let pass = checkPassword(password)
      register = await createUser(user, pass)

    } catch (e) {
      let templateData = {
        title: 'Register',
        error: e
      }
      return res.status(400).render('userRegister', templateData)
    }
    if (register.insertedUser) return res.status(200).redirect('/');
    else {
      let templateData = {
        title: 'Register',
        error: 'Internal Server Error'
      }
      return res.status(500).render('userRegister', templateData)
      }
  })
 
router
  .route('/login')
  .post(async (req, res) => {
    //code here for POST
    //let { username, password } = req.body
    let userData = req.body;
    let username = userData.usernameInput
    let password = userData.passwordInput
    let authCookie = {};
    let user = '';
    try {
      user = checkUsername(username);
      let pass = checkPassword(password);
      authCookie = await checkUser(user, pass);
    } catch (e) {
      let templateData = {
        title: 'Login',
        error: e
      }
      return res.status(400).render('userLogin', templateData)
    }
    if (authCookie.authenticatedUser) {
      req.session.user = {
        username: user
      }
      return res.redirect('/protected')
    } else {
      let templateData = {
        title: 'Login',
        error: 'You did not provide a valid username and/or password.'
      }
      return res.status(400).render('userLogin', templateData)
    }
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    let curDate = new Date();
    let templateData = {
      username: req.session.user.username,
      date: curDate
    }
    return res.render('private', templateData)
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.status(200).render('logout', { title: "Logged Out" });
  })


module.exports = router;