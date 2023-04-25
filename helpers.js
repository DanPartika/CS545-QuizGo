//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
const { ObjectId } = require("mongodb");

function checkStr(str) {
  if (!str) throw 'Please input a string.'
  if (typeof str !== 'string') throw 'Input a string.'
  const trimmed = str.trim();
  if (trimmed.length < 1) throw 'Input cannot be just spaces.'
  return trimmed;
}

//accepts lists of strings
function checkArr(arr) {
  if (!arr || !Array.isArray(arr)) throw "You must provide an array";
  //if (arr.length === 0) throw "Array cannot be length 0";
  arr.forEach(str => {
    checkStr(str);
  });
  return arr;
}

function checkNum(num) {
  if (isNaN(num)) throw `${num} must be a number`;
  return num;
}

function checkID(id) {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0) throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  return id;
}

//The Apartment complex/building name; can be N/A
function checkName(apartmentName) {
  if(/^\d+$/.test(apartmentName)) throw "Apartment Name cannot contain only numbers"
  
  if (apartmentName.length < 3 ) throw "title must be at least 3 characters";
  return checkStr(apartmentName);
}



function checkWordList(name, username, words, definitions, numCorrect, numIncorrect) {
  return {
    name: checkStr(name),
    username: checkUsername(username),
    words: checkArr(words), 
    definitions: checkArr(definitions), 
    numCorrect: checkNum(numCorrect), 
    numIncorrect: checkNum(numIncorrect)
  };
}

function checkAddWord(id, word, definition) {
  return {
    id: checkID(id),
    word: checkStr(word),
    definition: checkStr(definition)
  };
}

//FUNCTIONS FOR DATA/USERS.JS
function checkEmail(email) {
  if (! (email.includes("@") && email.includes(".")) ) throw "enter a vaild email";
  return checkStr(email);
}


function checkUsername(username) {
  if (!username) throw 'Username does not exist.'
  if (typeof username !== 'string') throw 'Username is not a string.'
  const trimmed = username.trim();
  if (trimmed.length < 1) throw 'Username must contain at least 4 characters.'
  if (trimmed.length < 4) throw 'Username must be at least 4 characters long.'
  const regex = /^[0-9a-zA-Z]+$/ //regex that checks for a-z, 0-9 insensitive and no spaces
  if (! regex.test(trimmed)) throw 'Username can only contain only alphanumeric characters.'
  return trimmed.toLowerCase();
}

function checkPassword(password) {
  if (! password) throw 'Password does not exist.'
  if (typeof password !== 'string') throw 'Password must be a string.'
  const trimmed = password.trim();
  if (trimmed.length < 1) throw 'Password cannot be empty spaces.'
  if (trimmed.length < 6) throw 'Password must be at least 6 characters long.'
  let regex = /^\S*$/ //regex that checks if string contains any spaces
  if (! regex.test(trimmed)) throw 'password cannot contain spaces' 
  if (trimmed == trimmed.toLowerCase()) throw 'Password must contain at least 1 uppercase character.'
  regex = /[0-9]/ 
  if (! regex.test(trimmed)) throw 'Password must contain at least 1 number.'
  regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
  if (! regex.test(trimmed)) throw 'Password must contain at least 1 special character.'
  return trimmed;
}

function checkUserParameters(firstName, lastName, email, username, password) {
  return {
    firstName:checkName(firstName), 
    lastName:checkName(lastName), 
    email:checkEmail(email),  
    username: checkUsername(username),
    password: checkPassword(password)
  }
}
function checkUserParameters1(userID, firstName, lastName, email, userName){
  return {
    userID: checkID(userID),
    firstName:checkName(firstName), 
    lastName:checkName(lastName), 
    email:checkEmail(email), 
    userName: checkUsername(userName)
  }
}



module.exports = {
  checkID,
  checkStr,
  checkNum,
  checkWordList,
  checkUserParameters,
  checkUserParameters1,
  checkUsername,
  checkPassword,
  checkAddWord
};
