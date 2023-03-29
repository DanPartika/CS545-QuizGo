//Here you will require both route files and export the constructor method as shown in lecture code where there is more than one route file. Look at lecture 6 lecture code for example

// when the route is /Apartments use the routes defined in Apartments.js routing file, when the route is /reviews use the routes defined in reviews.js routing file, all other enpoints should return a 404 as shown in the lecture code.
const quizRoutes = require("./quiz");
const usersRoutes = require("./users");
const path = require('path');

const constructorMethod = (app) => {
  app.use('/account', usersRoutes);
  app.use('/', quizRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not Found" });
  });
};

module.exports = constructorMethod;
