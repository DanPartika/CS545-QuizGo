const mongoCollections = require("../config/mongoCollections");
const lists = mongoCollections.wordList;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

const createList = async(words, definitions, numCorrect, numIncorrect) => {
  let params = helpers.checkWordList(words, definitions, numCorrect, numIncorrect);
  if (!params) throw "Error in creating word list";
  const wordListCollection = await lists();
  const existingLst = await apartmentCollection.findOne({ words:params.words, definitions:params.definitions, numCorrect:params.numCorrect, numIncorrect:params.numIncorrect});
  if (existingLst !== null) throw `This word list has been listed already.`;
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  let newWordList = {
    words:params.words, 
    definitions:params.definitions, 
    numCorrect:params.numCorrect, 
    datePosted: today,
    numIncorrect:params.numIncorrect
  }
  const insertInfo = await wordListCollection.insertOne(newWordList);
  if (insertInfo.insertedCount === 0) throw "Could not add word list";
  const newId = insertInfo.insertedId.toString();
  const lst = await getWordListById(newId);
  
  lst._id = lst._id.toString();
  return lst._id;
}

const getAllWordLists = async () => {
  const wordListCollection = await lists();
  const wordList = await wordListCollection.find({}).toArray(); //?
  if (!wordList) throw "Could not get all word lists";
  wordList.forEach((list) => {
    list._id = list._id.toString();
  });
  return wordList;
}

const getWordListById = async (listId) => {
  listId = helpers.checkID(listId);
  const wordList = await getAllWordLists();
  const newLists = await wordList.findOne({_id: ObjectId(listId)});
  if (!newLists) throw "No word list with that id";
  newLists._id = newLists._id.toString();
  return newLists;
}

module.exports= {
  createList,
  getAllWordLists,
  getWordListById
}