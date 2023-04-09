const express = require("express");
const router = express.Router();
const activitiesFunc = require('../data/activities');
const listsFunc = require('../data/list');
const helpers = require("../helpers");
const path = require('path');
const xss = require("xss");

router.route("/quiz/:listID")
  .get(async (req, res) => { 
    try {

      return res.redirect(`/lists/list/${req.params.listID}`);
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { 
    try {

      return res.redirect(`/lists/list/${req.params.listID}`);
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });


  router.route("/flash-cards/:listID")
  .get(async (req, res) => { 
    try {
      // let list = await listsFunc.getWordListById(req.params.listID);
      // let words = list.words;
      // let definitions = list.definitions;
      console.log("1")
      let randomizedList = await activitiesFunc.randomizeOrder(req.params.listID);
      console.log("2")
      return res.render('activity/flashcards',{ words:randomizedList[0], definitions:randomizedList[1] })
    } catch (error) {
      // return res.redirect(`/lists/list/${req.params.listID}`);
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { 
    try {
      
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });


  router.route("/matching/:listID")
  .get(async (req, res) => { 
    try {

    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { 
    try {

    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });


module.exports = router;