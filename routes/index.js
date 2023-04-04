const activitiesRoutes = require("./activities");
const listRoutes = require("./list");
const usersRoutes = require("./users");
const defaultRoutes = require("./default");
const path = require('path');

const constructorMethod = (app) => {
  app.use('/activity', activitiesRoutes); //quiz, flashcards, matching
  app.use('/lists', listRoutes); //add, edit, view
  app.use('/users', usersRoutes); //account, view others lists
  app.use('/', defaultRoutes); //probably just home page unless we make something else our homepage

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not Found" });
  });
};

module.exports = constructorMethod;
