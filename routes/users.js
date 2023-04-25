//require express, express router and bcrypt as shown in lecture code
const express = require('express');
const { checkUsername, checkPassword } = require('../helpers');
const { createUser, checkUser, getUser } = require('../data/users');
const router = express.Router();
const xss = require('xss');
const { getWordListByCreatedUser } = require('../data/list');

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) return res.redirect('/protected');
    else return res.render('userAccount/login', {title: "Login"});
  });

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    try {
      if (req.session.user) return res.redirect('/protected');
      else return res.render('userAccount/register', {user:req.session.user});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
  })
  .post(async (req, res) => {
    //code here for POST
    //let { usernameInput, passwordInput } = req.body
    let userData = req.body;
    let firstname = xss(userData.firstnameInput);
    let lastname = xss(userData.lastnameInput);
    let email = xss(userData.emailInput);
    let username = xss(userData.usernameInput);
    let password = xss(userData.passwordInput);
    let register = {};

    try {
      register = await createUser(firstname, lastname, email, username, password);
    } catch (e) {
      return res.status(400).render('userAccount/register', {title: 'Register', error: e})
    }
    if (register.insertedUser) return res.status(200).redirect('/'); //??when they log in send to homepage
    else return res.status(500).render('userAccount/register', {title: 'Register', error: 'Internal Server Error, please try again later'})
  })
 
router
  .route('/login')
  .get(async (req, res) => {
    try {
      if (req.session.user) return res.redirect('/');
      else return res.render('userAccount/login',{user:req.session.user});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
    
  })
  .post(async (req, res) => {
    //code here for POST
    let userData = req.body;
    let username = xss(userData.usernameInput)
    let password = xss(userData.passwordInput)
    let authCookie = {};
    let user = '';
    try {
      user = checkUsername(username);
      let pass = checkPassword(password);
      authCookie = await checkUser(user, pass);
    } catch (e) {
      return res.status(400).render('error', {title: 'Login Error', error: e, user:req.session.user})
    }
    if (authCookie.authenticatedUser) {
      req.session.user = {
        username: user
      }
      return res.redirect('/users/protected'); //Where does this go?
    } else return res.status(400).render('userAccount/login', {title: 'Login', error: 'You did not provide a valid username and/or password.', user: req.session.user})
  })

router
  .route('/protected')
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      try {
        let curDate = new Date();
        let user = await getUser(req.session.user.username);
        let userLists = await getWordListByCreatedUser(user.username);
        if(Array.isArray(userLists)) return res.render('userAccount/userpage', {date: curDate, user: user, userLists: userLists});
        else return res.render('userAccount/userpage', {date: curDate, user: user});
      } catch (error) {
        return res.render('error',{title:"Error: Cannot get account page",error:error,user:req.session.user})
      }

    } else {
      return res.redirect('/users/login');
    }
  })

router
  .route('/logout')
  .get(async (req, res) => {
    //code here for GET
    let username = req.session.user.username;
    req.session.destroy();
    res.status(200).render('userAccount/logout', { title: "Logged Out",username:username});
  })

module.exports = router;