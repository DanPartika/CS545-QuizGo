const helpers = require("../helpers");
const { users } = require('../config/mongoCollections');
const bcrypt = require('bcrypt');
const saltRounds = 4;

const createUser = async (
  firstName,
  lastName,
  email,
  username, 
  password
  ) => {
  //check if username exists
  let params = helpers.checkUserParameters(firstName, lastName, email, username, password);
  if(!params) throw "error in checking reviews parameters"
  const usersCollection = await users();
  const account = await usersCollection.findOne({ username: params.username });
  if (account !== null) throw `Account with username ${params.username} exists already.`;
  const UserEmail = await usersCollection.findOne({ email: params.email });
  if (UserEmail !== null) throw `Account with email ${params.email} exists already.`;

  const hash = await bcrypt.hash(params.password, saltRounds);
  //added a date created
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  const newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email,
    userCreated: today,
    username: params.username,
    password: hash, 
  }
  const insertInfo = await usersCollection.insertOne(newUser);
  if (! insertInfo.acknowledged || ! insertInfo.insertedId) throw 'Could not add user';
  const newId = insertInfo.insertedId.toString();
  const U = await getUser(params.username);
  U._id = U._id.toString();
  return {insertedUser: true};
};


const checkUser = async (username, password) => { //login verfier
  const user = helpers.checkUsername(username)
  const pass = helpers.checkPassword(password)
  const collection = await users();
  const account = await collection.findOne({ username: user }); //find by username b/c that is a key in our data as is _id
  if (account === null) throw `Either the username or password is invalid`
  let match = false
  try {
    match = await bcrypt.compare(pass, account.password);
  } catch (e) {
      // failsafe for .compare function
  }
  if (!match) throw `Either the username or password is invalid`
  return {authenticatedUser: true};
};

const getUser = async (username) => {
  username = helpers.checkUsername(username);
  const usersCollection = await users();
  const user = await usersCollection.findOne({username: username});
  if (user === null) throw "No user with that username found";
  user._id = user._id.toString();
  return user;
};


module.exports = {createUser, checkUser, getUser};