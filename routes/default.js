const express = require("express");
const router = express.Router();
const activitiesFunc = require('../data/activities');
const listsFunc = require('../data/list');
const userFunc = require('../data/users');
const helpers = require("../helpers");
const path = require('path');
const xss = require("xss");

router.route("/") //homepage
  .get(async (req, res) => { //show all lists
    //code here for GET
    //return res.sendFile(path.resolve('static/homepage.html'));
    try {
      if (req.session.user) return res.render('homepage',{title:"QuizGo",user:req.session.user});
      else return res.render('homepage',{title:"QuizGo"});
    } catch (error) {
      return res.render('error', {title: "Error", message: error})
    }
  });

  module.exports = router;