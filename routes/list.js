const express = require("express");
const router = express.Router();
const activitiesFunc = require('../data/activities');
const listsFunc = require('../data/list');
const userFunc = require('../data/users');
const helpers = require("../helpers");
const path = require('path');
const xss = require("xss");

router.route("/")
  .get(async (req, res) => { //display all the wordlists
    try {
      
      let wordLists = [];
      wordLists = await listsFunc.getAllWordLists();
      const data = {list:wordLists,user:req.session.user};
      return res.render('list/lists', data);
      
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });

router.route("/list/:id") //view specific list
  .get(async (req, res) => {

  });

  

router.route("/createList")
  .get(async (req, res) => { //get the page where you can add list
    try {
      if (req.session.user) return res.render('list/createList',{title:"QuizGo",user:req.session.user});
      else return res.render('userAccount/login',{user:req.session.user, error:"you must be logged in to create list"});
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { //if button to add list was clicked, we are here
    try {
      if (req.session.user) {
        let wordListData = req.body;
        let name = xss(wordListData.wordlistNameInput);
        let listID = await listsFunc.createList(name,[],[],0,0);
        let list = await listsFunc.getWordListById(listID);
        return res.render('list/addList', {list:list});
      } else return res.render('userAccount/login',{user:req.session.user, error:"you must be logged in to create list"});
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });

  router.route("/addList/:listID")
  .get(async (req, res) => { //get the page where you can add list
    try {
      if (req.session.user) return res.render('list/addList',{title:"QuizGo",user:req.session.user});
      else return res.render('userAccount/login',{user:req.session.user});
    } catch (error) {
      return res.render('error', {title:error,user:req.session.user});
    }
  })
  .post(async (req, res) => { //if button to add list was clicked, we are here
    try {
      if (req.session.user) {
        let wordListData = req.body;
        let word = xss(wordListData.wordInput);
        let definition = xss(wordListData.definitionInput);
        console.log("h");
        let listID = await listsFunc.addWordsToList(req.params.listID, word, definition);
        console.log("i");
        let list = await listsFunc.getWordListById(listID);
        console.log("j");
        return res.render('list/addList', {list:list});
      } else {
        return res.render('userAccount/login',{user:req.session.user})
      }
    } catch (error) {
      return res.render('error',{title:error,user:req.session.user})
    }
  });

module.exports = router;