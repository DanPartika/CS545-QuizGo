const mongoCollections = require("../config/mongoCollections");
const lists = mongoCollections.wordList;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

const createList = async(name, username, words, definitions, numCorrect, numIncorrect) => {
  let params = helpers.checkWordList(name,username, words, definitions, numCorrect, numIncorrect);
  if (!params) throw "Error in creating word list";
  const wordListCollection = await lists();
  const existingLst = await wordListCollection.findOne({ name:params.name, words:params.words, definitions:params.definitions, numCorrect:params.numCorrect, numIncorrect:params.numIncorrect});
  if (existingLst !== null) throw `This word list has been listed already.`;
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  let newWordList = {
    name: params.name,
    user: username,
    words:params.words, 
    definitions:params.definitions, 
    numCorrect:params.numCorrect, 
    numIncorrect:params.numIncorrect,
    datePosted: today
  }
  const insertInfo = await wordListCollection.insertOne(newWordList);
  if (insertInfo.insertedCount === 0) throw "Could not add word list";
  const newId = insertInfo.insertedId.toString();
  const lst = await getWordListById(newId);
  
  lst._id = lst._id.toString();
  return lst._id;
}

const addWordsToList = async(id, word, definition) => {
  let params = helpers.checkAddWord(id, word, definition);
  if (!params) throw "Error in adding to word list";
  const wordListCollection = await lists();
  const list = await getWordListById(id.toString());
  //if (list !== null) throw `This word list does not exist.`;
  let wrds = list.words;
  wrds[list.words.length] = params.word;
  let defs = list.definitions;
  defs[list.definitions.length] = params.definition;
  let newWordList = {
    name:list.name,
    user: list.user,
    words:wrds, 
    definitions:defs, 
    numCorrect:list.numCorrect, 
    datePosted: list.datePosted,
    numIncorrect:list.numIncorrect
  }
  const updateInfo = await wordListCollection.replaceOne(
    { _id: new ObjectId(id) },
    newWordList
  );
    if(!updateInfo.acknowledged || updateInfo.matchedCount !== 1 || updateInfo.modifiedCount !== 1) throw "cannot update wordlist"
    const update = await getWordListById(id);
  
    update._id = update._id.toString();
    return update;  
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
  const wordList = await lists();
  const newLists = await wordList.findOne({_id: new ObjectId(listId)});
  if (!newLists) throw "No word list with that id";
  newLists._id = newLists._id.toString();
  return newLists;
}

module.exports= {
  createList,
  getAllWordLists,
  getWordListById,
  addWordsToList
}