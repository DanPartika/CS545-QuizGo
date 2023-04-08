const express = require("express");
const router = express.Router();
const helpers = require("../helpers");
const path = require('path');
const xss = require("xss");

router.route("/quiz/:listID")
  .get(async (req, res) => { //get the page where you can add list
    try {

      return res.redirect(`/lists/list/${req.params.listID}`);
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { //if button to add list was clicked, we are here
    try {

      return res.redirect(`/lists/list/${req.params.listID}`);
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });


  router.route("/flash-cards/:listID")
  .get(async (req, res) => { //get the page where you can add list
    try {
      
      return res.redirect(`/lists/list/${req.params.listID}`);
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { //if button to add list was clicked, we are here
    try {
      
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });


  router.route("/matching/:listID")
  .get(async (req, res) => { //get the page where you can add list
    try {

    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { //if button to add list was clicked, we are here
    try {

    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });




module.exports = router;
