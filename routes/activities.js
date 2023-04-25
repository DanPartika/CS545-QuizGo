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

      //let randomizedList = await activitiesFunc.randomizeOrder(req.params.listID);
      //console.log("Dani");
      return res.render('activity/flashcards');
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
      let randomizedList = await activitiesFunc.randomizeOrder(req.params.listID);
      let wrds = randomizedList[0];
      let defs = randomizedList[1];
      
      //only want a max of 5 words in matching
      if (wrds.length>5) {
        wrds=wrds.slice(0,5);
        defs=defs.slice(0,5);
      } else if(wrds.length < 3) {
        throw "There must be at least 3 words to play matching";
      }
      return res.render('activity/matching',{words:wrds,definitions:defs});
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })

module.exports = router;